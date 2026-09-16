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

Trois branches, **le même code source**, un `docker-compose.yml` complet par
branche. Ce que vous lisez dans ce fichier sur une branche est exactement ce qui
y tourne.

| Branche | Ce que décrit `docker-compose.yml` |
| --- | --- |
| `dev` | Construit l'étape `dev` localement, bind-mount du code source, hot-reload, API sur `localhost` |
| `staging` | Tire `:staging` depuis GHCR, rejoint le réseau externe `dokploy-network`, port 3001, limites mémoire et rotation des logs |
| `main` | Tire `:main`, `dokploy-network`, filesystem en lecture seule, `no-new-privileges`, politique de redémarrage |

> **Il n'y a volontairement pas de `docker-compose.override.yml`.** Docker
> Compose ne charge un override automatiquement que lorsqu'il découvre les
> fichiers lui-même ; un outil de déploiement passe un `-f <chemin>` explicite,
> et l'overlay est alors **silencieusement ignoré**. Vérifié : sur la branche
> `staging`, `docker compose config` donnait `:staging` sur `dokploy-network`,
> tandis que `docker compose -f docker-compose.yml config` dans le même dépôt
> donnait `:main` sur un bridge privé — une stack qui démarre, se déclare saine,
> et qui est fausse. Un fichier autosuffisant par branche supprime le piège.

Le coût : les modifications communes entrent en conflit au merge
`dev` → `staging` → `main`. C'est le compromis assumé — un conflit que vous
résolvez vaut mieux qu'un déploiement qui ignore la moitié de sa configuration.

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

Créez une application **Compose** :

| Champ | Valeur |
| --- | --- |
| Dépôt | `Shalom-302/frontendoissu` |
| Branche | `staging` ou `main` |
| Chemin du compose | `docker-compose.yml` |

Le même chemin sur toutes les branches — la branche seule décide de
l'environnement, puisque c'est le fichier lui-même qui diffère.

Le conteneur rejoint `dokploy-network`, partagé avec la stack de l'API : c'est
ce qui permet à `API_INTERNAL_URL` de désigner l'API par son nom de conteneur.

```
API_INTERNAL_URL=http://oissu_api:8000
```

`API_INTERNAL_URL` est **obligatoire** sur les branches déployées : le compose
refuse de démarrer sans elle, pour qu'un déploiement ne retombe jamais
silencieusement sur une API locale.

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
