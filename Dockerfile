# ===================================
# Fase 1: Entorno de Construcción (Build)
# ===================================
# Usamos una versión específica de Node.js 20 sobre Alpine Linux para una imagen ligera.
FROM node:20-alpine AS build

# Establecemos el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copiamos package.json y package-lock.json para cachear las dependencias.
COPY package.json package-lock.json ./

# Instalamos las dependencias de forma limpia y reproducible usando 'npm ci'.
# Esto es más rápido y seguro para builds que 'npm install'.
RUN npm ci

# Copiamos el resto del código fuente del proyecto.
COPY . .

# Ejecutamos el script de build para generar la versión de producción.
RUN npm run build

# ===================================
# Fase 2: Entorno de Producción
# ===================================
# Partimos de la misma imagen base para mantener la consistencia y el tamaño reducido.
FROM node:20-alpine AS production

# Establecemos el directorio de trabajo.
WORKDIR /app

# Por seguridad, creamos un usuario sin privilegios para ejecutar la aplicación.
RUN addgroup --system --gid 1001 nuxtgroup
RUN adduser --system --uid 1001 nuxtuser

# Copiamos únicamente los artefactos de la build desde la fase anterior.
# Nuxt 4 coloca la salida de producción en la carpeta '.output'.
COPY --from=build /app/.output .

# Damos permisos de los archivos al usuario no-root.
RUN chown -R nuxtuser:nuxtgroup /app

# Cambiamos al usuario no-root.
USER nuxtuser

# Exponemos el puerto 3000, que es el puerto por defecto de Nuxt.
EXPOSE 3000

# Configuramos el host para que el servidor escuche en todas las interfaces de red dentro del contenedor.
ENV HOST=0.0.0.0
ENV PORT=3000

# El comando final para iniciar el servidor de Nuxt en modo producción.
CMD ["node", "server/index.mjs"]