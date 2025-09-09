# ---------- 1) Build ----------
FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git python3 build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
ENV NODE_ENV=production \
    NPM_CONFIG_IGNORE_SCRIPTS=false \
    NPM_CONFIG_INCLUDE=optional
RUN npm ci --include=optional

COPY . .
# Fallback por si algún binario nativo no llegó precompilado
RUN npm rebuild oxc-parser --build-from-source || true

RUN npm run build

# ---------- 2) Runtime ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app

# Copiamos SOLO lo necesario para ejecutar y con owner correcto
COPY --chown=node:node --from=builder /app/.output ./.output
COPY --chown=node:node --from=builder /app/public  ./public

# (No copies package.json ni package-lock.json al runtime si no vas a usar npm)
# COPY --chown=node:node --from=builder /app/package.json ./package.json

USER node

ENV NODE_ENV=production \
    PORT=3000 \
    NITRO_PORT=3000 \
    NITRO_HOST=0.0.0.0 \
    NITRO_TRUST_PROXY=1

EXPOSE 3000

# (Opcional) Healthcheck contra un endpoint de salud si lo añades
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
#   CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||'3000')+'/api/__health').then(r=>{if(r.ok)process.exit(0);process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
