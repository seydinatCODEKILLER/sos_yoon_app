# SOS Yoon ⚖️ — Application (PWA)

Plateforme de mise en relation entre des **particuliers** confrontés à une situation juridique urgente et des **professionnels du droit** au Sénégal (avocats, huissiers, notaires, juristes-conseil).

> **Statut actuel** : phase MVP. L'**espace particulier est intégré côté front** (accueil visiteur, demande avec ou sans compte, suivi, notifications, profil, assistante vocale Soxna Yoon), l'authentification est complète (particulier par OTP SMS puis code secret, professionnel par email + mot de passe, inscription pro multi-étapes) et l'infrastructure API est en place (client HTTP, refresh de token, gestion d'erreurs, routes protégées par **rôle et portée**). Le back-end n'est pas encore connecté : le front tourne sur des **mocks** isolés derrière un interrupteur (voir [Mock / back-end réel](#mock--back-end-réel)). **Prochaine étape : l'espace professionnel.**
>
> **Ce dépôt ne contient pas la landing page marketing.** Elle vit dans un projet **Next.js séparé** (`sos-yoon-web`). Ce dépôt est dédié à l'application connectée (espaces particulier, professionnel, administrateur) et à sa configuration PWA.

> **Source de vérité** : le document des endpoints *« SOS Yoon — Endpoints API, v0.1 (5 oct. 2026) »* (132 endpoints, base `/api/v1`) décrit le contrat avec le back-end. En cas de divergence entre ce README et le document, c'est le document qui prévaut. Les endpoints que le front suppose **en plus** du document sont listés dans [Endpoints supposés](#endpoints-supposés-à-confirmer-avec-le-back-end).

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
| Visiteur (sans compte) | Accueil, demande d'aide sans compte (brouillon conservé, compte créé à l'envoi), assistante Soxna Yoon | ✅ (mock) |
| Particulier | Inscription OTP SMS + code secret, connexion par code secret, demande d'aide, suivi en direct, historique, notifications, profil (infos, photo, code secret, préférences, suppression du compte), assistante Soxna Yoon | ✅ (mock) — reste : voir [Reste à faire côté particulier](#reste-à-faire-côté-particulier) |
| Professionnel | Inscription multi-étapes avec justificatifs, vérification email, validation du dossier, abonnement, tableau de bord, demandes, dossiers, clients, agenda | Inscription (UI) ✅ — reste 🔜 |
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
| Animations | `motion/react` | ✅ |
| Routing | React Router v7 | ✅ |
| État serveur | TanStack Query | ✅ (`QueryProvider`) |
| État global | Zustand (`auth.store`, brouillons, demande en attente) | ✅ |
| Formulaires | React Hook Form + Zod v4 | ✅ |
| Client HTTP | Axios (`apiClient` + `rawClient`) | ✅ |
| Notifications UI | Sonner via `shared/lib/toast.ts` | ✅ |
| Stockage local | `localStorage` (persist Zustand), IndexedDB (message vocal en attente) | ✅ |
| Cartes | Leaflet / React-Leaflet | ⏸️ installé, non utilisé (carte retirée du MVP) |
| Temps réel | WebSocket pour l'assistante vocale ; Socket.io-client pour la messagerie | 🔜 |
| Notifications push | Service worker + VAPID | 🔜 |
| i18n | i18next | 🔜 |
| Monitoring | Sentry | 🔜 |
| PWA | vite-plugin-pwa (Workbox) | ✅ |
| Mode sombre | — | ❌ abandonné |

**Note sur Base UI** — le preset shadcn repose sur Base UI. Différences à connaître :
- Composition : `render={<Composant />}` au lieu de `asChild`. Un `Button` rendu en lien (`<a>`, `Link`) doit recevoir `nativeButton={false}`.
- État actif d'un item : attribut `data-active` (et non `data-state="active"`). Pour la sidebar, le bouton expose `data-[active=true]`. Un `Switch` activé expose `data-checked`.
- `Select` : la valeur est une chaîne ; la prop `items` sur `Select` sert à afficher le libellé (et non la valeur) dans le déclencheur.
- Certains composants (`TabsTrigger`, `SelectTrigger`…) imposent une hauteur interne qu'il faut surcharger (`h-full`, `data-[size=default]:h-13`).

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
| `USE_MOCK_API` | `true` | `true` → services mockés (fausses réponses locales) ; `false` → vrais appels HTTP |
| `AUTH_GUARD_ENABLED` | `false` | Active `ProtectedRoute` / `RootGate`. Gardé à `false` tant qu'il n'y a pas de back-end : au rechargement, la restauration de session appelle le vrai `/auth/rafraichir`. |

