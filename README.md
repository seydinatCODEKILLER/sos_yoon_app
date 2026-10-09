# SOS Yoon ⚖️ — Application (PWA)

Plateforme de mise en relation entre des **particuliers** confrontés à une situation juridique urgente et des **professionnels du droit** au Sénégal (avocats, huissiers, notaires, juristes-conseil).

> **Statut actuel** : phase MVP, front-end en cours de migration vers la **nouvelle direction du projet**, définie par le document d'API *« SOS Yoon — Endpoints API, v0.1 (5 oct. 2026) »* (132 endpoints, base `/api/v1`). Sont en place : authentification complète (particulier par OTP SMS, professionnel par email + mot de passe, inscription pro multi-étapes), infrastructure API (client HTTP, refresh de token, gestion d'erreurs), routes protégées par **rôle et portée**, layouts et navigation par rôle (sidebar desktop, tab bar mobile). Le back-end n'est pas encore connecté : le front tourne sur des **mocks** isolés derrière un interrupteur (voir [Mock / back-end réel](#mock--back-end-réel)).
>
> **Ce dépôt ne contient pas la landing page marketing.** Elle vit dans un projet **Next.js séparé** (`sos-yoon-web`). Ce dépôt est dédié à l'application connectée (espaces particulier, professionnel, administrateur) et à sa configuration PWA.

> **Source de vérité** : le document des endpoints décrit le contrat avec le back-end. En cas de divergence entre ce README et le document, c'est le document qui prévaut.

## À propos

SOS Yoon couvre les quatre métiers du droit :

- **Avocat**
- **Huissier**
- **Notaire**
- **Juriste-conseil**

Le particulier dépose une demande d'aide ; un moteur de triage identifie le métier pertinent et l'oriente vers un professionnel inscrit et validé. Les professionnels sont vérifiés avant d'accéder à leur espace.

## Fonctionnalités

| Espace | Fonctionnalités | Statut |
|---|---|---|
| Particulier | Inscription / connexion par OTP SMS, demande d'aide, suivi des demandes, messages, assistant juridique, notifications, profil | Auth ✅ — reste 🔜 (pages placeholder) |
| Professionnel | Inscription multi-étapes avec justificatifs, vérification email, validation du dossier, abonnement, tableau de bord, demandes, dossiers, clients, agenda, messages | Inscription (UI) ✅ — reste 🔜 |
| Administrateur | Dashboard, utilisateurs, validation des professionnels, demandes, moteur IA / triage, paramètres | 🔜 |

## Organisation multi-dépôts

| Dépôt | Rôle | Stack |
|---|---|---|
| **sos-yoon-web** | Landing page marketing, SEO, acquisition | Next.js |
| **sos-yoon-pwa** (ce dépôt) | Application connectée | React + Vite |

Les deux dépôts partagent les mêmes tokens visuels du design system, mais ont chacun leur outillage (build, PWA, routing).

## Stack technique

### Frontend (ce dépôt)

| Domaine | Technologie | Statut |
|---|---|---|
| Framework | React 19 + Vite | ✅ |
| Langage | TypeScript | ✅ |
| Style | Tailwind CSS v4 | ✅ |
| Composants UI | shadcn/ui sur **Base UI** (pas Radix) | ✅ |
| Animations | Motion | ✅ |
| Routing | React Router v7 | ✅ |
| État serveur | TanStack Query | ✅ (`QueryProvider`) |
| État global | Zustand | ✅ (`auth.store`) |
| Formulaires | React Hook Form + Zod v4 | ✅ |
| Client HTTP | Axios (`apiClient` + `rawClient`) | ✅ |
| Notifications UI | Sonner via `shared/lib/toast.ts` | ✅ |
| Cartes | Leaflet / React-Leaflet | ⏸️ installé, non utilisé (carte retirée du MVP) |
| Temps réel | Socket.io-client | 🔜 messagerie |
| i18n | i18next | 🔜 |
| Monitoring | Sentry | 🔜 |
| PWA | vite-plugin-pwa (Workbox) | ✅ |
| Mode sombre | — | ❌ abandonné |

**Note sur Base UI** — le preset shadcn repose sur Base UI. Différences à connaître :
- Composition : `render={<Composant />}` au lieu de `asChild`.
- État actif d'un item : attribut `data-active` (et non `data-state="active"`). Pour la sidebar, le bouton expose `data-[active=true]`.
- Certains composants (`TabsTrigger`…) imposent une hauteur interne qu'il faut surcharger (`h-full`) avec un `overflow-hidden` sur le parent.

**Note sur le cache** — Workbox gère le cache réseau (assets, résilience sur connexion faible). TanStack Query gère le cache applicatif des données serveur.

### Backend (cf. document des endpoints)

