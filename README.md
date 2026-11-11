# SOS Yoon ⚖️ — Application (PWA)

Plateforme de mise en relation entre des **particuliers** confrontés à une situation juridique urgente et des **professionnels du droit** au Sénégal (avocats, huissiers, notaires, juristes-conseil).

> **Statut actuel** : les trois espaces (**particulier, professionnel, administrateur**) sont construits et **branchés sur le back-end réel** (Spring Boot, base `/api/v1`, JWT). Les mocks ont été retirés ou sont en cours de retrait (voir [Nettoyage restant](#nettoyage-restant)). Le build de production (`pnpm run build` = `tsc -b && vite build`) passe et sert au déploiement sur Vercel. **Prochaines étapes : recette de bout en bout, déploiement du back-end en HTTPS, finitions PWA (push, offline) et durcissement avant la mise en production.**
>
> **Ce dépôt ne contient pas la landing page marketing.** Elle vit dans un projet **Next.js séparé** (`sos-yoon-web`). Ce dépôt est dédié à l'application connectée (espaces particulier, professionnel, administrateur) et à sa configuration PWA.

> **Source de vérité** : le document *« SOS Yoon — Spécification des endpoints de l'API, v0.3.4 (29 oct. 2026) »* (122 endpoints, base `/api/v1`) décrit le contrat avec le back-end. En cas de divergence entre ce README et le document, c'est le document qui prévaut. Les écarts connus entre le front/back et la spécification sont listés dans [Écarts avec la spécification](#écarts-avec-la-spécification-à-intégrer-au-document).

## À propos

SOS Yoon couvre les quatre métiers du droit :

- **Avocat**
- **Huissier**
- **Notaire**
- **Juriste-conseil**

Le particulier dépose une demande d'aide (vocale ou écrite) ; un moteur de triage identifie le métier pertinent et l'oriente vers un professionnel inscrit et validé. Les professionnels sont vérifiés avant d'accéder à leur espace. Pour le MVP, **l'échange entre le particulier et le professionnel se fait par appel ou WhatsApp** : il n'y a pas de messagerie intégrée.

## Fonctionnalités

| Espace | Fonctionnalités | Statut |
|---|---|---|
| Visiteur (sans compte) | Accueil, demande d'aide sans compte (compte créé à l'envoi), assistante Soxna Yoon, pages légales (CGU, confidentialité) | ✅ |
| Particulier | Inscription OTP SMS + code secret, connexion par code secret, demande d'aide (écrite ou vocale), suivi en direct, historique, notifications, profil (infos, photo, code secret, préférences, suppression du compte), assistante Soxna Yoon | ✅ — reste : voir [Reste à faire](#reste-à-faire) |
| Professionnel | Inscription multi-étapes avec justificatifs, vérification email, validation du dossier, abonnement, tableau de bord, demandes reçues (sollicitations), dossiers, agenda, notifications, profil | ✅ |
| Administrateur | Connexion avec double authentification, tableau de bord (indicateurs et graphiques animés), utilisateurs, validation des professionnels, abonnements, demandes, journal d'audit, paramètres (profil, plateforme, sécurité, sessions) | ✅ |
| Moteur IA / triage (admin) | Réglage du moteur de triage | 🔜 |

## Organisation multi-dépôts

| Dépôt | Rôle | Stack |
|---|---|---|
| **sos-yoon-web** | Landing page marketing, SEO, acquisition | Next.js |
| **sos-yoon-pwa** (ce dépôt) | Application connectée | React + Vite |
| Back-end | API REST, base de données, sécurité | Spring Boot |

Les deux dépôts front partagent les mêmes tokens visuels du design system, mais ont chacun leur outillage (build, PWA, routing).

## Stack technique

### Frontend (ce dépôt)

| Domaine | Technologie | Statut |
|---|---|---|
| Framework | React 19 + Vite | ✅ |
| Langage | TypeScript | ✅ |
| Style | Tailwind CSS v4 | ✅ |
| Composants UI | shadcn/ui sur **Base UI** (pas Radix) | ✅ |
| Animations | `motion/react` | ✅ |
| Routing | React Router v7 | ✅ |
| État serveur | TanStack Query | ✅ (`QueryProvider`) |
| État global | Zustand (`auth.store`, demande en attente) | ✅ |
| Formulaires | React Hook Form + Zod v4 | ✅ |
| Client HTTP | Axios (`apiClient` + `rawClient`) | ✅ |
| Notifications UI | Sonner via `shared/lib/toast.ts` | ✅ |
| Stockage local | `localStorage` (persist Zustand), IndexedDB (message vocal en attente) | ✅ |
| Cartes | Leaflet / React-Leaflet | ⏸️ installé, non utilisé (carte retirée du MVP) |
| Temps réel | WebSocket pour l'assistante vocale | 🔜 |
| Notifications push | Service worker + VAPID | 🔜 |
| i18n | i18next | 🔜 |
| Monitoring | Sentry | 🔜 |
| PWA | vite-plugin-pwa (Workbox) | ✅ |
| Hébergement | Vercel | ✅ (build) |
| Mode sombre | — | ❌ abandonné |

**Note sur Base UI** — le preset shadcn repose sur Base UI. Différences à connaître :
- Composition : `render={<Composant />}` au lieu de `asChild`. Un `Button` rendu en lien (`<a>`, `Link`) doit recevoir `nativeButton={false}`.
- État actif d'un item : attribut `data-active` (et non `data-state="active"`). Pour la sidebar, le bouton expose `data-[active=true]`. Un `Switch` activé expose `data-checked`.
- `Select` : la valeur est une chaîne ; la prop `items` sur `Select` sert à afficher le libellé (et non la valeur) dans le déclencheur, et `onValueChange` reçoit `string | null`.
- Certains composants (`TabsTrigger`, `SelectTrigger`…) imposent une hauteur interne qu'il faut surcharger (`h-full`, `data-[size=default]:h-13`).

**Note sur le cache** — Workbox gère le cache réseau (assets, résilience sur connexion faible). TanStack Query gère le cache applicatif des données serveur.

### Backend

| Domaine | Technologie |
|---|---|
| Langage / Framework | Java 21 / Spring Boot 3.4.3 |
| Base de données | PostgreSQL |
| Hébergement | Azure / AWS (déploiement sur EC2 à venir) |
| Sécurité | JWT (access + refresh avec rotation), MFA admin, SSL |

## Prérequis

- Node.js ≥ 20
- [pnpm](https://pnpm.io/)
- Pour travailler en local avec l'API : le back-end démarré sur `http://localhost:8080`

## Installation

```bash
git clone <url-du-repo>
cd sos_yoon_app
pnpm install
cp .env.example .env
```

Variables d'environnement :

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL de l'API, **doit se terminer par `/api/v1`** (ex. `http://localhost:8080/api/v1` en local, `https://api.sosyoon.sn/api/v1` en production) |

## Scripts

```bash
pnpm dev        # serveur de développement (http://localhost:5173)
pnpm build      # vérification TypeScript (tsc -b) puis build de production
pnpm preview    # prévisualiser le build
pnpm lint       # linter
```

## Connexion au back-end

Le front appelle **toujours la vraie API** : il n'y a plus d'interrupteur de mock. Un seul drapeau subsiste dans `shared/lib/featureFlags.ts` :

| Drapeau | Valeur | Rôle |
|---|---|---|
| `AUTH_GUARD_ENABLED` | `true` | Active `ProtectedRoute` / `RootGate`. Au rechargement, la session est restaurée via `/auth/rafraichir`. |

Chaque feature expose un **service** (`*Service.ts`) qui n'est qu'un alias de son objet d'API (`*Api.ts`), conservé pour que les hooks n'aient pas à changer. **Les types viennent de l'API** : ne pas dupliquer de type de service à la main (c'est ce qui avait fait diverger les anciens mocks du contrat réel).

### En local

1. Démarrer le back-end (`http://localhost:8080`).
2. Mettre `VITE_API_URL=http://localhost:8080/api/v1` dans `.env`.
3. `pnpm dev` : le front tourne sur `http://localhost:5173`, qui doit être autorisé dans le CORS du back-end.

### Déploiement sur Vercel

1. Le back-end doit être joignable en **HTTPS** (un `http://` est bloqué par le navigateur depuis un site en HTTPS).
2. Renseigner `VITE_API_URL` dans les variables d'environnement du projet Vercel (finit par `/api/v1`).
3. Autoriser l'origine Vercel (et le domaine final) dans le CORS du back-end. En-têtes personnalisés à autoriser : `X-Refresh-Token`.
4. Le build exécute `tsc -b` : **toute erreur TypeScript bloque le déploiement**. Lancer `pnpm run build` en local avant de pousser.

### Nettoyage restant

Les mocks des features `auth`, `admin`, `demandes`, `notifications` et du service `dossiers` sont supprimés. Il reste à brancher directement sur l'API, puis à supprimer :

- les services de `features/professionnel/lib/` (abonnement, agenda, dashboard, notifications, profil, sollicitations) et leurs fichiers `mock*.ts` ;
- les services de `features/profil/services/` (compte, préférences, profil) et leurs `mock*.ts` ;
- `USE_MOCK_API` dans `shared/lib/featureFlags.ts` et dans `shared/hooks/useNavBadges.ts`, une fois tous les services nettoyés.

Vérification : `grep -rn "USE_MOCK_API\|[mM]ock" src` ne doit plus rien afficher.

## Architecture du projet

```
src/
├── app/
│   ├── providers/                  # AuthProvider, QueryProvider
│   └── router.tsx                  # toutes les routes
│
├── config/
│   ├── api.config.ts               # endpoints publics, 401 attendus
│   ├── navigation.ts               # sections/items de menu par rôle, badges, profil
│   └── sidebarThemes.ts            # variables CSS de la sidebar par rôle
│
├── layouts/
│   ├── AppLayout.tsx               # Desktop ou Mobile selon le viewport
│   ├── DesktopLayout.tsx           # SidebarProvider + header + contenu
│   ├── MobileLayout.tsx            # en-tête + contenu + tab bar basse + menu « Plus »
│   ├── AppSidebar.tsx              # sidebar à sections, pastilles, thème par rôle
│   ├── SidebarUserCard.tsx         # carte utilisateur + menu (profil, déconnexion)
│   ├── NavBadgeView.tsx            # pastilles : compteur, point, libellé
│   ├── VisiteurLayout.tsx          # layout des pages publiques (sans compte)
│   └── VisiteurHeader.tsx          # logo, retour, liens connexion / inscription
│
├── features/
│   ├── auth/                       # connexion, inscriptions, OTP, code secret, mot de passe, admin (MFA)
│   │   ├── api/                    # authApi, adminAuthApi, motDePasseApi
│   │   ├── service/                # authService, adminAuthService, motDePasseService (alias des API)
│   │   ├── components/ hooks/ lib/ pages/ schema/
│   │   └── store/auth.store.ts     # Zustand : user, portee, isAuthenticated, isLoading
│   ├── onboarding/                 # AccueilVisiteurPage (accueil sans compte)
│   ├── demandes/                   # création (écrite/vocale), suivi (polling), liste, annulation, réorientation
│   ├── assistant/                  # Soxna Yoon (assistante vocale)
│   ├── notifications/              # liste, filtres (Toutes / Non lues / Lues), marquage lu
│   ├── profil/                     # infos, photo, code secret, préférences, suppression du compte
│   ├── professionnel/              # espace pro
│   │   ├── api/ hooks/ lib/ schema/ types/
│   │   ├── components/             # cartes de demande, agenda (grille semaine, liste, dialogues), dossiers…
│   │   └── pages/                  # TableauDeBord, Demandes, DemandeRefusee, Dossiers, Agenda,
│   │                               # NotificationsProfessionnel, ProfilPro, ProfilValide, ValidationDossier
│   ├── admin/                      # espace administrateur
│   │   ├── api/ hooks/ schema/ types/
│   │   ├── lib/                    # erreursAdmin (messageAdmin), parametres, metiersAdmin…
│   │   ├── components/             # cartes de stats animées, graphiques, tableaux, dialogues
│   │   └── pages/                  # TableauDeBordAdmin, AdminUsers, AdminProfessionnels,
│   │                               # AdminAbonnements, AdminDemandes, AdminAudit, ParametresAdmin
│   └── legal/                      # CGU et politique de confidentialité
│       ├── lib/                    # infosLegales (coordonnées à compléter), types, contenuCgu, contenuConfidentialite
│       ├── components/             # PageJuridique, Texte (mini-markup), MentionLegale
│       └── pages/                  # CguPage, ConfidentialitePage
│
├── shared/
│   ├── components/
│   │   ├── ui/                     # généré par shadcn (Base UI) — ne pas éditer à la main
│   │   ├── ProtectedRoute.tsx      # garde : authentification + rôle + portée
│   │   ├── RootGate.tsx            # « / » : redirige selon rôle et portée, sinon accueil visiteur
│   │   ├── LienConnexion.tsx       # LienConnexion / LienInscription (variantes pilule et bloc)
│   │   ├── CodeSecretInput.tsx     # saisie du code secret à 4 chiffres
│   │   ├── FullScreenLoader.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── PagePlaceholder.tsx     # écran temporaire des routes en construction
│   ├── hooks/                      # useIsMobile, useNavBadges (compteurs réels pro et admin)
│   └── lib/
│       ├── apiClient.ts            # Axios + token + retry sur 401
│       ├── refreshToken.ts         # refresh unique partagé (promesse en vol)
│       ├── tokenManager.ts         # tokens (localStorage, à migrer) + callbacks de session
│       ├── apiError.ts             # toApiErreur : toute erreur → ApiErreur
│       ├── errorHandler.ts         # getErrorMessage (s'appuie sur toApiErreur)
│       ├── featureFlags.ts         # AUTH_GUARD_ENABLED
│       ├── animationsPage.ts       # variantes d'apparition partagées
│       ├── getSpaceRoute.ts        # rôle → espace
│       ├── getPostLoginRoute.ts    # (rôle, portée) → destination
│       ├── getActiveNavPath.ts     # item de menu actif (chemin le plus long)
│       ├── styleCarte.ts           # fond dégradé commun des cartes
│       ├── userDisplay.ts          # nom affiché, initiales (prénom/nom peuvent être null)
│       └── toast.ts
│
├── types/
│   ├── user.types.ts               # UserRole, Metier, StatutCompte, Portee, User
│   ├── auth.types.ts               # payloads, TokenResponse, CodeEnvoye, MFA
│   └── api.types.ts                # Page<T>, PageParams, ApiErreur
└── assets/
```

> Les composants visuels d'authentification (`AuthShell`, `BrandLogo`, panneaux `AuthVisualPanel` / `LoginVisualPanel` / `OtpVisualPanel`) sont partagés entre les écrans de connexion, d'inscription et d'OTP.

## Conventions de l'API

- Base `/api/v1`. Les réponses sont des **objets bruts** (pas d'enveloppe `{success, data}`).
- Listes paginées : `Page<T>` = `{ contenu, page, taille, totalElements, totalPages }`.
- Erreurs : `ApiErreur` = `{ code, message, details?, horodatage }`. Le front traduit le `code` en message français (`authErrors.ts`, `demandeErrors.ts`, `erreursAdmin.ts`, `erreursAgenda.ts`).
- Téléphones au format international : `+221771234567`.
- Rôles : `PARTICULIER | PRO | ADMIN`.

## Authentification

### Particulier — OTP SMS puis code secret

Le particulier n'a **pas de mot de passe**. Le numéro est vérifié par OTP SMS à l'inscription ; un **code secret à 4 chiffres** sert ensuite à se reconnecter après une déconnexion.

```
Parcours « normal »
/register/particulier → demanderCodeInscription (CGU acceptées + version)
        ↓ /verification-otp → verifierCodeInscription → TokenResponse
        ↓ /code-secret (création du code) → espace particulier

Reconnexion
/login → numéro + code secret → TokenResponse → getPostLoginRoute → /app
```

`type` vaut `"INSCRIPTION"` ou `"CONNEXION"` dans l'état de navigation vers l'OTP. Le renvoi du code respecte `delaiRenvoiSecondes`. Après une inscription, `prenom`, `nom` et `email` sont `null` jusqu'à la complétion du profil. La connexion par code SMS n'existe plus : seule la connexion par code secret reste (`authService` n'expose pas `demanderCodeConnexion` ni `verifierCodeConnexion`).

#### Demande sans compte (visiteur)

Un visiteur peut rédiger ou enregistrer une demande **avant** d'avoir un compte :

```
/ (accueil visiteur) → /demandes/nouvelle (vocal ou écrit, localisation)
        ↓ « Envoyer » : la demande est gardée côté client
          (Zustand persisté ; le message vocal est stocké dans IndexedDB)
/register/particulier?origine=demande → OTP
        ↓ compte créé SANS code secret (POST /auth/particulier/inscription/finaliser)
/app/demandes/envoi → la demande en attente est envoyée → page de suivi
```

- Une personne qui **a déjà un compte** ne peut pas utiliser ce parcours : elle se connecte, puis fait sa demande.
- Le code secret est proposé **après** l'envoi (invitation avec « Plus tard »). En attendant, le profil affiche « Non défini ».

#### Création d'une demande

La demande est **créée et envoyée en une seule requête** : `POST /demandes` en `multipart/form-data`, avec un champ `donnees` (JSON : `typeSaisie`, `description`, `motsCles`, `localisation`, `dureeSecondes` pour le vocal) et, pour le vocal, un champ `fichier` (audio). Il n'y a **plus de brouillon côté serveur** : `demandesApi` expose `creerEcrite` et `creerVocale`. Suivi : `GET /demandes/{id}/suivi` (interrogé toutes les 5 s), annulation `POST /demandes/{id}/annuler`, réorientation `POST /demandes/{id}/reorienter`.

### Professionnel — email + mot de passe

- Connexion : `LoginProfessionnelForm` → `/auth/pro/connexion` → redirection selon la **portée** (voir ci-dessous).
- Inscription : formulaire multi-étapes (5 étapes, justificatifs selon le métier). Pour le **juriste-conseil** : diplôme en droit (licence ou master), pièce d'identité (CNI ou passeport) et **déclaration sur l'honneur obligatoire**. La case d'acceptation des **CGU est obligatoire** à la dernière étape.
- Parcours : un endpoint par étape (`/auth/pro/inscription/*`), vérification de l'email, soumission, puis validation du dossier par l'administration (`/pro/validation`).

### Administrateur

`/admin/auth/connexion`, avec double authentification possible (`{ mfaRequis, jetonMfa }` → `/admin/auth/2fa/verifier`, activation via `/admin/auth/2fa/activer` et `/confirmer`). Le changement de mot de passe passe par `PUT /auth/mot-de-passe`.

### Session et tokens

- `TokenResponse` = `{ accessToken, refreshToken, expiresIn, portee, utilisateur }`.
- `apiClient` ajoute le Bearer ; sur 401 il tente **un seul refresh partagé** (`refreshToken.ts`) puis rejoue la requête. Le refresh **fait tourner** le refresh token.
- **Sessions admin** : une session = un refresh token en base, dont l'identifiant change à chaque rotation. Pour que le back-end sache quelle est la session courante, les appels de gestion des sessions envoient l'en-tête optionnel `X-Refresh-Token`. Le back-end refuse de révoquer la session courante (409 `SESSION_COURANTE`).
- Il n'existe **pas d'endpoint « utilisateur courant »** : au démarrage, `auth.store.initialize()` restaure la session via `/auth/rafraichir`.
- Les tokens sont en `localStorage` pour l'instant (à migrer vers des cookies httpOnly quand le back-end le permettra).
- Les endpoints publics et les 401 « normaux » (identifiants invalides, etc.) sont listés dans `config/api.config.ts`.

### La portée (`portee`)

Elle indique ce que le token autorise. Elle concerne surtout le **professionnel** ; le particulier est toujours `COMPLET`.

| Portée | Signification | Destination |
|---|---|---|
| `COMPLET` | accès à l'espace du rôle | `/app`, `/pro`, `/admin` |
| `INSCRIPTION` | inscription pro à terminer (email à vérifier…) | `/register/professionnel` |
| `DOSSIER` | dossier en attente de validation ou rejeté | `/pro/validation` |
| `PAIEMENT` | abonnement impayé | `/pro/abonnement` |
| `AUCUNE` | compte suspendu par l'administration | `/login` |

Correspondance statut de compte → portée : `features/auth/lib/portee.ts`. Une seule fonction décide de la destination : `getRouteForSession(role, portee)` (`getPostLoginRoute.ts`), utilisée par les formulaires de connexion, `RootGate` et `ProtectedRoute`.

## Rôles, routes et protection

`ProtectedRoute` vérifie, dans l'ordre : authentification → rôle (`allowedRoles`) → portée (`requiredPortee`, `COMPLET` par défaut). Un mauvais rôle est renvoyé vers `/` (donc vers son espace), une mauvaise portée vers la page correspondante.

| Zone | Rôle | Portée | Layout |
|---|---|---|---|
| `/` | tous (accueil visiteur si non connecté) | — | `VisiteurLayout` |
| `/demandes/nouvelle` | visiteur | — | `VisiteurLayout` |
| `/cgu`, `/confidentialite` | public | — | page juridique |
| `/assistant` | tous, avec ou sans compte | — | aucun (plein écran) |
| `/app/*` | `PARTICULIER` | `COMPLET` | `AppLayout` |
| `/pro/*` | `PRO` | `COMPLET` | `AppLayout` |
| `/pro/validation` | `PRO` | `DOSSIER` | aucun |
| `/pro/abonnement` | `PRO` | `PAIEMENT` | aucun |
| `/admin/*` | `ADMIN` | `COMPLET` | `AppLayout` |

Routes de l'espace particulier (`/app`) : `/app`, `/app/demandes/nouvelle`, `/app/demandes`, `/app/demandes/:id`, `/app/demandes/envoi`, `/app/notifications`, `/app/profil`, `/app/profil/informations`, `/app/profil/code-secret`, `/app/profil/notifications`, `/app/profil/supprimer`.

Routes publiques d'authentification : `/login`, `/register`, `/register/particulier`, `/register/professionnel`, `/verification-otp`, `/verification-email`, `/mot-de-passe-oublie`, `/mot-de-passe/reinitialiser`. La racine `/` redirige selon l'état de la session. Toutes les routes sont déclarées dans `app/router.tsx`.

## Navigation par rôle

Source unique : `config/navigation.ts`, organisée en **sections** d'**items**.

| Rôle | Contenu |
|---|---|
| Particulier | Accueil · Demandes · Notifications · Profil |
| Pro | Tableau de bord · Demandes · Dossiers · Agenda · Notifications · Mon profil |
| Admin | Tableau de bord · Utilisateurs · Professionnels · Abonnements · Demandes · Audit · Paramètres |

- **Desktop** : sidebar shadcn réductible, avec un thème par rôle (`sidebarThemes.ts` : marine pour le particulier, marine foncé à item actif crème pour le pro, claire pour l'admin).
- **Mobile** : tab bar basse sur fond marine (items marqués `mobile: true`, 4 par rôle), avec un **trait orange** au-dessus de l'onglet actif, et un menu **« Plus »** pour le reste lorsqu'un rôle a plus de 4 entrées.
- **Pastilles** : la config décrit leur forme (compteur, point, libellé « IA »), les valeurs viennent de `useNavBadges(role)`. **Pro** : demandes en attente, dossiers en cours, notifications non lues. **Admin** : professionnels en attente, demandes à qualifier (la pastille disparaît à zéro). **Particulier** : pas encore branché.
- **Item actif** : `getActiveNavPath` retient le chemin le plus long qui correspond, pour que `/app/demandes/nouvelle` n'active pas aussi « Demandes ».

## Espace administrateur

- **Tableau de bord** (`GET /admin/dashboard`) : cartes d'indicateurs animées (compteurs, tendances), graphique d'évolution avec quatre vues (jour sur 14 jours, semaine sur 12 semaines, mois, par métier), répartition par métier, inscriptions en attente. Les demandes en `BROUILLON` sont exclues des totaux et de l'évolution.
- **Professionnels** : liste (tableau ou cartes), fiche, validation ou refus du dossier (avec motif), changement de statut.
- **Journal d'audit** : filtrable, avec ouverture directe sur un type de cible via `/admin/audit?typeCible=PARAMETRE`.
- **Paramètres** (4 onglets) :
  - *Général* : profil de l'administrateur (nom, email, téléphone) ;
  - *Plateforme* : paramètres de configuration, modifiables un par un (`GET`/`PUT /admin/parametres`), chaque modification est tracée dans l'audit ;
  - *Sécurité* : changement de mot de passe, double authentification ;
  - *Sessions* : sessions actives, déconnexion d'une session ou de toutes les autres.

Paramètres de plateforme :

| Clé | Rôle | Appliqué par le back-end |
|---|---|---|
| `abonnement.montant.standard.xof` | prix de l'abonnement standard | ✅ |
| `abonnement.montant.juriste_conseil.xof` | prix de l'abonnement juriste-conseil | ✅ |
| `abonnement.essai.jours` | durée de l'essai gratuit | ✅ |
| `sollicitation.expiration.minutes` | délai de réponse d'un professionnel | ✅ |
| `dispatch.professionnels.limit` | nombre de professionnels sollicités | ✅ |
| `demande.expiration.heures` | expiration d'une demande | ⏳ stocké, pas encore lu |
| `relance.professionnel.heures` | relance d'un professionnel | ⏳ stocké, pas encore lu |
| `upload.taille.max.mo` | taille maximale des fichiers | ⏳ stocké, pas encore lu |

## Pages légales

`/cgu` et `/confidentialite` sont des pages **pilotées par les données** : le contenu est dans `features/legal/lib/` (`contenuCgu.ts`, `contenuConfidentialite.ts`), sous forme de sections et de blocs, rendu par `PageJuridique`. Le texte accepte un mini-balisage : `**gras**`, `[libellé](/chemin)` pour un lien interne, et `[à compléter]` qui s'affiche surligné (`<mark>`) pour repérer ce qui manque.

- Les coordonnées de l'éditeur (raison sociale, adresse, NINEA, contact, hébergeur…) sont à renseigner dans `lib/infosLegales.ts`.
- Les textes n'indiquent **pas de montants** d'abonnement (ils sont configurables dans les paramètres).
- Liens présents aujourd'hui : pied de page du choix d'inscription, dernière étape de l'inscription professionnelle (case obligatoire). La version acceptée est enregistrée avec `VERSION_CGU`.
- **À faire relire par un juriste avant la mise en production.**

## Assistante vocale — Soxna Yoon

Page plein écran sur `/assistant`, accessible avec ou sans compte. États de l'écran : micro bloqué ou indisponible (alerte et mode vocal désactivé), prêt, écoute, réflexion, réponse (« Soxna vous répond »).

- `useMicrophone` suit la permission du micro (`a-demander`, `autorise`, `bloque`, `indisponible`) et réagit aux changements de réglage du navigateur.
- `lib/sessionVocale.ts` est la **seule frontière avec le moteur vocal**. Aujourd'hui, `creerSession` renvoie une session **simulée** (écoute → réflexion → réponse). Quand l'API de conversation sera fournie par l'équipe IA (WebSocket attendu), il suffira de remplacer cette fonction ; la page et les hooks ne changent pas.
- L'avatar est `/images/soxna-yoon.jpg`. Le texte affiché rappelle toujours que c'est de l'**information juridique générale, pas un conseil d'avocat**.

## Convention de gestion d'état

| Type de donnée | Outil |
|---|---|
| Données serveur (demandes, profils, notifications, tableaux de bord) | TanStack Query |
| État global UI (session, demande en attente) | Zustand |
| État local (formulaire, modal) | `useState` |

## Notifications (toast)

Les retours utilisateur passent par `shared/lib/toast.ts` (wrapper de Sonner) : `toast.success(message, description?)`, `toast.error(...)`, `toast.info(...)`. Le `<Toaster />` est monté une fois dans `App.tsx`. Les erreurs d'authentification passent par `authErrorMessage(error)`, celles des demandes par `demandeErrorMessage(error)`, celles de l'admin par `messageAdmin(error, parDefaut)`.

## Conventions de code et d'interface

- **Utiliser les composants shadcn** (`Button`, `Card`, `Badge`, `Input`, `Label`, `Select`, `Switch`…) plutôt que des éléments HTML stylés à la main. Seules exceptions assumées : les éléments très spécifiques au produit (grand micro rond de l'assistante, trait de l'onglet actif…).
- **Cartes** : le dégradé commun est dans `shared/lib/styleCarte.ts` (`CARTE`, `CARTE_LIEN`, `CARTE_BOUTON`). Ne pas remettre de cartes blanches sur fond blanc.
- **Aucun décalage de mise en page** : réserver l'espace (`min-h-*`) pour tout ce qui apparaît ou change de texte (messages d'aide, badges, états de chargement).
- **Mêmes classes et mêmes polices sur mobile et desktop** ; ne pas retirer de fonctionnalités desktop en adaptant le mobile.
- **React Compiler** : ne pas créer de composants pendant le rendu (composants définis au niveau du module, icônes passées en JSX ; pas de `const Icone = choisir(...)` suivi de `<Icone />`) ; ne pas appeler de fonctions impures (`Date.now()`) dans le rendu ; préférer `useWatch` à `form.watch`.
- **ESLint** : un fichier de composant n'exporte que des composants (`react-refresh/only-export-components`) ; pas d'affectation inutile (`no-useless-assignment`).
- **Animations** : éviter la classe Tailwind `transition` sur les éléments `motion` (elle entre en conflit avec leurs transformations) ; utiliser `transition-colors` ou une transition ciblée. Pour un lien animé : `motion.create(Link)`.
- **Router** : les routes sous `AppLayout` utilisent des chemins absolus.
- **Types d'API** : ne pas ré-annoter un service avec un type écrit à la main s'il peut être déduit de l'objet d'API.
- **Texte** : français correct, accents compris.

## Direction visuelle

| Rôle | Valeur |
|---|---|
| `ink` | `#000000` |
| `paper` | `#ffffff` |
| `signal` (accent, CTA) | `#f9610d` |
| `navy` (fonds sombres, panneaux) | `#171630` |
| Police display | à trancher (Fraunces actuellement, les maquettes ressemblent à Playfair Display) |
| Police corps | Geist |

Signature visuelle : les écrans d'authentification utilisent `AuthShell` (colonne visuelle marine avec radar animé + formulaire). Le logo orange `/images/logo_orange.png` est utilisé dans les en-têtes.

## PWA

Application installable (mobile et desktop), cache Workbox pour la connexion faible. `start_url` et `scope` restent `"/"` (la racine gère la redirection), avec `id: "/"` dans le manifest.

**Point technique (Android)** — préférer `min-h-dvh` sans `overflow-hidden` plutôt que `h-dvh` + `overflow-hidden` sur les conteneurs plein écran : certains WebView Android calculent `dvh` différemment de Safari iOS.

**Taille du bundle** — le build produit un seul fichier JS d'environ 1,5 Mo (460 Ko compressé) et un avertissement de Vite. Il ne bloque pas ; on pourra le réduire en découpant par route avec `React.lazy`.

## Écarts avec la spécification (à intégrer au document)

La spécification v0.3.4 fait foi. Le front et le back-end s'en écartent sur les points suivants, à reporter dans le document ou à corriger :

**Authentification**
- Parcours « code secret » du particulier : création du code après l'inscription (`/code-secret`), connexion par code secret à la place de la connexion par OTP, `POST /auth/particulier/inscription/finaliser` avec `{ jetonInscription }` → `TokenResponse` (201), champ `codeSecretDefini` dans `utilisateur`, erreur dédiée `CODE_SECRET_NON_DEFINI` pour orienter vers « Code secret oublié ».
- En-tête optionnel `X-Refresh-Token` pour la gestion des sessions admin.

**Profil du particulier**
- `PUT` du code secret : `codeActuel` absent quand aucun code n'est défini.
- Préférences de notification (`notificationsPush`, puis `smsSecours`) et abonnement Web Push (service worker, VAPID).
- Suppression du compte : `POST` avec `{ codeSecret }`, réponse 204. Erreurs : `CODE_SECRET_INCORRECT` (400, `details.essaisRestants`) et `COMPTE_VERROUILLE` (423). Le serveur annule les demandes en cours, prévient les professionnels, efface ou anonymise les données et invalide la session.

**Abonnement**
- Les montants appliqués par le back-end (30 000 XOF standard, 20 000 XOF juriste-conseil) diffèrent de ceux de la spécification (50 000 XOF). Ils sont désormais modifiables dans les paramètres de plateforme ; à aligner avec le document.

**Assistante vocale**
- Contrat de conversation à définir avec l'équipe IA (WebSocket attendu : jeton de session, événements, format audio). Accessible sans compte, avec limitation de débit côté serveur.

## Reste à faire

**Particulier**
- Écran du numéro de téléphone (`/app/profil/telephone`, encore un placeholder).
- « Code secret oublié » (`/code-oublie`).
- Invitation à créer le code secret après l'envoi d'une demande, et gestion de « définir » sans code actuel.
- Brancher la pastille de navigation sur le nombre de notifications non lues, et l'avatar de l'en-tête sur `useProfil()`.
- Brancher la vraie conversation de Soxna Yoon (WebSocket).
- Web Push (service worker, VAPID) et SMS de secours.
- Nettoyage du router : route `/app/profil/zone` (placeholder), doublon `/code-oublie`, ancienne route `/app/assistant` (remplacée par `/assistant`).

**Légal**
- Ajouter la case d'acceptation explicite des CGU et les liens dans `RegisterParticulierForm` (avec `VERSION_CGU`).
- Compléter `lib/infosLegales.ts` (les `[à compléter]` sont visibles dans les pages).
- Mettre à jour les textes quand l'écran de suppression de compte sera définitif, vérifier les hypothèses (service gratuit pour les particuliers, coordonnées partagées uniquement avec le professionnel qui accepte), puis faire relire par un juriste.
- Ajouter les liens vers les pages légales dans les profils, l'espace professionnel (y compris les pages de blocage d'abonnement), les e-mails et les SMS.

**Admin**
- Page du moteur IA / triage.
- Brancher côté back-end les trois paramètres stockés mais non lus (`demande.expiration.heures`, `relance.professionnel.heures`, `upload.taille.max.mo`).

**Technique**
- Terminer le [nettoyage des mocks](#nettoyage-restant).
- Déployer le back-end en HTTPS (EC2), configurer le CORS et `VITE_API_URL` sur Vercel.
- Protéger `/uploads/**`, décider de la stratégie IA / reconnaissance vocale et du paiement en ligne.

## Code hérité de l'ancienne direction

Ces éléments datent du premier parcours et ne correspondent plus à la spécification. **À supprimer ou à reprendre** après vérification (`grep -rn "nom" src`) :

- Hooks : `useCurrentUser`, `useLogin`, `useRegister`, `useRequestOtp` (à supprimer), `useUpdateProfile` (remplacé par `features/profil`).
- Composants et hooks de localisation : `LocalisationDialog`, `useLocalisation` (remplacés par `useLocalisationPartagee`).
- Pages : `RequestPhonePage`, `WelcomePage`, `RequestChoicePage`, `MetierChoicePage`, `VoiceRequestPage`, `WrittenRequestPage`.
- Stores et hooks de brouillon : `voiceDraft.store`, `writtenDraft.store`, `useSubmitVoiceRequest`, `useSubmitWrittenRequest`, `useGeolocation`.
- Anciennes routes : `/demande/*`, `/chatbot`, `/pro/historique`, `/pro/disponibilite`, `/pro/messagerie`, `/admin/stats`.
- Anciens rôles `USER` / `PROFESSIONNEL` : remplacés par `PARTICULIER` / `PRO`.

Déjà supprimés : `useElargirRecherche`, `useEnvoyerMessageVocal`, `useSauvegarderBrouillon` et le store `demandeBrouillon` (ancien flux avec brouillon serveur, remplacé par `creerEcrite` / `creerVocale`).

## Questions ouvertes pour le back-end

- Pas d'endpoint « utilisateur courant » : confirmer que la restauration de session par refresh est voulue.
- Champs obligatoires à l'inscription pro (le front garde le parcours complet pour l'instant).
- Métier / titre du professionnel dans `User` (pour la carte utilisateur de la sidebar).
- Confirmer les [écarts avec la spécification](#écarts-avec-la-spécification-à-intégrer-au-document), en particulier le parcours « code secret » et la suppression du compte.
- Contrat de la conversation vocale avec l'équipe IA.

**Sécurité à durcir avant la production**
- Le mot de passe de l'administrateur est réinitialisé au démarrage par `UtilisateurFixture` : à désactiver hors développement.
- Aucune limitation de tentatives sur la connexion.
- `mustChangePassword` n'est pas appliqué : un administrateur peut garder le mot de passe initial.
- Les tokens sont en `localStorage` (migration vers des cookies httpOnly souhaitable).

## Feuille de route MVP

1. ✅ Fondations (layouts, toasts, PWA)
2. ✅ Écrans d'authentification alignés sur les maquettes (connexion, choix d'inscription, inscription particulier, OTP, code secret)
3. ✅ Inscription professionnelle multi-étapes
4. ✅ Infrastructure API alignée sur la spécification (client, refresh, erreurs)
5. ✅ Routes protégées par rôle et portée, redirection post-connexion
6. ✅ Layouts, sidebar et navigation par rôle
7. ✅ Espace particulier : accueil visiteur, demande avec ou sans compte, suivi, notifications, profil, assistante Soxna Yoon
8. ✅ Espace professionnel : tableau de bord, demandes, dossiers, agenda, notifications, profil, validation du dossier, abonnement
9. ✅ Espace administrateur : tableau de bord, utilisateurs, professionnels, abonnements, demandes, audit, paramètres
10. ✅ Pages légales (CGU, confidentialité) — 🔜 textes à finaliser et à faire relire
11. 🔄 Connexion au back-end réel : branchée, build Vercel qui passe ; reste le nettoyage des mocks et la recette de bout en bout
12. ⬜ Déploiement (back-end HTTPS, Vercel), PWA et finitions (offline, push), durcissement de la sécurité

## Public cible

Particuliers, familles, entrepreneurs, PME, diaspora, organisations, ainsi que les professionnels du droit et cabinets souhaitant digitaliser leur service.

## Licence

À définir.

## Contact

À définir.