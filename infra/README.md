# Déploiement du front SOS Yoon (AWS)

S3 privé + CloudFront, décrits avec Terraform, mis en ligne par GitHub Actions.
Une seule infrastructure : la production, sur une adresse `https://xxxx.cloudfront.net`
(pas de domaine pour l'instant).

Où placer les fichiers dans le dépôt du front :

```
infra/                       versions.tf, variables.tf, main.tf, github.tf, outputs.tf,
                             terraform.tfvars.example, README.md
.github/workflows/deploy.yml
```

Ajoutez dans `.gitignore` : `infra/.terraform/`, `infra/terraform.tfvars`, `infra/backend.hcl`.
Gardez en revanche `infra/.terraform.lock.hcl` dans Git.

---

## 1. Outils sur votre poste

- AWS CLI v2 : `aws --version`
- Terraform 1.10 ou plus (ou OpenTofu 1.10 ou plus) : `terraform version`

## 2. Se connecter au compte AWS de l'organisation

Selon ce que l'administrateur vous a donné :

- **IAM Identity Center (portail d'accès AWS)** : `aws configure sso`, puis
  `aws sso login --profile <nom>` et `export AWS_PROFILE=<nom>`.
- **Utilisateur IAM avec clés d'accès** : `aws configure`.

Vérifiez que vous êtes dans le bon compte (notez l'`Account`, il sert plus bas) :

```
aws sts get-caller-identity
```

Choisissez la **région** avec les autres équipes (la même pour tout le monde est plus simple à lire dans
la console et la facture). Elle sera notée `<REGION>` ci-dessous.

## 3. Créer le bucket qui garde l'état de Terraform (une seule fois)

Il garde la description de l'infrastructure hors de votre poste. Remplacez `<REGION>` et `<ACCOUNT_ID>` :

```
aws s3api create-bucket --bucket sos-yoon-tfstate-<ACCOUNT_ID> --region <REGION> \
  --create-bucket-configuration LocationConstraint=<REGION>

aws s3api put-bucket-versioning --bucket sos-yoon-tfstate-<ACCOUNT_ID> \
  --versioning-configuration Status=Enabled

aws s3api put-public-access-block --bucket sos-yoon-tfstate-<ACCOUNT_ID> \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

(Pour la région `us-east-1`, retirez la ligne `--create-bucket-configuration`.)

Créez ensuite `infra/backend.hcl` :

```
bucket       = "sos-yoon-tfstate-<ACCOUNT_ID>"
key          = "front/terraform.tfstate"
region       = "<REGION>"
encrypt      = true
use_lockfile = true
```

## 4. Remplir les variables

```
cd infra
cp terraform.tfvars.example terraform.tfvars
```

Éditez `terraform.tfvars` : `aws_region` et `github_repo` (ex. `mon-organisation/sos-yoon-front`).

Si l'administrateur a déjà un fournisseur OIDC GitHub dans ce compte, mettez
`create_github_oidc_provider = false`. En cas de doute, laissez `true` : si Terraform répond
`EntityAlreadyExists`, passez à `false` et relancez.

## 5. Créer l'infrastructure

```
terraform init -backend-config=backend.hcl
terraform plan
```

Lisez le plan : il doit **créer** un bucket S3 et ses réglages, une distribution CloudFront (avec sa
fonction et sa politique d'en-têtes), un fournisseur OIDC (sauf si désactivé) et un rôle IAM. Il ne doit rien
détruire. Puis :

```
terraform apply
```

Au bout de 5 à 10 minutes (CloudFront est lent à se créer), Terraform affiche cinq valeurs.
Gardez-les : `terraform output` les réaffiche.

## 6. Donner ses réglages à GitHub

Dépôt GitHub > Settings > Secrets and variables > Actions > onglet **Variables** (pas Secrets : aucune
de ces valeurs n'est secrète). Créez :

| Variable | Valeur |
| --- | --- |
| `AWS_ROLE_ARN` | `role_deploiement_arn` |
| `AWS_REGION` | `region` |
| `S3_BUCKET` | `bucket_front` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` |
| `VITE_API_URL`, `VITE_CHATBOT_PRO_URL`, `VITE_SOXNA_WS_URL` | adresses fournies par les équipes (noms à aligner sur ceux du code) |

## 7. Envoyer l'adresse aux autres équipes

La valeur `adresse_du_site` (`https://xxxx.cloudfront.net`) est ce que le backend et l'équipe IA doivent
autoriser : CORS pour le backend et le chatbot pro, vérification d'origine pour la connexion WebSocket de
Soxna. Sans cela, le site s'affiche mais ne peut rien appeler.

Quand les adresses des services sont connues, ajoutez-les dans `connect_src` de `terraform.tfvars`
(`https://` pour le backend et le chatbot, `wss://` pour Soxna), puis `terraform plan` et `terraform apply`.
La politique de contenu est publiée en mode « signalement » : ouvrez la console du navigateur, parcourez le
site, corrigez ce qu'elle signale, puis passez `csp_enforce = true`.

## 8. Première mise en ligne

Depuis la branche à publier, à jour et poussée :

```
git tag v1.0.0
git push origin v1.0.0
```

L'onglet Actions montre le déroulé : tests, build, envoi. Si un test échoue, rien n'est envoyé.

## 9. Vérifier

Remplacez l'adresse par la vôtre :

```
# Le site répond en HTTPS
curl -sI https://xxxx.cloudfront.net/ | head -20

# Une route de l'application renvoie la page (200)
curl -sI https://xxxx.cloudfront.net/connexion | head -5

# Un fichier qui n'existe pas renvoie 404, pas une page HTML
curl -sI https://xxxx.cloudfront.net/assets/inexistant.js | head -3

# Le service worker n'est pas gardé en cache
curl -sI https://xxxx.cloudfront.net/sw.js | grep -i cache-control

# L'adresse directe du bucket refuse l'accès (403)
curl -sI https://<bucket_front>.s3.<REGION>.amazonaws.com/index.html | head -3
```

Puis ouvrez le site dans Chrome : « Installer l'application » doit être proposé, et le micro de Soxna doit
demander l'autorisation.

Mesure de latence depuis Dakar (à faire une fois) : `curl -sI https://xxxx.cloudfront.net/` affiche
`x-amz-cf-pop` (le point de présence qui répond). Notez-le avec le temps de chargement ressenti.

## Retour arrière

Actions > Déploiement en production > **Run workflow**, puis, dans « Use workflow from », choisissez
l'**étiquette** précédente (par exemple `v1.0.0`) et lancez. Le site reconstruit cette version. Les anciens
fichiers `assets/*` n'ont jamais été supprimés : l'ancienne version refonctionne en quelques minutes.

## Si ça bloque

- **`AccessDenied` sur `iam:` ou `cloudfront:`** : votre accès dans l'organisation ne suffit pas.
  Demandez à l'administrateur d'ajouter la création de rôles IAM et de distributions CloudFront, ou de créer
  ces deux éléments pour vous.
- **`Your account must be verified before you can add new CloudFront resources`** : compte récent. Il faut
  ouvrir une demande au support AWS ; l'administrateur de l'organisation peut le faire.
- **`EntityAlreadyExists` sur le fournisseur OIDC** : mettez `create_github_oidc_provider = false`.
- **Région refusée (`explicit deny`)** : l'organisation limite les régions. Prenez une région autorisée.
- **Le workflow échoue sur `Could not assume role`** : l'étiquette doit commencer par `v` et le dépôt
  doit correspondre exactement à `github_repo`. Une exécution depuis une branche est refusée volontairement.
- **Alerte de dépense** : AWS Budgets est probablement géré au niveau de l'organisation. Demandez à
  l'administrateur une alerte par e-mail sur ce compte.