// middleware/block-exit.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const authStore = useAuthStore()

  // Si estamos en pleno logout, permitir cualquier navegación (para ir a /login)
  if (authStore.isLoggingOut) return

  // Si no está autenticado, no bloqueamos (el otro middleware de auth se encarga de redirigir al login)
  if (!authStore.isAuthenticated) return

  // --- 1) Bloquear salidas desde /user-home ---
  if (from?.path === '/user-home') {
    // ÚNICA ruta permitida desde home:
    const allowedFromHome = new Set(['/game/game'])

    if (!allowedFromHome.has(to.path)) {
      // Opcional: aviso
      // alert('Para salir, usa el botón "Game" o "Cerrar Sesión".')
      return abortNavigation() // se queda en /user-home
    }
    return // permitido: /game/game
  }

  // --- 2) (Opcional) Bloquear salidas desde /game/game ---
  // Si también quieres que desde el juego NO se pueda ir a otras vistas
  // excepto volver al home (o logout), activa este bloque:
  if (from?.path === '/game/game') {
    const allowedFromGame = new Set(['/user-home'])
    if (!allowedFromGame.has(to.path)) {
      return abortNavigation() // se queda en /game/game
    }
    return
  }
})
