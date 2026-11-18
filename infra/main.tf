data "aws_caller_identity" "current" {}

locals {
  bucket_name = "${var.project}-front-${data.aws_caller_identity.current.account_id}"

  # Politique de contenu : seules ces origines sont autorisées pour la page
  csp = join("; ", [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "connect-src ${join(" ", concat(["'self'"], var.connect_src))}",
    "worker-src 'self'",
    "manifest-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ])
}

# ---------------------------------------------------------------------------
# Bucket S3 : privé, lisible uniquement par CloudFront
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "front" {
  bucket = local.bucket_name
}

resource "aws_s3_bucket_public_access_block" "front" {
  bucket                  = aws_s3_bucket.front.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "front" {
  bucket = aws_s3_bucket.front.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "front" {
  bucket = aws_s3_bucket.front.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Les anciennes versions de index.html, sw.js et du manifeste restent récupérables 30 jours
resource "aws_s3_bucket_versioning" "front" {
  bucket = aws_s3_bucket.front.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "front" {
  bucket     = aws_s3_bucket.front.id
  depends_on = [aws_s3_bucket_versioning.front]

  rule {
    id     = "purge-anciennes-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

# ---------------------------------------------------------------------------
# CloudFront
# ---------------------------------------------------------------------------

resource "aws_cloudfront_origin_access_control" "front" {
  name                              = "${var.project}-front"
  description                       = "Accès de CloudFront au bucket du front"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Repli SPA : index.html seulement pour les adresses sans extension (/dossiers, /agenda).
# Un fichier absent (/assets/vieux.js) reste une vraie erreur 404.
resource "aws_cloudfront_function" "repli_spa" {
  name    = "${var.project}-repli-spa"
  runtime = "cloudfront-js-2.0"
  comment = "Renvoie index.html pour les routes de l'application"
  publish = true

  code = <<-EOT
    function handler(event) {
      var request = event.request;
      var dernier = request.uri.split('/').pop();
      if (dernier.indexOf('.') === -1) {
        request.uri = '/index.html';
      }
      return request;
    }
  EOT
}

resource "aws_cloudfront_response_headers_policy" "securite" {
  name    = "${var.project}-securite"
  comment = "En-têtes de sécurité du front"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = false
      preload                    = false
      override                   = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }

  custom_headers_config {
    # Soxna utilise le micro : autorisé pour le site lui-même, fermé pour les autres pages intégrées
    items {
      header   = "Permissions-Policy"
      value    = "microphone=(self), camera=(), payment=()"
      override = true
    }

    items {
      header   = var.csp_enforce ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only"
      value    = local.csp
      override = true
    }
  }
}

data "aws_cloudfront_cache_policy" "optimise" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_distribution" "front" {
  enabled         = true
  is_ipv6_enabled = true
  http_version    = "http2and3"
  price_class     = var.price_class
  comment         = "${var.project} : front (PWA)"

  origin {
    origin_id                = "s3-front"
    domain_name              = aws_s3_bucket.front.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.front.id
  }

  default_cache_behavior {
    target_origin_id           = "s3-front"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.optimise.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.securite.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.repli_spa.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Sans domaine personnalisé : certificat fourni par CloudFront (xxx.cloudfront.net).
  # Avec ce certificat, la version minimale de TLS n'est pas réglable ; elle le deviendra
  # avec un domaine et un certificat ACM.
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Seule cette distribution peut lire le bucket. ListBucket fait renvoyer 404 (et non 403)
# quand un fichier n'existe pas.
data "aws_iam_policy_document" "bucket" {
  statement {
    sid       = "LectureParCloudFront"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.front.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.front.arn]
    }
  }

  statement {
    sid       = "ListeParCloudFront"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.front.arn]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.front.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "front" {
  bucket     = aws_s3_bucket.front.id
  policy     = data.aws_iam_policy_document.bucket.json
  depends_on = [aws_s3_bucket_public_access_block.front]
}
