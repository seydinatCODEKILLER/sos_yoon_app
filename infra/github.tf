# Rôle que GitHub Actions obtient pour déployer : temporaire, sans clé AWS stockée dans GitHub.

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 1 : 0

  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  # Ignoré par AWS pour GitHub, mais exigé par les anciennes versions du fournisseur Terraform
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 0 : 1

  url = "https://token.actions.githubusercontent.com"
}

locals {
  oidc_provider_arn = var.create_github_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn

  # Les dépôts récents écrivent leur identité avec des numéros fixes : owner@id/depot@id
  repo_claim = coalesce(var.github_oidc_repo_claim, var.github_repo)
}

# Seul ce dépôt, et seulement pour une étiquette de version (v1.0.0, v1.0.1…), peut prendre ce rôle
data "aws_iam_policy_document" "confiance_github" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.repo_claim}:ref:refs/tags/v*"]
    }
  }
}

resource "aws_iam_role" "deploiement" {
  name               = "${var.project}-front-deploiement"
  description        = "Déploiement du front depuis GitHub Actions"
  assume_role_policy = data.aws_iam_policy_document.confiance_github.json
}

# Écrire dans ce bucket et invalider le cache de cette distribution, rien d'autre
data "aws_iam_policy_document" "droits_deploiement" {
  statement {
    sid       = "ListerLeBucket"
    actions   = ["s3:ListBucket", "s3:GetBucketLocation"]
    resources = [aws_s3_bucket.front.arn]
  }

  statement {
    sid       = "EcrireLesFichiers"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.front.arn}/*"]
  }

  statement {
    sid       = "InvaliderLeCache"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.front.arn]
  }
}

resource "aws_iam_role_policy" "deploiement" {
  name   = "deploiement-front"
  role   = aws_iam_role.deploiement.id
  policy = data.aws_iam_policy_document.droits_deploiement.json
}
