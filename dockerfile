# ---------- 1) Build ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Instala utilidades mínimas (opcional, pero útil si algún postinstall las requiere)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copia los manifests primero para aprovechar la cache
COPY package*.json ./

# Asegura optional deps + scripts (necesario para bindings nativos como oxc-parser)
ENV NODE_ENV=production \
    NPM_CONFIG_IGNORE_SCRIPTS=false \
    NPM_CONFIG_INCLUDE=optional

# Instala dependencias a partir de lockfile
RUN npm ci --include=optional

# Copia el resto del proyecto
COPY . .

# (Opcional) fuerza rebuild del binding si el binario precompilado no se descargó
# No falla el build si no es necesario
RUN npm rebuild oxc-parser --build-from-source || true

# Compila la app (Nuxt/Nitro genera .output)
RUN npm run build

# ---------- 2) Runtime ----------
FROM node:22-bookworm-slim AS runner

WORKDIR /app

# Para tener certificados actualizados en runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copiamos solo lo necesario para ejecutar
COPY --from=builder /app/.output ./.output
# Si necesitas assets estáticos en /public durante runtime:
COPY --from=builder /app/public ./public

# Usuario no root por seguridad
RUN useradd -ms /bin/bash nodeuser
USER nodeuser

# Variables típicas de Nitro/Nuxt
ENV NODE_ENV=production \
    NITRO_PORT=3000 \
    PORT=3000 \
    NITRO_PRESET=node-server

EXPOSE 3000

# Healthcheck simple (puedes cambiar /health si lo implementas)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT).then(r=>{if(r.ok)process.exit(0);process.exit(1)}).catch(()=>process.exit(1))"

# Nitro node-server entry
CMD ["node", ".output/server/index.mjs"]
