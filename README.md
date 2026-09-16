# OISSU CONNECT — Client

Frontend **Next.js** d'OISSU CONNECT : suivi et traçabilité des performances des
athlètes du sport scolaire et universitaire. Il implémente la V1 décrite dans
`OISSU_CONNECT_Conception_Technique_V1_Seed.docx` (§5.2, §13, §14, §15).

> **Les données affichées en démonstration sont fictives.** Elles proviennent du
> seed de l'API et ne représentent pas des données réelles de l'OISSU.

## Stack

- **Next.js 15** (App Router, React 19, Server Components)
- **TypeScript**
- **Tailwind CSS 4** + composants façon shadcn/ui (`components/ui/`)
- **Recharts** pour les graphiques d'évolution
- **Docker** — image multi-étapes, hot-reload en dev, bundle `standalone` en prod

## Démarrage rapide

```bash
cp .env.example .env      # ajustez API_INTERNAL_URL si besoin
npm install
npm run dev               # http://localhost:3000
```

Ou avec Docker (la configuration de la branche courante s'applique
automatiquement) :

```bash
docker compose up --build
```

L'API doit tourner en parallèle (voir `../backend/oissu`) :

```bash
cd ../backend/oissu
shaapi up
shaapi shell
python -m backend.cli seed-demo
```

Comptes de démonstration :

| Rôle | Login | Mot de passe |
| --- | --- | --- |
| ADMIN | `admin.demo@oissu-demo.ci` | `OissuDemo2026!` |
| ATHLÈTE | `athlete001@oissu-demo.ci` | `AthleteDemo2026!` |

## Parcours

```
/                       Accueil public (aucune inscription publique)
/login                  Écran de connexion commun USER + ADMIN
  ├── role=USER  ──> /dashboard      Tableau de bord athlète
  │                  /performances   Historique complet
  │                  /profile        Fiche + informations modifiables
  └── role=ADMIN ──> /admin/dashboard        Pilotage global
                     /admin/athletes         Liste, recherche, filtres
                     /admin/athletes/register  « Register an athlete »
                     /admin/athletes/[id]    Fiche, historique, actions
                     /admin/performances     Toutes les performances
```

## Authentification

Le jeton d'accès **n'atteint jamais le JavaScript du navigateur**.

1. `/login` envoie les identifiants à `app/api/auth/login/route.ts` (côté
   serveur Next.js).
2. Cette route interroge l'API, puis dépose le jeton dans un cookie `httpOnly`.
3. `middleware.ts` lit ce cookie pour protéger les routes et rediriger selon le
   rôle.
4. Les appels du navigateur passent par `/api/proxy/*`, qui rattache le jeton
   côté serveur.

Deux conséquences utiles : une faille XSS sur le front ne peut pas exfiltrer de
jeton exploitable, et le navigateur ne fait que des requêtes **same-origin**,
donc aucun pre-flight CORS quel que soit l'environnement.

Le contrôle d'accès côté client reste une *redirection*, jamais une
autorisation : chaque route `/admin/*` est revérifiée par l'API (`DependsAdmin`).

## Structure

```
app/
├── page.tsx                  Accueil public
├── login/                    Écran de connexion
├── dashboard/                Espace USER
├── performances/
├── profile/
├── admin/                    Espace ADMIN
│   ├── dashboard/
│   ├── athletes/
│   │   ├── register/
│   │   └── [id]/
│   └── performances/
└── api/                      Route handlers (login, logout, proxy)
components/
├── ui/                       Primitives (button, card, table, select…)
├── layout/                   Shell applicatif et navigation
├── dashboard/                Cartes de statistiques et graphiques
├── athlete/                  Fiche, historique, meilleurs résultats
└── admin/                    Filtres, formulaires, actions
lib/
├── api-server.ts             Client API côté serveur
├── api-client.ts             Client API côté navigateur (via /api/proxy)
├── auth.ts                   Session et cookies
├── constants.ts              Référentiels (disciplines, catégories…)
└── utils.ts
types/                        Types des réponses de l'API
middleware.ts                 Garde de routes
```

## Branches et configuration Docker

