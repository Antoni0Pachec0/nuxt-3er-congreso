// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // 🔥 Asegurar sincronización
  if (!authStore.isAuthenticated) {
    authStore.loadFromStorage()
  }

  const PUBLIC_PATHS = new Set([
    '/', '/login', '/register', '/verify', '/forgot', '/reset'
  ])
  const isPublic = PUBLIC_PATHS.has(to.path) || to.meta?.guestOnly === true
  const requiresAuth = to.meta?.requiresAuth === true

  // Verificar sesión
  let isAuth = authStore.isAuthenticated
  if (!isAuth && requiresAuth) {
    try {
      const me = await $fetch(`${config.public.apiBase}/auth/me`, {
        credentials: 'include'
      })
      if (me?.user_id) {
        authStore.setUser({
          id: me.user_id,
          email: me.email,
          name: me.name_user
        })
        authStore.setAuthenticated(true)
        isAuth = true
      }
    } catch {
      authStore.setAuthenticated(false)
      authStore.setUser(null)
    }
  }

  // 🔒 Si requiere login y no está autenticado
  if (requiresAuth && !isAuth) {
    return navigateTo('/login')
  }

  // 🚫 Si está logueado e intenta ir a página pública
  if (authStore.isAuthenticated && isPublic) {
    return navigateTo('/user-home')
  }

  // 🚷 Bloquear navegación fuera de rutas permitidas
  if (authStore.isAuthenticated) {
    const ALLOWED_AUTH_ROUTES = new Set([
      '/user-home',
      '/game/game',
      '/game/leaderboard'
    ])
    if (!ALLOWED_AUTH_ROUTES.has(to.path)) {
      console.warn(`Bloqueo: ${to.path} no permitido con sesión activa`)
      return false // 🚫 detiene navegación
    }
  }
})
