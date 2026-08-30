# SOS Yoon 🆘⚖️

Plateforme d'urgence juridique connectant, en quelques minutes, une personne confrontée à une situation urgente relevant du droit avec le professionnel disponible et géographiquement proche.

> **Statut actuel** : phase MVP — landing page terminée, authentification (connexion/inscription + redirection par rôle) et fondations de l'espace applicatif (layouts, navigation, notifications toast) en place pour l'**espace utilisateur**. Prochaine étape : dépôt de demande (texte/vocal + géolocalisation), avant de passer à l'espace professionnel puis à l'espace administrateur. Le back-end n'est pas encore connecté — développement en cours sur données mockées.
>
> Le projet est organisé en **un seul dépôt** : la landing et l'application partagent la même base de code, le même design system (shadcn) et la même configuration PWA, pour éviter la duplication d'outillage entre deux projets séparés.

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

## Stack technique

### Frontend (ce dépôt)

| Domaine | Technologie | Statut |
|---|---|---|
| Framework | React 19 + Vite | ✅ |
| Langage | TypeScript | ✅ |
| Style | TailwindCSS v4 | ✅ |
| Composants UI | shadcn/ui (Base UI, preset Nova) | ✅ |
| Animations | Motion (ex-Framer Motion) | ✅ |
| Routing | React Router | ✅ configuré (espace utilisateur) |
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
│   └── router.tsx              # Routes publiques + espace utilisateur protégé
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
│   ├── landing/                 # ✅ Landing page (terminée)
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

La feature `landing/` est organisée en sections assemblées dans `LandingPage.tsx` : `Navbar` (partagé), `Hero`, `TrustBanner`, `ProblemSection`, `HowItWorks`, `LegalDomainsGrid`, `AppShowcase`, `AudienceSection`, `TrustSecurity`, `FinalCta`, `Footer`.

## Rôles et redirection

`UserRole` (voir `types/user.types.ts`) : `"USER" | "PROFESSIONNEL" | "ADMIN"`.

Après connexion, `getSpaceRoute(role)` détermine la page d'atterrissage :

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

Signature visuelle : un radar de dispatch animé (`RadarPulse`), représentant le mécanisme de mise en relation par proximité.

## PWA

L'application est configurée en Progressive Web App : installation sur mobile et desktop, notifications push, et mise en cache pour un fonctionnement correct sur connexion faible.

**Point d'attention pour la suite** : envisager d'ajuster `start_url` selon le statut de connexion de l'utilisateur (écran d'accueil applicatif plutôt que la landing marketing complète pour un utilisateur qui a déjà installé l'app). Le champ `id: "/"` du manifest est déjà fixé pour garantir que ce changement futur ne casse pas l'installation existante des utilisateurs.

## Feuille de route MVP

Développement séquencé acteur par acteur (utilisateur → professionnel → admin), sur données mockées avant branchement au back-end réel :

1. ✅ Fondations transverses (layouts, navigation, toasts)
2. ✅ Authentification et routes protégées par rôle
3. 🔜 Espace utilisateur — Nouvelle demande (texte/vocal + géolocalisation)
4. ⬜ Suivi et historique des demandes
5. ⬜ Espace professionnel (disponibilité, demandes reçues, messagerie, historique)
6. ⬜ Espace administrateur (dashboard, gestion pros/users, supervision, stats)
7. ⬜ Connexion au back-end réel (remplacement des mocks)
8. ⬜ PWA et finitions (offline, push, scénario de bout en bout)

## Public cible

Particuliers, familles, entrepreneurs, PME, diaspora, organisations, ainsi que les professionnels du droit et cabinets souhaitant digitaliser leur service.

## Licence

À définir.

## Contact

À définir.