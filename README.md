# SOS Yoon 🆘⚖️

Plateforme d'urgence juridique connectant, en quelques minutes, une personne confrontée à une situation urgente relevant du droit avec le professionnel disponible et géographiquement proche.

> **Statut actuel** : phase MVP — landing page de présentation en cours de finalisation pour recueillir les retours des clients-testeurs avant de connecter le back-end et développer les fonctionnalités applicatives (dépôt de demande, triage, espace professionnel, etc.).

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

| Domaine | Technologie |
|---|---|
| Framework | React 19 + Vite |
| Langage | TypeScript |
| Style | TailwindCSS v4 |
| Composants UI | shadcn/ui (Base UI, preset Nova) |
| Animations | Motion (ex-Framer Motion) |
| Routing | React Router *(à venir)* |
| État serveur | TanStack React Query *(à venir)* |
| État global | Zustand *(à venir)* |
| Formulaires | React Hook Form + Zod *(à venir)* |
| Temps réel | Socket.io-client *(à venir)* |
| Cartes | Leaflet / React-Leaflet *(à venir)* |
| i18n | i18next *(à venir)* |
| Monitoring | Sentry *(à venir)* |
| PWA | vite-plugin-pwa ✅ configuré |

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
├── app/                    # Configuration globale (router, providers)
├── config/                 # Config transverse (rôles, routes, env)
├── features/               # Un dossier par fonctionnalité métier
│   ├── landing/             # ✅ Landing page MVP (en cours)
│   ├── demande-urgente/     # À venir
│   ├── professionnel/       # À venir
│   ├── suivi-demande/       # À venir
│   ├── messagerie/          # À venir
│   ├── auth/                 # À venir
│   └── admin-dashboard/      # À venir
├── shared/
│   ├── components/
│   │   ├── ui/               # Généré par shadcn — ne pas éditer à la main
│   │   ├── AnimatedSection.tsx
│   │   └── StaggerGroup.tsx
│   ├── hooks/
│   └── lib/                  # axios, socket, utils (cn), errorHandler
├── layouts/                 # Layouts mobile / desktop (à venir)
├── locales/                 # Fichiers de traduction (à venir)
├── types/                   # Types partagés
└── assets/
```

Chaque feature suit une organisation interne cohérente : `components/`, `hooks/`, `api/`, `types.ts`.

La feature `landing/` est organisée en sections assemblées dans `LandingPage.tsx` : `Hero`, `TrustBanner`, `ProblemSection`, `HowItWorks`, `LegalDomainsGrid`, `AppShowcase`, `AudienceSection`, `TrustSecurity`, `FinalCta`, `Footer`.

## Convention de gestion d'état

| Type de donnée | Outil |
|---|---|
| Données serveur (demandes, profils, statuts) | React Query |
| État global UI (auth, langue, thème) | Zustand |
| État local (formulaire, modal) | useState |

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

## Public cible

Particuliers, familles, entrepreneurs, PME, diaspora, organisations, ainsi que les professionnels du droit et cabinets souhaitant digitaliser leur service.

## Licence

À définir.

## Contact

À définir.