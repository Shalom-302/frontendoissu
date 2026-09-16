# syntax=docker/dockerfile:1
# ============================================================================
# OISSU CONNECT — frontend image
#
# Four stages: `deps` resolves node_modules once, `dev` is the hot-reload target
# used by docker-compose.override.yml, `builder` produces the standalone bundle
# and `runner` is the lean production image.
# ============================================================================

# ---------------------------------------------------------------------------
# Stage 1 — deps: install dependencies (cached until the lockfile changes)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps

WORKDIR /app

# Only the manifests, so this layer is reused on every source-only change.
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# Stage 2 — dev: hot reload against the bind-mounted source
#
# NOTE — how this differs from the backend image. There, the virtualenv lives at
# /opt/venv so a `.:/app` bind mount cannot shadow it. Node resolves
# node_modules by walking up from the importing file, so the same trick does not
# apply: the dev compose file instead mounts a named volume over
# /app/node_modules, which keeps the image's dependencies visible underneath the
# bind-mounted source. Same goal, different mechanism.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS dev

WORKDIR /app

ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1 \
    # Docker Desktop on Windows/macOS does not forward inotify events into the
    # container, so the dev server polls instead of missing every edit.
    WATCHPACK_POLLING=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ---------------------------------------------------------------------------
# Stage 3 — builder: compile the standalone server
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 4 — runner: production runtime
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as a non-root user (least privilege: limits the blast radius of an RCE).
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# `output: 'standalone'` traces exactly the files the server needs, so the
# runtime image never ships the full node_modules tree.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
