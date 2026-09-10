# SOS Yoon 🆘⚖️ — Application (PWA)

Plateforme d'urgence juridique connectant, en quelques minutes, une personne confrontée à une situation urgente relevant du droit avec le professionnel disponible et géographiquement proche.

> **Statut actuel** : phase MVP — authentification (connexion/inscription + redirection par rôle) et fondations de l'espace applicatif (layouts, navigation, notifications toast) en place pour l'**espace utilisateur**. Prochaine étape : dépôt de demande (texte/vocal + géolocalisation), avant de passer à l'espace professionnel puis à l'espace administrateur. Le back-end n'est pas encore connecté — développement en cours sur données mockées.
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

Le projet est désormais réparti sur **deux dépôts distincts** :

| Dépôt | Rôle | Stack |
|---|---|---|
| **sos-yoon-web** (Next.js) | Landing page marketing, SEO, acquisition | Next.js |
| **sos-yoon-pwa** (ce dépôt) | Application connectée (espace utilisateur/pro/admin) | React + Vite |

Les deux dépôts partagent le même design system (shadcn) au niveau des tokens visuels, mais chacun a sa propre configuration d'outillage (build, PWA, routing).

**Point d'attention navigation inter-dépôts** : les liens de la landing (Next.js) vers l'application (ex. boutons "Se connecter" / "S'inscrire") pointent vers les routes `/login` et `/register` de ce dépôt. Le domaine/sous-domaine exact de déploiement de chaque dépôt reste à définir.

## Fonctionnalités principales

- Dépôt de demande urgente (texte ou message vocal, français / langues locales)
- Triage automatique par IA
- Géolocalisation approximative et dispatch pondéré
- Chatbot d'orientation
- Notifications et rappels actifs
- Espace professionnel (profil, spécialité, disponibilité, historique)
- Tableau de bord d'administration
- Suivi en temps réel des demandes et messagerie intégrée

## Stack technique

### Frontend (ce dépôt)

| Domaine | Technologie | Statut |
|---|---|---|
| Framework | React 19 + Vite | ✅ |
| Langage | TypeScript | ✅ |
| Style | TailwindCSS v4 | ✅ |
| Composants UI | shadcn/ui (Base UI, preset Nova) | ✅ |
| Animations | Motion (ex-Framer Motion) | ✅ |
| Routing | React Router | ✅ configuré (racine → redirection intelligente + espace utilisateur) |
| État serveur | TanStack React Query | ✅ configuré (`QueryProvider`) |
| État global | Zustand | ✅ (`auth.store.ts`) |
| Formulaires | React Hook Form + Zod | ✅ (login/register) |
| Notifications UI | Sonner (toasts) | ✅ configuré (`Toaster` + wrapper `toast.ts`) |
| Temps réel | Socket.io-client | 🔜 à venir (messagerie) |
| Cartes | Leaflet / React-Leaflet | 🔜 à venir (géolocalisation demande) |
| i18n | i18next | 🔜 à venir |
| Monitoring | Sentry | 🔜 à venir |
| PWA | vite-plugin-pwa | ✅ configuré (cache assets/réseau via Workbox) |