Chaque feature expose un **service** qui choisit entre l'API réelle et le mock selon `USE_MOCK_API` (`authService`, `profilService`, `compteService`, `preferencesService`…). Les deux ont **la même forme** : mêmes méthodes, mêmes paramètres, mêmes réponses, mêmes erreurs (`ApiErreur`). Quand une méthode n'existe que d'un côté, le type du service l'exclut explicitement (`Omit` / `Pick`).

> **Limite connue des mocks** : la session mockée est perdue au rechargement de la page (pas de back-end pour la restaurer).

**Checklist de passage au back-end réel**

1. `USE_MOCK_API = false`.
2. Renseigner `VITE_API_URL` (finit par `/api/v1`).
3. Passer `AUTH_GUARD_ENABLED = true`.
4. Faire confirmer au back-end les [endpoints supposés](#endpoints-supposés-à-confirmer-avec-le-back-end).
5. Brancher l'inscription pro étape par étape (`/auth/pro/inscription/*`, puis soumission).
6. Supprimer les fichiers `mock*.ts` et le hook `useNavBadges` mocké (voir [Navigation](#navigation-par-rôle)).
7. Tester ce que les mocks ne reproduisent pas : limitation de débit (`TROP_DE_DEMANDES`, `RENVOI_TROP_TOT`), verrouillage du code secret (`COMPTE_VERROUILLE`), expiration réelle des tokens, enchaînement de 401.

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
│   ├── auth/
│   │   ├── api/                    # authApi (HTTP), authService (mock ↔ réel)
│   │   ├── components/             # formulaires (login/register, OTP, code secret, pro multi-étapes)
│   │   ├── hooks/                  # useRegisterParticulier, useVerifyOtp, useFinaliserInscription,
│   │   │                           # useDefinirCodeSecret, useLoginProfessionnel, useLogout…
│   │   ├── lib/                    # mockAuth, authErrors, legal (CGU), phone, portee,
│   │   │                           # professionalConfig, senegalZones…
│   │   ├── pages/                  # Login, RegisterChoice, RegisterParticulier,
│   │   │                           # RegisterProfessionnel, VerifyOtp, CodeSecretInscription
│   │   ├── schema/                 # schémas Zod
│   │   └── store/auth.store.ts     # Zustand : user, portee, isAuthenticated, isLoading
│   ├── onboarding/                 # AccueilVisiteurPage (accueil sans compte)
│   ├── demandes/
│   │   ├── api/ hooks/ lib/        # demandes, suivi (polling 5 s), brouillon, géolocalisation
│   │   ├── components/             # SosHero, MessageVocalPanel, MessageEcritForm, TypeSaisieTabs,
│   │   │                           # cartes de demande, suivi (timeline), états vides…
│   │   ├── pages/                  # UserHomePage, DemanderAidePage, MesDemandesPage,
│   │   │                           # SuiviDemandePage, EnvoiDemandeEnAttentePage
│   │   └── store/                  # brouillon, demandeEnAttente (visiteur)
│   ├── assistant/                  # Soxna Yoon (assistante vocale)
│   │   ├── components/             # AvatarSoxna, Onde, AlerteMicro
│   │   ├── hooks/                  # useMicrophone, useAssistantVocal
│   │   ├── lib/sessionVocale.ts    # frontière avec le moteur vocal (mock aujourd'hui)
│   │   └── pages/AssistantPage.tsx
│   ├── notifications/              # liste, filtres (Toutes / Non lues / Lues), marquage lu
│   ├── profil/                     # infos, photo, code secret, préférences, suppression du compte
│   ├── professionnel/              # 🔜
│   └── admin/                      # 🔜
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
- Erreurs : `ApiErreur` = `{ code, message, details?, horodatage }`. Le front traduit le `code` en message français (`authErrors.ts`, `demandeErrors.ts`).
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

`type` vaut `"INSCRIPTION"` ou `"CONNEXION"` dans l'état de navigation vers l'OTP. Le renvoi du code respecte `delaiRenvoiSecondes`. Après une inscription, `prenom`, `nom` et `email` sont `null` jusqu'à la complétion du profil.

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
- Le code secret est proposé **après** l'envoi (invitation avec « Plus tard »). En attendant, le profil affiche « Non défini ». Voir [Reste à faire](#reste-à-faire-côté-particulier).

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
| `/` | tous (accueil visiteur si non connecté) | — | `VisiteurLayout` |
| `/demandes/nouvelle` | visiteur | — | `VisiteurLayout` |
| `/assistant` | tous, avec ou sans compte | — | aucun (plein écran) |
| `/app/*` | `PARTICULIER` | `COMPLET` | `AppLayout` |
| `/pro/*` | `PRO` | `COMPLET` | `AppLayout` |
| `/pro/validation` | `PRO` | `DOSSIER` | aucun |
| `/pro/abonnement` | `PRO` | `PAIEMENT` | aucun |
| `/admin/*` | `ADMIN` | `COMPLET` | `AppLayout` |

Routes de l'espace particulier (`/app`) : `/app`, `/app/demandes/nouvelle`, `/app/demandes`, `/app/demandes/:id`, `/app/demandes/envoi`, `/app/notifications`, `/app/profil`, `/app/profil/informations`, `/app/profil/code-secret`, `/app/profil/notifications`, `/app/profil/supprimer`.

Routes publiques d'authentification : `/login`, `/register`, `/register/particulier`, `/register/professionnel`, `/verification-otp`, `/verification-email`, `/mot-de-passe-oublie`, `/mot-de-passe/reinitialiser`. La racine `/` redirige selon l'état de la session. Les pages des espaces professionnel et administrateur sont encore des `PagePlaceholder`.

## Navigation par rôle

Source unique : `config/navigation.ts`, organisée en **sections** d'**items**.

| Rôle | Items |
|---|---|
| Particulier | Accueil · Demandes · Notifications · Profil |
| Pro | Tableau de bord · Demandes · Dossiers · Clients · Agenda · Notifications — puis « Paramètres & compte » : Mon profil |
| Admin | Dashboard · Utilisateurs · Professionnels · Demandes · Moteur IA / Triage · Paramètres |

- **Desktop** : sidebar shadcn réductible, avec un thème par rôle (`sidebarThemes.ts` : marine pour le particulier, marine foncé à item actif crème pour le pro, claire pour l'admin).
- **Mobile** : tab bar basse sur fond marine (items marqués `mobile: true`, 4 par rôle), avec un **trait orange** au-dessus de l'onglet actif, et un menu **« Plus »** pour le reste lorsqu'un rôle a plus de 4 entrées.
- **Pastilles** : la config décrit leur forme (compteur, point, libellé « IA »), les valeurs viennent de `useNavBadges(role)`, aujourd'hui **mocké**. Chaque feature fournira ensuite son compteur (par exemple le nombre de notifications non lues).
- **Item actif** : `getActiveNavPath` retient le chemin le plus long qui correspond, pour que `/app/demandes/nouvelle` n'active pas aussi « Demandes ».

## Assistante vocale — Soxna Yoon

Page plein écran sur `/assistant`, accessible avec ou sans compte. États de l'écran : micro bloqué ou indisponible (alerte et mode vocal désactivé), prêt, écoute, réflexion, réponse (« Soxna vous répond »).

- `useMicrophone` suit la permission du micro (`a-demander`, `autorise`, `bloque`, `indisponible`) et réagit aux changements de réglage du navigateur.
- `lib/sessionVocale.ts` est la **seule frontière avec le moteur vocal**. Aujourd'hui, `creerSession` renvoie une session **simulée** (écoute → réflexion → réponse). Quand l'API de conversation sera fournie par l'équipe IA (WebSocket attendu), il suffira de remplacer cette fonction ; la page et les hooks ne changent pas.
- L'avatar est `/images/soxna-yoon.jpg`. Le texte affiché rappelle toujours que c'est de l'**information juridique générale, pas un conseil d'avocat**.

## Convention de gestion d'état

| Type de donnée | Outil |
|---|---|
| Données serveur (demandes, profils, notifications) | TanStack Query |
| État global UI (session, brouillons, demande en attente) | Zustand |
| État local (formulaire, modal) | `useState` |

## Notifications (toast)

Les retours utilisateur passent par `shared/lib/toast.ts` (wrapper de Sonner) : `toast.success(message, description?)`, `toast.error(...)`, `toast.info(...)`. Le `<Toaster />` est monté une fois dans `App.tsx`. Les erreurs d'authentification passent par `authErrorMessage(error)`, celles des demandes par `demandeErrorMessage(error)`.

## Conventions de code et d'interface

- **Utiliser les composants shadcn** (`Button`, `Card`, `Badge`, `Input`, `Label`, `Select`, `Switch`…) plutôt que des éléments HTML stylés à la main. Seules exceptions assumées : les éléments très spécifiques au produit (grand micro rond de l'assistante, trait de l'onglet actif…).
- **Cartes** : le dégradé commun est dans `shared/lib/styleCarte.ts` (`CARTE`, `CARTE_LIEN`, `CARTE_BOUTON`). Ne pas remettre de cartes blanches sur fond blanc.
- **Aucun décalage de mise en page** : réserver l'espace (`min-h-*`) pour tout ce qui apparaît ou change de texte (messages d'aide, badges, états de chargement).
- **Mêmes classes et mêmes polices sur mobile et desktop** ; ne pas retirer de fonctionnalités desktop en adaptant le mobile.
- **React Compiler** : ne pas créer de composants pendant le rendu (composants définis au niveau du module, icônes passées en JSX) ; ne pas appeler de fonctions impures (`Date.now()`) dans le rendu ; préférer `useWatch` à `form.watch`.
- **Animations** : éviter la classe Tailwind `transition` sur les éléments `motion` (elle entre en conflit avec leurs transformations) ; utiliser `transition-colors` ou une transition ciblée. Pour un lien animé : `motion.create(Link)`.
- **Router** : les routes sous `AppLayout` utilisent des chemins absolus.
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

## Endpoints supposés (à confirmer avec le back-end)

Le front mocké suppose ces endpoints en plus du document v0.1. À intégrer dans le document des endpoints ou à corriger.

**Demandes**
- `POST /demandes/{id}/envoyer` · `GET /demandes/{id}/suivi` (interrogé toutes les 5 s) · `POST /demandes/{id}/annuler` · `POST /demandes/{id}/elargir` · `GET /demandes`

**Notifications**
- `GET /notifications` · `POST /notifications/{id}/lue` · `POST /notifications/tout-lire`

**Profil**
- `GET /profil` · `PUT /profil` (`{ prenom, nom, email, regionId, communeId }`)
- `PUT /profil/photo` · `DELETE /profil/photo`
- `PUT /profil/code-secret` — doit accepter un `codeActuel` absent quand aucun code n'est défini
- `GET /referentiels/regions` · `GET /referentiels/communes?regionId=`
- `GET /profil/preferences-notifications` (`{ notificationsPush, smsSecours }`) · `PUT /profil/preferences-notifications` (`{ notificationsPush }`, puis `smsSecours` quand l'API SMS existera)
- Abonnement Web Push (service worker et VAPID), par exemple `POST /profil/push-subscription`

**Suppression du compte**
- `POST /profil/supprimer` avec `{ codeSecret }`. Réponse 204. Erreurs : `CODE_SECRET_INCORRECT` (400, `details.essaisRestants`) et `COMPTE_VERROUILLE` (423). Le serveur annule les demandes en cours, prévient les professionnels, efface ou anonymise les données et invalide la session.

**Authentification (parcours « demande d'abord »)**
- `POST /auth/particulier/inscription/finaliser` avec `{ jetonInscription }` → `TokenResponse` (201). Le jeton doit rester valide pour permettre un nouvel essai.
- Champ `codeSecretDefini` dans `utilisateur` et dans `GET /profil` (`true` pour les comptes existants).
- La connexion par code secret doit renvoyer une erreur dédiée `CODE_SECRET_NON_DEFINI` quand aucun code n'existe, pour orienter vers « Code secret oublié ».

**Assistante vocale**
- Contrat de conversation à définir avec l'équipe IA (WebSocket attendu : jeton de session, événements, format audio). Accessible sans compte, avec limitation de débit côté serveur.

## Reste à faire côté particulier

- Écran du numéro de téléphone (`/app/profil/telephone`, encore un placeholder).
- « Code secret oublié » (`/code-oublie`).
- Invitation à créer le code secret après l'envoi d'une demande, affichage « Non défini » dans le profil et gestion de « définir » sans code actuel.
- Brancher la pastille de navigation sur le nombre de notifications non lues, et l'avatar de l'en-tête sur `useProfil()`.
- Brancher la vraie conversation de Soxna Yoon (WebSocket).
- Web Push (service worker, VAPID) et SMS de secours.
- Nettoyage du router : route `/app/profil/zone` (placeholder), doublon `/code-oublie`, ancienne route `/app/assistant` (remplacée par `/assistant`).
- Nettoyage du code hérité (voir ci-dessous).

## Code hérité de l'ancienne direction

Ces éléments datent du premier parcours et ne correspondent plus au document des endpoints ni au nouveau parcours de demande. **À supprimer ou à reprendre** après vérification :

- Hooks : `useCurrentUser`, `useLogin`, `useRegister`, `useRequestOtp` (à supprimer), `useUpdateProfile` (remplacé par `features/profil`).
- Composants et hooks de localisation : `LocalisationDialog`, `useLocalisation` (remplacés par `useLocalisationPartagee`).
- Pages : `RequestPhonePage`, `WelcomePage`, `RequestChoicePage`, `MetierChoicePage`, `VoiceRequestPage`, `WrittenRequestPage`.
- Stores et hooks de brouillon : `voiceDraft.store`, `writtenDraft.store`, `useSubmitVoiceRequest`, `useSubmitWrittenRequest`, `useGeolocation`.
- Anciennes routes : `/demande/*`, `/chatbot`, `/pro/historique`, `/pro/disponibilite`, `/pro/messagerie`, `/admin/stats`.
- Anciens rôles `USER` / `PROFESSIONNEL` : remplacés par `PARTICULIER` / `PRO`.

## Questions ouvertes pour le back-end

- Pas d'endpoint « utilisateur courant » : confirmer que la restauration de session par refresh est voulue.
- Champs obligatoires à l'inscription pro (le front garde le parcours complet pour l'instant).
- Format des compteurs de navigation (demandes, notifications, professionnels en attente).
- Métier / titre du professionnel dans `User` (pour la carte utilisateur de la sidebar).
- Confirmer les [endpoints supposés](#endpoints-supposés-à-confirmer-avec-le-back-end), en particulier le parcours « demande d'abord » et la suppression du compte.
- Contrat de la conversation vocale avec l'équipe IA.

## Feuille de route MVP

1. ✅ Fondations (layouts, toasts, PWA)
2. ✅ Écrans d'authentification alignés sur les maquettes (connexion, choix d'inscription, inscription particulier, OTP, code secret)
3. ✅ Inscription professionnelle multi-étapes (UI, mockée)
4. ✅ Infrastructure API alignée sur le document des endpoints (client, refresh, erreurs, `authApi`, mock/réel)
5. ✅ Routes protégées par rôle et portée, redirection post-connexion
6. ✅ Layouts, sidebar et navigation par rôle, router avec pages placeholder
7. ✅ Espace particulier (UI et mocks) : accueil visiteur, demande avec ou sans compte, suivi, notifications, profil, assistante Soxna Yoon — voir [Reste à faire côté particulier](#reste-à-faire-côté-particulier)
8. 🔜 **Espace professionnel** : demandes, dossiers, clients, agenda ; inscription pro réelle (endpoints par étape, vérification d'email, récapitulatif, pages `/pro/validation` et `/pro/abonnement`)
9. ⬜ Espace administrateur : dashboard, validation des professionnels, moteur IA / triage
10. ⬜ Connexion au back-end réel (voir la checklist)
11. ⬜ PWA et finitions (offline, push, scénario de bout en bout)

## Public cible

Particuliers, familles, entrepreneurs, PME, diaspora, organisations, ainsi que les professionnels du droit et cabinets souhaitant digitaliser leur service.

## Licence

À définir.

## Contact

À définir.