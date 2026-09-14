# SOS Yoon 🆘⚖️ — Application (PWA)

Plateforme d'urgence juridique connectant, en quelques minutes, une personne confrontée à une situation urgente relevant du droit avec le professionnel disponible et géographiquement proche.

> **Statut actuel** : phase MVP — écran de bienvenue, parcours de dépôt de demande (vocal et écrit, avec géolocalisation), authentification complète (inscription particulier/professionnel, connexion, vérification OTP unifiée) et fondations de l'espace applicatif (layouts, navigation, notifications toast) sont en place. Prochaine étape : suivi des demandes dans l'espace connecté, avant de passer à l'espace professionnel puis à l'espace administrateur. Le back-end n'est pas encore connecté — développement en cours sur données mockées, isolées dans des fichiers `mock*.ts` clairement identifiés pour faciliter le branchement futur.
>
> **Ce dépôt ne contient plus la landing page marketing.** Elle a été extraite dans un projet **Next.js séparé**. Ce dépôt-ci est désormais dédié exclusivement à l'application connectée (espace utilisateur, professionnel, administrateur) et à sa configuration PWA.

## À propos

SOS Yoon couvre les quatre métiers du droit au Sénégal :

- **Avocat**
- **Huissier**
- **Notaire**
- **Juriste-conseil**

L'utilisateur n'a pas à chercher lui-même un professionnel : il dépose sa demande (texte ou vocal), un moteur de triage intelligent identifie le bon métier, et il est orienté automatiquement vers le professionnel le plus pertinent selon sa spécialité, sa disponibilité et sa proximité.

## Fonctionnalités principales

- Dépôt de demande urgente (texte ou message vocal, français / langues locales)
- Triage automatique par IA
- Géolocalisation approximative et dispatch pondéré
- Chatbot d'orientation
- Notifications et rappels actifs
- Espace professionnel (profil, spécialité, disponibilité, historique)
- Tableau de bord d'administration
- Suivi en temps réel des demandes et messagerie intégrée

## Organisation multi-dépôts

Le projet est réparti sur **deux dépôts distincts** :

| Dépôt | Rôle | Stack |
|---|---|---|
| **sos-yoon-web** (Next.js) | Landing page marketing, SEO, acquisition | Next.js |
| **sos-yoon-pwa** (ce dépôt) | Application connectée (espace utilisateur/pro/admin) | React + Vite |

Les deux dépôts partagent le même design system (shadcn) au niveau des tokens visuels, mais chacun a sa propre configuration d'outillage (build, PWA, routing).

## Stack technique

### Frontend (ce dépôt)

| Domaine | Technologie | Statut |
|---|---|---|
| Framework | React 19 + Vite | ✅ |
| Langage | TypeScript | ✅ |
| Style | TailwindCSS v4 | ✅ |
| Composants UI | shadcn/ui — **Base UI** (pas Radix) | ✅ |
| Animations | Motion (ex-Framer Motion) | ✅ |
| Routing | React Router | ✅ |
| État serveur | TanStack React Query | ✅ configuré (`QueryProvider`) |
| État global | Zustand | ✅ (`auth.store`, `voiceDraft.store`, `writtenDraft.store`) |
| Formulaires | React Hook Form + Zod | ✅ |
| Notifications UI | Sonner (toasts) | ✅ configuré (`Toaster` + wrapper `toast.ts`) |
| Enregistrement vocal | react-media-recorder | ✅ (`useVoiceRecorder`) |
| Géolocalisation | API navigateur (`navigator.geolocation`) | ✅ (`useGeolocation`) |
| Cartes | Leaflet / React-Leaflet | 🔜 à venir (affichage carte du dispatch) |
| Temps réel | Socket.io-client | 🔜 à venir (messagerie) |
| i18n | i18next | 🔜 à venir |
| Monitoring | Sentry | 🔜 à venir |
| PWA | vite-plugin-pwa | ✅ configuré (cache assets/réseau via Workbox) |
| Mode sombre | — | ❌ abandonné (voir note ci-dessous) |

