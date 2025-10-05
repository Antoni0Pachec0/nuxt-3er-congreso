// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) authStore.loadFromStorage()

  // rutas públicas (sin sesión)
  const PUBLIC_PATHS = new Set([
    '/', '/login', '/register', '/verify', '/forgot', '/reset'
  ])
  const isPublic = PUBLIC_PATHS.has(to.path) || to.meta?.guestOnly === true

  // si ya está autenticado, permite; si no, intenta verificar con /auth/me
  let isAuth = authStore.isAuthenticated
  if (!isAuth && !isPublic) {
    try {
      const me = await $fetch(`${config.public.apiBase}/auth/me`, { credentials: 'include' })
      if (me?.user_id) {
        authStore.setUser({ id: me.user_id, email: me.email })
        authStore.setAuthenticated(true)
        isAuth = true
      }
    } catch {
      authStore.setAuthenticated(false)
      authStore.setUser(null)
    }
  }

  if (!isPublic && !isAuth) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // si intenta ir a login y ya está logueado, mándalo al home privado
  if ((to.path === '/login' || to.meta?.guestOnly === true) && authStore.isAuthenticated) {
    return navigateTo('/user-home')
  }
})
