output "adresse_du_site" {
  description = "Adresse publique du front : à communiquer au backend et à l'équipe IA (CORS, origine WebSocket)"
  value       = "https://${aws_cloudfront_distribution.front.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "Variable GitHub CLOUDFRONT_DISTRIBUTION_ID"
  value       = aws_cloudfront_distribution.front.id
}

output "bucket_front" {
  description = "Variable GitHub S3_BUCKET"
  value       = aws_s3_bucket.front.bucket
}

output "role_deploiement_arn" {
  description = "Variable GitHub AWS_ROLE_ARN"
  value       = aws_iam_role.deploiement.arn
}

output "region" {
  description = "Variable GitHub AWS_REGION"
  value       = var.aws_region
}