**Note sur Base UI** : le preset shadcn utilisé ici repose sur **Base UI**, pas sur Radix (la valeur par défaut la plus documentée en ligne). Différences pratiques à connaître pour tout nouveau composant :
- Composition : `render={<Composant />}` au lieu de `asChild` (ex. `DropdownMenuTrigger`).
- État actif d'un item : attribut `data-active` (booléen) au lieu de `data-state="active"` (Radix).
- Certains composants (`TabsTrigger`, etc.) imposent une hauteur interne (`h-[calc(100%-1px)]`) qu'il faut explicitement surcharger (`h-full`) et envelopper d'un `overflow-hidden` sur le parent pour éviter tout débordement visuel lors d'une customisation de taille.

**Note sur le mode sombre** : une tentative d'implémentation (`ThemeProvider` + `ModeToggle` + Tailwind `@custom-variant dark`) a été faite puis **retirée** — la fonctionnalité est mise de côté pour se concentrer sur les parcours métier. Le dossier `shared/theme/` a été supprimé.

**Note sur le cache** : Workbox gère le cache réseau (assets statiques, réponses API en `NetworkFirst` sur courte durée) pour la performance et la résilience sur connexion faible. TanStack Query gérera le cache applicatif (données serveur : demandes, profils, statuts) une fois le back-end connecté.

### Backend

| Domaine | Technologie |
|---|---|
| Langage / Framework | Java / Spring Boot |
| Base de données | PostgreSQL |
| Hébergement | Azure / AWS |
| Cache | Caffeine |
| Sécurité | JWT, MFA, SSL |

## Prérequis