| Domaine | Technologie |
|---|---|
| Langage / Framework | Java / Spring Boot |
| Base de données | PostgreSQL |
| Hébergement | Azure / AWS |
| Sécurité | JWT (access + refresh avec rotation), MFA admin, SSL |

## Prérequis

- Node.js ≥ 20
- [pnpm](https://pnpm.io/)

## Installation

```bash
git clone <url-du-repo>
cd sos_yoon_pwa
pnpm install
cp .env.example .env
```

Variables d'environnement :

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL de l'API, **doit se terminer par `/api/v1`** (ex. `https://api.sosyoon.sn/api/v1`) |

## Scripts

```bash
pnpm dev        # serveur de développement
pnpm build      # build de production
pnpm preview    # prévisualiser le build
pnpm lint       # linter
```

## Mock / back-end réel

Deux interrupteurs dans `shared/lib/featureFlags.ts` :

| Drapeau | Valeur actuelle | Rôle |
|---|---|---|
| `USE_MOCK_API` | `true` | `true` → `mockAuthApi` (fausses réponses locales) ; `false` → `authApi` (vrais appels HTTP) |
| `AUTH_GUARD_ENABLED` | `false` | Active `ProtectedRoute` / `RootGate`. Gardé à `false` tant qu'il n'y a pas de back-end : au rechargement, la restauration de session appelle le vrai `/auth/rafraichir`. |

Tous les hooks passent par `authService` (`features/auth/api/authService.ts`), qui expose `authApi` ou `mockAuthApi` selon `USE_MOCK_API`. Les deux ont **la même forme** : mêmes méthodes, mêmes paramètres, mêmes réponses (`TokenResponse`, `CodeEnvoye`), mêmes erreurs (`ApiErreur`).

**Checklist de passage au back-end réel**

1. `USE_MOCK_API = false`.
2. Renseigner `VITE_API_URL` (finit par `/api/v1`).
3. Passer `AUTH_GUARD_ENABLED = true`.
4. Compléter `authService` : le mock n'expose pour l'instant que le parcours particulier et `pro.connexion`.
5. Brancher l'inscription pro étape par étape (`/auth/pro/inscription/*`, puis soumission).
6. Supprimer `mockAuth.ts` et le hook `useNavBadges` mocké (voir [Navigation](#navigation-par-rôle)).
7. Tester ce que les mocks ne reproduisent pas : limitation de débit (`TROP_DE_DEMANDES`, `RENVOI_TROP_TOT`), expiration réelle des tokens, enchaînement de 401.

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
│   ├── MobileLayout.tsx            # contenu + tab bar basse + menu « Plus »
│   ├── AppSidebar.tsx              # sidebar à sections, pastilles, thème par rôle
│   ├── SidebarUserCard.tsx         # carte utilisateur + menu (profil, déconnexion)
│   └── NavBadgeView.tsx            # pastilles : compteur, point, libellé
│
├── features/
│   ├── auth/
│   │   ├── api/                    # authApi (HTTP), authService (mock ↔ réel)
│   │   ├── components/             # formulaires (login/register, OTP, pro multi-étapes)
│   │   ├── hooks/                  # useRegisterParticulier, useLoginParticulier,
│   │   │                           # useLoginProfessionnel, useVerifyOtp, useLogout,
│   │   │                           # useRegisterProfessionnel (mock)
│   │   ├── lib/                    # mockAuth, authErrors, legal (CGU), phone, portee,
│   │   │                           # professionalConfig, senegalZones…
│   │   ├── pages/                  # Login, RegisterChoice, RegisterParticulier,
│   │   │                           # RegisterProfessionnel, VerifyOtp
│   │   ├── schema/                 # schémas Zod
│   │   └── store/auth.store.ts     # Zustand : user, portee, isAuthenticated, isLoading
│   ├── demandes/                   # UserHomePage (le reste : voir « Code hérité »)
│   ├── notifications/              # 🔜
│   ├── profil/                     # 🔜 (PUT /particulier/profil)
│   ├── professionnel/              # 🔜
│   └── admin/                      # 🔜
│
├── shared/
│   ├── components/
│   │   ├── ui/                     # généré par shadcn (Base UI) — ne pas éditer à la main
│   │   ├── ProtectedRoute.tsx      # garde : authentification + rôle + portée
│   │   ├── RootGate.tsx            # « / » : redirige selon rôle et portée, sinon /login
│   │   ├── FullScreenLoader.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── PagePlaceholder.tsx     # écran temporaire des routes en construction
│   ├── hooks/                      # useIsMobile, useNavBadges (mock)
│   └── lib/
│       ├── apiClient.ts            # Axios + token + retry sur 401
│       ├── refreshToken.ts         # refresh unique partagé (promesse en vol)
│       ├── tokenManager.ts         # tokens (localStorage, à migrer) + callbacks de session
│       ├── apiError.ts             # toApiErreur : toute erreur → ApiErreur
│       ├── errorHandler.ts         # getErrorMessage (s'appuie sur toApiErreur)
│       ├── featureFlags.ts         # USE_MOCK_API, AUTH_GUARD_ENABLED
│       ├── getSpaceRoute.ts        # rôle → espace
│       ├── getPostLoginRoute.ts    # (rôle, portée) → destination
│       ├── getActiveNavPath.ts     # item de menu actif (chemin le plus long)
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
- Erreurs : `ApiErreur` = `{ code, message, details?, horodatage }`. Le front traduit le `code` en message français (`authErrors.ts`).
- Téléphones au format international : `+221771234567`.
- Rôles : `PARTICULIER | PRO | ADMIN`.

## Authentification

### Particulier — OTP SMS, sans mot de passe

```
/register/particulier → demanderCodeInscription (cguAcceptees + version des CGU)
/login (onglet Particulier) → demanderCodeConnexion
        ↓ navigate("/verification-otp", { state: { telephone, type } })
/verification-otp → verifierCodeInscription | verifierCodeConnexion (selon type)
        ↓ TokenResponse → setSession → getPostLoginRoute → /app
```

`type` vaut `"INSCRIPTION"` ou `"CONNEXION"`. Le renvoi du code (`renvoyerCode`) respecte `delaiRenvoiSecondes`. Après une inscription, `prenom`, `nom` et `email` sont `null` jusqu'à la complétion du profil.

### Professionnel — email + mot de passe

- Connexion : `LoginProfessionnelForm` → `/auth/pro/connexion` → redirection selon la **portée** (voir ci-dessous).
- Inscription : formulaire multi-étapes (5 étapes, justificatifs selon le métier). Pour le **juriste-conseil** : diplôme en droit (licence ou master), pièce d'identité (CNI ou passeport) et **déclaration sur l'honneur obligatoire**. L'inscription n'est pas allégée pour le moment.
- Parcours réel prévu : un endpoint par étape (`/auth/pro/inscription/*`), vérification de l'email, soumission, puis validation du dossier par l'administration.

### Administrateur

`/admin/auth/connexion`, avec MFA possible (`{ mfaRequis, jetonMfa }` → `/admin/auth/2fa/verifier`). **Page de connexion admin non construite** (priorité P2).

### Session et tokens

- `TokenResponse` = `{ accessToken, refreshToken, expiresIn, portee, utilisateur }`.
- `apiClient` ajoute le Bearer ; sur 401 il tente **un seul refresh partagé** (`refreshToken.ts`) puis rejoue la requête. Le refresh **fait tourner** le refresh token.
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
| `/app/*` | `PARTICULIER` | `COMPLET` | `AppLayout` |
| `/pro/*` | `PRO` | `COMPLET` | `AppLayout` |
| `/pro/validation` | `PRO` | `DOSSIER` | aucun |
| `/pro/abonnement` | `PRO` | `PAIEMENT` | aucun |
| `/admin/*` | `ADMIN` | `COMPLET` | `AppLayout` |

Routes publiques : `/login`, `/register`, `/register/particulier`, `/register/professionnel`, `/verification-otp`, `/verification-email`, `/mot-de-passe-oublie`, `/mot-de-passe/reinitialiser`. La racine `/` redirige selon l'état de la session. Hors authentification, toutes les pages métier sont encore des `PagePlaceholder` (sauf `UserHomePage`).

## Navigation par rôle

Source unique : `config/navigation.ts`, organisée en **sections** d'**items**.

| Rôle | Items |
|---|---|
| Particulier | Accueil · Demander de l'aide · Mes demandes · Messages · Assistant juridique · Notifications (profil via la carte utilisateur) |
| Pro | Tableau de bord · Demandes · Dossiers · Clients · Agenda · Messages · Notifications — puis « Paramètres & compte » : Mon profil |
| Admin | Dashboard · Utilisateurs · Professionnels · Demandes · Moteur IA / Triage · Paramètres |

- **Desktop** : sidebar shadcn réductible, avec un thème par rôle (`sidebarThemes.ts` : marine pour le particulier, marine foncé à item actif crème pour le pro, claire pour l'admin).
- **Mobile** : tab bar basse avec les items marqués `mobile: true` (4 par rôle) et un menu **« Plus »** pour le reste, le profil et la déconnexion.
- **Pastilles** : la config décrit leur forme (compteur, point, libellé « IA »), les valeurs viennent de `useNavBadges(role)`, aujourd'hui **mocké**. Chaque feature fournira ensuite son compteur.
- **Item actif** : `getActiveNavPath` retient le chemin le plus long qui correspond, pour que `/app/demandes/nouvelle` n'active pas aussi « Mes demandes ».

## Convention de gestion d'état

| Type de donnée | Outil |
|---|---|
| Données serveur (demandes, profils, statuts) | TanStack Query |
| État global UI (session) | Zustand |
| État local (formulaire, modal) | `useState` |

## Notifications (toast)

Les retours utilisateur passent par `shared/lib/toast.ts` (wrapper de Sonner) : `toast.success(message, description?)`, `toast.error(...)`, `toast.info(...)`. Le `<Toaster />` est monté une fois dans `App.tsx`. Les erreurs d'authentification passent par `authErrorMessage(error)`.

## Direction visuelle

| Rôle | Valeur |
|---|---|
| `ink` | `#000000` |
| `paper` | `#ffffff` |
| `signal` (accent, CTA) | `#f9610d` |
| `navy` (fonds sombres, panneaux) | `#171630` |
| Police display | à trancher (Fraunces actuellement, les maquettes ressemblent à Playfair Display) |
| Police corps | Geist |

Signature visuelle : les écrans d'authentification utilisent `AuthShell` (colonne visuelle marine avec radar animé + formulaire). Le wordmark `SOSYOON` est provisoirement en texte (`BrandLogo`), en attendant le SVG.

## PWA

Application installable (mobile et desktop), cache Workbox pour la connexion faible. `start_url` et `scope` restent `"/"` (la racine gère la redirection), avec `id: "/"` dans le manifest.

**Point technique (Android)** — préférer `min-h-dvh` sans `overflow-hidden` plutôt que `h-dvh` + `overflow-hidden` sur les conteneurs plein écran : certains WebView Android calculent `dvh` différemment de Safari iOS.

## Code hérité de l'ancienne direction

Ces éléments datent du premier parcours (dépôt de demande vocal / écrit sans compte préalable) et ne correspondent plus au document des endpoints. **À supprimer ou à reprendre** une fois les nouvelles pages de demande définies :

- Hooks : `useCurrentUser`, `useLogin`, `useRegister`, `useRequestOtp` (à supprimer), `useUpdateProfile` (→ futur `features/profil`).
- Pages : `RequestPhonePage`, `WelcomePage`, `RequestChoicePage`, `MetierChoicePage`, `VoiceRequestPage`, `WrittenRequestPage`.
- Stores et hooks de brouillon : `voiceDraft.store`, `writtenDraft.store`, `useSubmitVoiceRequest`, `useSubmitWrittenRequest`, `useVoiceRecorder`, `useGeolocation`.
- Anciennes routes : `/demande/*`, `/chatbot`, `/pro/historique`, `/pro/disponibilite`, `/pro/messagerie`, `/admin/stats`.
- Anciens rôles `USER` / `PROFESSIONNEL` : remplacés par `PARTICULIER` / `PRO`.

## Questions ouvertes pour le back-end

- Pas d'endpoint « utilisateur courant » : confirmer que la restauration de session par refresh est voulue.
- Champs obligatoires à l'inscription pro (le front garde le parcours complet pour l'instant).
- Format des compteurs de navigation (demandes, messages, notifications, professionnels en attente).
- Métier / titre du professionnel dans `User` (pour la carte utilisateur de la sidebar).

## Feuille de route MVP

1. ✅ Fondations (layouts, toasts, PWA)
2. ✅ Écrans d'authentification alignés sur les maquettes (connexion, choix d'inscription, inscription particulier, OTP)
3. ✅ Inscription professionnelle multi-étapes (UI, mockée)
4. ✅ Infrastructure API alignée sur le document des endpoints (client, refresh, erreurs, `authApi`, mock/réel)
5. ✅ Routes protégées par rôle et portée, redirection post-connexion
6. ✅ Layouts, sidebar et navigation par rôle, router avec pages placeholder
7. 🔜 Inscription pro réelle : endpoints par étape, vérification d'email, récapitulatif, pages `/pro/validation` et `/pro/abonnement`
8. 🔜 Espace particulier : accueil, demande d'aide, suivi des demandes, profil
9. ⬜ Espace professionnel : demandes, dossiers, clients, agenda, messagerie
10. ⬜ Espace administrateur : dashboard, validation des professionnels, moteur IA / triage
11. ⬜ Connexion au back-end réel (voir la checklist)
12. ⬜ PWA et finitions (offline, push, scénario de bout en bout)

## Public cible

Particuliers, familles, entrepreneurs, PME, diaspora, organisations, ainsi que les professionnels du droit et cabinets souhaitant digitaliser leur service.

## Licence

À définir.

## Contact

À définir.