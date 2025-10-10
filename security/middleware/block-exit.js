// middleware/block-exit.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const authStore = useAuthStore()

  // Si no está autenticado, no se aplica el bloqueo
  if (!authStore.isAuthenticated || authStore.isLoggingOut) return

  // 🔐 Solo se permiten estas rutas mientras esté logueado
  const ALLOWED_AUTH_ROUTES = new Set([
    '/user-home',
    '/game/game',
    '/leaderboard'
  ])

  // Si la ruta destino NO está permitida → cancelar
  if (!ALLOWED_AUTH_ROUTES.has(to.path)) {
    return abortNavigation()
  }
})