- Node.js ≥ 20
- [pnpm](https://pnpm.io/)

## Installation

```bash
git clone <url-du-repo>
cd sos_yoon_pwa
pnpm install
```

Copier le fichier d'environnement et renseigner les variables nécessaires :

```bash
cp .env.example .env
```

## Scripts disponibles

```bash
pnpm dev        # Lancer le serveur de développement
pnpm build      # Build de production
pnpm preview    # Prévisualiser le build de production
pnpm lint       # Linter le code
```

## Architecture du projet

```
src/
├── app/
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx
│   └── router.tsx              # Toutes les routes de l'application
│
├── config/
│   └── navigation.ts           # Items de sidebar/tab bar par rôle (UserRole)
│
├── layouts/
│   ├── AppLayout.tsx            # Choisit Desktop/Mobile selon le viewport
│   ├── DesktopLayout.tsx        # Sidebar fixe + contenu
│   ├── MobileLayout.tsx         # Contenu + tab bar basse
│   └── Sidebar.tsx
│
├── features/
│   ├── onboarding/               # ✅ Écran de bienvenue, choix du canal de demande
│   │   └── pages/
│   │       ├── WelcomePage.tsx           # Point d'entrée "/" pour un visiteur non connecté
│   │       └── RequestChoicePage.tsx     # Choix : vocal / écrit / chatbot
│   │
│   ├── auth/                     # ✅ Inscription, connexion, vérification OTP
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── RegisterParticulierForm.tsx     # nom, prénom, téléphone
│   │   │   ├── RegisterProfessionnelForm.tsx   # multi-étapes : infos perso, identifiants,
│   │   │   │                                   # métier + zone + n° ordre, diplôme
│   │   │   ├── LoginParticulierForm.tsx        # téléphone seul
│   │   │   ├── LoginProfessionnelForm.tsx      # email + mot de passe
│   │   │   └── OtpForm.tsx                     # saisie du code à 6 chiffres, renvoi
│   │   ├── hooks/                # useRegisterParticulier, useRegisterProfessionnel,
│   │   │                         # useLoginParticulier, useLoginProfessionnel,
│   │   │                         # useRequestOtp, useVerifyOtp
│   │   ├── lib/
│   │   │   ├── mockAuth.ts       # ⚠️ à supprimer une fois le back-end connecté
│   │   │   └── senegalZones.ts   # liste des 14 régions (zone d'intervention pro)
│   │   ├── pages/
│   │   │   ├── RegisterChoicePage.tsx          # Particulier / Professionnel
│   │   │   ├── RegisterParticulierPage.tsx
│   │   │   ├── RegisterProfessionnelPage.tsx
│   │   │   ├── LoginPage.tsx                   # Tabs shadcn : Particulier / Professionnel
│   │   │   └── VerifyOtpPage.tsx               # écran OTP unique, tous parcours confondus
│   │   ├── schema/                # Zod : register/login (particulier + pro), OTP
│   │   └── store/
│   │       └── auth.store.ts     # Zustand : user, isAuthenticated, setUser, logout, initialize
│   │
│   ├── demandes/                 # ✅ En cours — dépôt de demande (vocal + écrit)
│   │   ├── components/
│   │   │   ├── VoiceRecorderPanel.tsx    # enregistrement, écoute, envoi
│   │   │   └── WrittenRequestForm.tsx    # message texte + géolocalisation
│   │   ├── hooks/
│   │   │   ├── useVoiceRecorder.ts       # wrapper react-media-recorder + timer
│   │   │   ├── useGeolocation.ts         # wrapper navigator.geolocation
│   │   │   ├── useSubmitVoiceRequest.ts
│   │   │   └── useSubmitWrittenRequest.ts
│   │   ├── lib/
│   │   │   ├── formatDuration.ts
│   │   │   └── metiers.ts                # les 4 métiers + icône/description/accent
│   │   │                                 # (réutilisé aussi par le formulaire pro)
│   │   ├── pages/
│   │   │   ├── VoiceRequestPage.tsx
│   │   │   ├── MetierChoicePage.tsx      # choix du métier avant le formulaire écrit
│   │   │   └── WrittenRequestPage.tsx
│   │   ├── schema/
│   │   │   └── writtenRequest.schema.ts
│   │   └── store/
│   │       ├── voiceDraft.store.ts       # brouillon audio en attente d'authentification
│   │       └── writtenDraft.store.ts     # brouillon texte + métier + position
│   ├── notifications/            # 🔜 En cours — centre de notifications utilisateur
│   ├── profil/                   # 🔜 En cours — profil, mot de passe
│   ├── professionnel/            # À venir — dispo, demandes reçues, messagerie
│   └── admin/                    # À venir — dashboard, gestion pros/users, stats
│
├── shared/
│   ├── components/
│   │   ├── ui/                   # Généré par shadcn (Base UI) — ne pas éditer à la main
│   │   ├── AuthVisualPanel.tsx   # panneau radar animé, colonne gauche inscription
│   │   ├── LoginVisualPanel.tsx  # variante du panneau, colonne gauche connexion
│   │   ├── AmbientBackground.tsx # pattern de points + blobs, masqué au centre
│   │   ├── CurvedDivider.tsx     # séparateur SVG ondulé entre les deux colonnes
│   │   ├── ProtectedRoute.tsx    # garde d'authentification + de rôle
│   │   ├── RootGate.tsx          # racine "/" : redirige si connecté, sinon WelcomePage
│   │   ├── NotFoundPage.tsx
│   │   └── PagePlaceholder.tsx   # écran temporaire pour routes en construction
│   ├── hooks/
│   │   └── useIsMobile.ts
│   └── lib/
│       ├── toast.ts              # wrapper autour de sonner
│       ├── getSpaceRoute.ts      # route d'atterrissage post-login par rôle
│       ├── tokenManager.ts       # stockage des tokens (localStorage, à migrer en httpOnly)
│       └── errorHandler.ts
│
├── locales/                      # À venir
├── types/
│   └── user.types.ts             # UserRole, Metier, User, ProfessionnelProfile...
└── assets/
```

> `shared/theme/` (ThemeProvider, ModeToggle) a été supprimé — le mode sombre n'est plus poursuivi pour l'instant.
> `features/landing/` n'existe plus dans ce dépôt — la landing vit dans `sos-yoon-web` (Next.js).

## Parcours utilisateur

### Racine `/`

`RootGate` décide de l'écran affiché à chaque visite de `/` :

- **Connecté** → redirection immédiate vers `getSpaceRoute(user.role)` (`/app`, `/pro` ou `/admin`), sans jamais afficher `WelcomePage`.
- **Non connecté** → `WelcomePage` s'affiche à chaque fois (pas seulement à la première visite).

### Dépôt d'une demande — utilisateur déjà connecté

```
/app → point d'entrée "Nouvelle demande" dans la navigation
   → interface dédiée à l'espace connecté (non construite pour l'instant,
     volontairement laissée en suspens tant que sa forme n'est pas définie)
```

### Dépôt d'une demande — utilisateur non connecté (avec ou sans compte existant)

Le canal **vocal** et le canal **écrit** partagent le même mécanisme : la demande est capturée *avant* de demander une identification, jamais l'inverse.

```
WelcomePage (/)
   → bouton "SOS" → RequestChoicePage (/demande)
   → "Message vocal" (/demande/vocal)
        → enregistrement, écoute, "Envoyer"
   → "Message écrit" → MetierChoicePage (/demande/ecrit/metier)
        → choix du métier → WrittenRequestPage (/demande/ecrit)
        → message + géolocalisation obligatoire, "Envoyer"

   → si connecté : soumission immédiate, associée au compte
   → si non connecté :
        → le contenu de la demande (audio, ou message+métier+position)
          est mis de côté dans un store Zustand dédié
          (voiceDraft.store / writtenDraft.store)
        → redirection vers RequestPhonePage (/demande/telephone)
        → saisie du numéro (un seul champ, pas de nom/prénom à ce stade)
        → useRequestOtp envoie un code — même endpoint, que le numéro
          corresponde à un compte existant ou à un nouveau compte
        → VerifyOtpPage (/verification-otp), écran unique pour tous
          les parcours (connexion, inscription, ou demande en attente)
        → code validé : le compte est créé ou retrouvé côté back-end
          (invisible pour le front), l'utilisateur est connecté
        → si un brouillon de demande est en attente, il est soumis
          automatiquement à cet instant
        → redirection vers le suivi de la demande
```

### Connexion / inscription directes (sans demande en attente)

```
WelcomePage → "Se connecter" → LoginPage (/login)
   → Tabs shadcn : Particulier (téléphone seul) / Professionnel (email + mot de passe)
   → LoginParticulierForm envoie aussi un code → VerifyOtpPage → connecté → /app
   → LoginProfessionnelForm reste synchrone (pas d'étape OTP) → /pro

WelcomePage → "Inscrivez-vous" → RegisterChoicePage (/register)
   → "Particulier" → RegisterParticulierPage (nom, prénom, téléphone) → OTP → /app
   → "Professionnel" → RegisterProfessionnelPage (multi-étapes, 4 étapes) → /pro
     (redirection directe, pas d'étape OTP pour ce profil)
```

## Inscription professionnelle — détail des étapes

`RegisterProfessionnelForm` est un formulaire en 4 étapes (`REGISTER_PROFESSIONNEL_STEPS`), chacune validée indépendamment avant de passer à la suivante :

1. **Informations personnelles** — nom, prénom, téléphone
2. **Identifiants de connexion** — email, mot de passe, confirmation
3. **Informations professionnelles** — **profession** (`metier`, sélection parmi les 4 métiers du droit via `Select` shadcn, réutilise `METIERS` de `features/demandes/lib/metiers.ts`), zone d'intervention (région), numéro d'inscription à l'ordre
4. **Documents justificatifs** — upload du diplôme (PDF/JPG/PNG, 5 Mo max)

## Rôles et redirection

`UserRole` (voir `types/user.types.ts`) : `"USER" | "PROFESSIONNEL" | "ADMIN"`.

| Rôle | Route | Statut |
|---|---|---|
| `USER` | `/app` | ✅ espace en cours de construction |
| `PROFESSIONNEL` | `/pro` | 🔜 à venir |
| `ADMIN` | `/admin` | 🔜 à venir |

Chaque espace est protégé par `ProtectedRoute` (garde d'authentification + de rôle) et rendu à l'intérieur d'`AppLayout`, qui sélectionne automatiquement `DesktopLayout` (sidebar) ou `MobileLayout` (tab bar basse) selon la largeur d'écran.

**Point d'attention** : tant que le back-end réel n'est pas connecté, toute redirection vers une route protégée (`/app`, `/pro`) après une action mockée (inscription pro, soumission de demande) dépend de ce que `mockAuth.ts` a effectivement posé dans `auth.store` + `tokenManager`. Si l'un des deux manque, `ProtectedRoute` bloque l'accès normalement.

## Convention de gestion d'état

| Type de donnée | Outil |
|---|---|
| Données serveur (demandes, profils, statuts) | React Query |
| État global UI (auth, brouillons de demande en attente) | Zustand |
| État local (formulaire, modal, géolocalisation, enregistrement en cours) | useState |

## Notifications (Toast)

Les retours utilisateur (succès/échec d'une action) passent par un wrapper unique autour de [Sonner](https://sonner.emilkowal.ski/) (`shared/lib/toast.ts`), plutôt que d'appeler la librairie directement dans les composants. Signature : `toast.success(message, description?)` / `toast.error(message, description?)` / `toast.info(message, description?)`. Le `<Toaster />` est monté une seule fois dans `App.tsx`.

## Direction visuelle

| Rôle | Valeur |
|---|---|
| Couleur `ink` (fond sombre) | `#0B1220` |
| Couleur `paper` (fond clair) | `#FAF7F2` |
| Couleur `signal` (accent CTA) | `#F0A202` |
| Couleur `brass` (accent secondaire) | `#B8860B` |
| Police display | Fraunces |
| Police corps de texte | Geist |

Signature visuelle : un radar de dispatch animé, décliné en deux composants — `AuthVisualPanel` (inscription) et `LoginVisualPanel` (connexion) — affichés en colonne gauche sur les écrans d'authentification en desktop, avec un `CurvedDivider` (SVG ondulé) entre les deux colonnes plutôt qu'une simple ligne droite. Le même principe de pulsation radar est repris sur le bouton "SOS" de `WelcomePage` et sur le bouton d'enregistrement de `VoiceRecorderPanel`.

## PWA

L'application est configurée en Progressive Web App : installation sur mobile et desktop, notifications push, et mise en cache pour un fonctionnement correct sur connexion faible.

Le `start_url` et le `scope` restent `"/"` : la racine (`RootGate`) gère elle-même la redirection, donc l'expérience post-installation reste cohérente. Le champ `id: "/"` du manifest est fixé pour garantir que ce choix ne casse pas l'installation existante des utilisateurs.

**Point technique à surveiller (mobile Android)** : préférer `min-h-dvh` sans `overflow-hidden` plutôt que `h-dvh` + `overflow-hidden` sur les conteneurs plein écran — certains WebView Android calculent `dvh` différemment de Safari iOS, ce qui peut couper du contenu sans possibilité de scroll si les deux classes sont combinées.

## Feuille de route MVP

1. ✅ Fondations transverses (layouts, navigation, toasts)
2. ✅ Authentification et routes protégées par rôle
3. ✅ Extraction de la landing page vers un dépôt Next.js séparé
4. ✅ Écran de bienvenue, choix du canal de demande (vocal / écrit / chatbot)
5. ✅ Dépôt de demande vocale et écrite (avec géolocalisation), flow OTP unifié pour les utilisateurs non connectés
6. ✅ Inscription professionnelle complète (identifiants, profession, zone, ordre, diplôme)
7. 🔜 Suivi et historique des demandes (route `/app/demandes/suivi` à construire)
8. ⬜ Interface de dépôt de demande dédiée à l'espace connecté
9. ⬜ Espace professionnel (disponibilité, demandes reçues, messagerie, historique)
10. ⬜ Espace administrateur (dashboard, gestion pros/users, supervision, stats)
11. ⬜ Connexion au back-end réel (remplacement des mocks, dont `mockAuth.ts`)
12. ⬜ PWA et finitions (offline, push, scénario de bout en bout)

## Public cible

Particuliers, familles, entrepreneurs, PME, diaspora, organisations, ainsi que les professionnels du droit et cabinets souhaitant digitaliser leur service.

## Licence

À définir.

## Contact

À définir.