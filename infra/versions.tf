terraform {
  # use_lockfile (verrou de l'état dans S3, sans DynamoDB) demande Terraform 1.10 ou plus
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.81, < 7.0"
    }
  }

  # Les valeurs (bucket, région) viennent de backend.hcl : un bloc backend n'accepte pas de variables
  backend "s3" {}
}

# CloudFront est un service mondial : aucun certificat ni ressource en us-east-1 n'est nécessaire
# tant qu'on garde l'adresse xxx.cloudfront.net (pas de domaine personnalisé).
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = var.project
      ManagedBy = "terraform"
    }
  }
}
