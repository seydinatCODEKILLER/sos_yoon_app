variable "aws_region" {
  description = "Région du bucket S3 (celle choisie avec les autres équipes, par exemple eu-west-3)"
  type        = string
}

variable "project" {
  description = "Préfixe des noms de ressources"
  type        = string
  default     = "sos-yoon"
}

variable "github_repo" {
  description = "Dépôt GitHub autorisé à déployer, au format propriétaire/dépôt"
  type        = string

  validation {
    condition     = can(regex("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$", var.github_repo))
    error_message = "Utilisez le format propriétaire/dépôt, par exemple mon-equipe/sos-yoon-front."
  }
}

variable "github_oidc_repo_claim" {
  description = "Identité du dépôt telle que GitHub l'écrit dans son jeton, entre « repo: » et « :ref: ». Pour un dépôt récent, elle contient les numéros du propriétaire et du dépôt (ex. mon-equipe@123/mon-depot@456). Laissez vide pour utiliser github_repo."
  type        = string
  default     = null
}

variable "create_github_oidc_provider" {
  description = "false si le compte AWS a déjà un fournisseur OIDC pour GitHub (un seul est permis par compte)"
  type        = bool
  default     = true
}

variable "price_class" {
  description = "Classe de prix CloudFront. PriceClass_All couvre aussi les points de présence africains"
  type        = string
  default     = "PriceClass_All"
}

variable "connect_src" {
  description = "Origines que la page peut appeler : backend, chatbot pro (https://) et Soxna (wss://)"
  type        = list(string)
  default     = []
}

variable "csp_enforce" {
  description = "false : la politique de contenu ne fait que signaler (Report-Only). true : elle bloque"
  type        = bool
  default     = false
}