Trois branches, **le même code source**, des fichiers de configuration Docker
différents. `docker-compose.yml` est identique partout et décrit la forme de
production : l'image est **tirée** du registre, pas construite. Seul
`docker-compose.dev.yml` ajoute une section `build:`. Chaque branche fournit son
propre `docker-compose.override.yml`, chargé automatiquement par
`docker compose up`.

| Branche | `docker-compose.override.yml` | Ce qu'elle apporte |
| --- | --- | --- |
| `dev` | copie de `docker-compose.dev.yml` | Construit l'étape `dev` localement, bind-mount du code source, hot-reload, API sur `localhost` |
| `staging` | copie de `docker-compose.staging.yml` | Tire `:staging` depuis GHCR, rattachement au réseau externe `dokploy-network`, port dédié, limites mémoire et rotation des logs |
| `main` | copie de `docker-compose.prod.yml` | Tire `:main`, `dokploy-network`, durcissement : filesystem en lecture seule, `no-new-privileges`, politique de redémarrage |

Les trois variantes restent présentes dans le dépôt sous leur nom explicite
(`docker-compose.dev.yml`, `.staging.yml`, `.prod.yml`) : seule la copie active
en `docker-compose.override.yml` change d'une branche à l'autre, ce qui limite
les conflits de merge à ce seul fichier.

```bash
git checkout dev        # travail local, hot-reload
git checkout staging    # pré-production (Dokploy)
git checkout main       # production
```

## Image de conteneur (GHCR)

`.github/workflows/docker-publish.yml` construit et publie à chaque push sur une
branche de déploiement :

| Branche ou tag | Image |
| --- | --- |
| `dev` | `ghcr.io/shalom-302/frontendoissu:dev` |
| `staging` | `ghcr.io/shalom-302/frontendoissu:staging` |
| `main` | `ghcr.io/shalom-302/frontendoissu:main` et `:latest` |
| `v1.2.3` | `ghcr.io/shalom-302/frontendoissu:1.2.3`, `:1.2`, `:1` |

Chaque build porte aussi le SHA court du commit, de quoi épingler un
déploiement à un commit exact via `WEB_IMAGE`.

Le workflow s'authentifie avec le `GITHUB_TOKEN` du dépôt — aucun secret à
créer. **Le paquet est privé par défaut** : rendez-le public, ou ajoutez un
registre dans Dokploy avec un token `read:packages`.

Comme `API_INTERNAL_URL` est lue **à l'exécution** et non au build, la même
image se promeut de staging vers la production sans reconstruction.

## Déploiement sur Dokploy

Créez une application **Compose** pointant sur ce dépôt :

| Champ | Valeur |
| --- | --- |
| Dépôt | `Shalom-302/frontendoissu` |
| Branche | `staging` ou `main` |
| Chemin du compose | `docker-compose.yml` |

`docker-compose.override.yml` est à côté et se charge tout seul : la branche
suffit à décider de l'environnement. Dokploy tire l'image au lieu de la
construire, puisqu'aucun fichier compose de ces branches n'a de `build:`.

### Staging et Dokploy

La pré-production est déployée par Dokploy, qui possède déjà un réseau overlay
sur le VPS. L'override de `staging` rejoint donc `dokploy-network` **en réseau
externe** au lieu de créer un bridge privé — c'est ce qui permet au front et à
l'API de se joindre par leur nom de service :

```yaml
API_INTERNAL_URL=http://oissu_api:8000
```

`!override` sur la liste `networks` du service remplace l'entrée du fichier de
base au lieu de s'y ajouter, donc le conteneur n'est que sur `dokploy-network`.
L'API doit être attachée au même réseau pour être joignable par son nom.

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `API_INTERNAL_URL` | Adresse de l'API vue par le serveur Next.js. **La seule indispensable.** |
| `NEXT_PUBLIC_API_URL` | Repli documentaire ; le navigateur n'appelle pas l'API directement. |
| `WEB_PORT` | Port publié sur l'hôte (3000 en dev, 3001 en staging). |
| `NODE_ENV` | `development` ou `production`. |

Parce que tout passe par le serveur Next.js, `API_INTERNAL_URL` est lue **à
l'exécution** : la même image peut être promue de staging vers la production
sans être reconstruite.

## Scripts

```bash
npm run dev         # serveur de développement
npm run build       # build de production (bundle standalone)
npm run start       # sert le build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```
