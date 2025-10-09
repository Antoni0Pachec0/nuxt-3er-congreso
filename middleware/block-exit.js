// middleware/block-exit.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const authStore = useAuthStore()

  // Permitir navegación a login durante logout o si no está autenticado
  if (authStore.isLoggingOut || !authStore.isAuthenticated) {
    return
  }

  // Permitir siempre navegación a login y rutas de auth
  const ALLOWED_PATHS = new Set([
    '/login',
    '/register', 
    '/verify',
    '/forgot',
    '/reset',
    '/auth/logout'
  ])

  if (ALLOWED_PATHS.has(to.path)) {
    return
  }

  // Bloquear salidas desde /user-home
  if (from?.path === '/user-home') {
    const allowedFromHome = new Set(['/game/game'])
    
    if (!allowedFromHome.has(to.path)) {
      console.log('Navegación bloqueada desde user-home. Usa los botones "Game" o "Cerrar Sesión".')
      return abortNavigation()
    }
    return
  }

  // Bloquear salidas desde /game/game
  if (from?.path === '/game/game') {
    const allowedFromGame = new Set(['/user-home'])
    if (!allowedFromGame.has(to.path)) {
      console.log('Navegación bloqueada desde game. Usa el botón para volver al home.')
      return abortNavigation()
    }
    return
  }
})