**Note sur le cache** : Workbox gère le cache réseau (assets statiques, réponses API en `NetworkFirst` sur courte durée) pour la performance et la résilience sur connexion faible. TanStack Query gérera le cache applicatif (données serveur : demandes, profils, statuts) une fois le back-end connecté. Pas de stratégie offline-first complète prévue pour le MVP — seule la saisie du formulaire de demande urgente aura un filet de sécurité local (sauvegarde ponctuelle si la connexion coupe en cours de saisie).

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
│   └── router.tsx              # Routes publiques (login/register) + espaces protégés par rôle
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
│   ├── auth/                    # ✅ Connexion, inscription, redirection par rôle
│   │   ├── api/
│   │   ├── components/          # LoginForm, RegisterForm...
│   │   ├── hooks/                # useLogin, useRegister
│   │   ├── pages/                # LoginPage, RegisterPage
│   │   ├── schema/                # Validation Zod
│   │   └── store/
│   │       └── auth.store.ts     # Zustand : user, isAuthenticated, initialize, logout
│   ├── demandes/                 # 🔜 En cours — dépôt, suivi, historique
│   ├── notifications/            # 🔜 En cours — centre de notifications utilisateur
│   ├── profil/                   # 🔜 En cours — profil, mot de passe
│   ├── professionnel/            # À venir — dispo, demandes reçues, messagerie
│   └── admin/                    # À venir — dashboard, gestion pros/users, stats
│
├── shared/
│   ├── components/
│   │   ├── ui/                   # Généré par shadcn — ne pas éditer à la main
│   │   ├── ProtectedRoute.tsx    # Garde d'authentification + de rôle
│   │   ├── RootRedirect.tsx      # Redirige "/" selon l'état d'authentification
│   │   └── PagePlaceholder.tsx   # Écran temporaire pour routes en construction
│   ├── hooks/
│   │   └── useIsMobile.ts
│   └── lib/
│       ├── toast.ts              # Wrapper autour de sonner
│       ├── getSpaceRoute.ts      # Route d'atterrissage post-login par rôle
│       ├── tokenManager.ts
│       └── errorHandler.ts
│
├── locales/                      # À venir
├── types/
│   └── user.types.ts             # UserRole, User, ProfessionnelProfile...
└── assets/
```

Chaque feature suit une organisation interne cohérente : `components/`, `hooks/`, `api/`, `pages/`, `types.ts`.

> La landing page (`Navbar`, `Hero`, `HowItWorks`, etc.) a été retirée de ce dépôt et vit désormais dans le projet Next.js `sos-yoon-web`.

## Rôles et redirection

`UserRole` (voir `types/user.types.ts`) : `"USER" | "PROFESSIONNEL" | "ADMIN"`.

La racine `/` de l'application ne sert plus de landing page : `RootRedirect` détermine automatiquement où envoyer le visiteur :

- **Non connecté** → `/login`
- **Connecté** → route de son espace via `getSpaceRoute(role)`

| Rôle | Route | Statut |
|---|---|---|
| `USER` | `/app` | ✅ espace en cours de construction |
| `PROFESSIONNEL` | `/pro` | 🔜 à venir |
| `ADMIN` | `/admin` | 🔜 à venir |

Chaque espace est protégé par `ProtectedRoute` (garde d'authentification + de rôle) et rendu à l'intérieur d'`AppLayout`, qui sélectionne automatiquement `DesktopLayout` (sidebar) ou `MobileLayout` (tab bar basse) selon la largeur d'écran, avec les items de navigation définis par rôle dans `navigationByRole`.

## Convention de gestion d'état

| Type de donnée | Outil |
|---|---|
| Données serveur (demandes, profils, statuts) | React Query |
| État global UI (auth, langue, thème) | Zustand |
| État local (formulaire, modal) | useState |

## Notifications (Toast)

Les retours utilisateur (succès/échec d'une action) passent par un wrapper unique autour de [Sonner](https://sonner.emilkowal.ski/) (`shared/lib/toast.ts`), plutôt que d'appeler la librairie directement dans les composants. Le `<Toaster />` est monté une seule fois dans `App.tsx`.

## Direction visuelle

| Rôle | Valeur |
|---|---|
| Couleur `ink` (fond sombre) | `#0B1220` |
| Couleur `paper` (fond clair) | `#FAF7F2` |
| Couleur `signal` (accent CTA) | `#F0A202` |
| Couleur `brass` (accent secondaire) | `#B8860B` |
| Police display | Fraunces |
| Police corps de texte | Geist |

Signature visuelle : un radar de dispatch animé (`RadarPulse`), représentant le mécanisme de mise en relation par proximité. Ces tokens sont partagés avec le dépôt Next.js de la landing page pour garder une cohérence visuelle entre marketing et application.

## PWA

L'application est configurée en Progressive Web App : installation sur mobile et desktop, notifications push, et mise en cache pour un fonctionnement correct sur connexion faible.

Le `start_url` et le `scope` restent `"/"` : la racine gère désormais elle-même la redirection (connecté → espace applicatif, sinon → `/login`), donc l'expérience post-installation reste cohérente sans avoir besoin de pointer directement vers `/app`. Le champ `id: "/"` du manifest est fixé pour garantir que ce choix ne casse pas l'installation existante des utilisateurs.

## Feuille de route MVP

Développement séquencé acteur par acteur (utilisateur → professionnel → admin), sur données mockées avant branchement au back-end réel :

1. ✅ Fondations transverses (layouts, navigation, toasts)
2. ✅ Authentification et routes protégées par rôle
3. ✅ Extraction de la landing page vers un dépôt Next.js séparé
4. 🔜 Espace utilisateur — Nouvelle demande (texte/vocal + géolocalisation)
5. ⬜ Suivi et historique des demandes
6. ⬜ Espace professionnel (disponibilité, demandes reçues, messagerie, historique)
7. ⬜ Espace administrateur (dashboard, gestion pros/users, supervision, stats)
8. ⬜ Connexion au back-end réel (remplacement des mocks)
9. ⬜ PWA et finitions (offline, push, scénario de bout en bout)

## Public cible

Particuliers, familles, entrepreneurs, PME, diaspora, organisations, ainsi que les professionnels du droit et cabinets souhaitant digitaliser leur service.

## Licence

À définir.

## Contact

À définir.