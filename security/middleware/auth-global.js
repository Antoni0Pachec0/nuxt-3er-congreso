// security/middleware/auth.global.js
import { useAuthStore } from '@/security/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const auth = useAuthStore()
  
  // Definir rutas públicas
  const PUBLIC_PATHS = new Set([
    '/', '/login', '/register', '/verify', '/forgot-password', '/reset-password',
    '/schedule', '/conferees', '/workshops', '/game', '/game/leaderboard'
  ])

  const isPublic = PUBLIC_PATHS.has(to.path) || to.meta?.guestOnly === true
  const requiresAuth = to.meta?.requiresAuth === true

  // 1) Hidratar del storage
  if (!auth.isAuthenticated) {
    auth.loadFromStorage()
  }

  let isAuth = auth.isAuthenticated

  // 2) Si no está autenticado pero requiere auth, intentar verificar con backend
  if (!isAuth && requiresAuth) {
    try {
      const { AuthApi } = await import('@/backend/auth/login-api')
      const me = await AuthApi.getMe()
      if (me?.user_id) {
        auth.setUser({
          id: Number(me.user_id),
          email: me.email || '',
          name: me.name_user || '',
          roleId: me.type_user_id ?? null,
          roleName: me?.type_user?.name_type ?? null
        })
        auth.setAccessToken(localStorage.getItem('access_token') || '')
        isAuth = true
      }
    } catch (e) {
      console.warn('Auth check failed:', e)
      auth.clearUser()
      isAuth = false
    }
  }

  // 3) Si requiere auth y no está autenticado → redirigir a login
  if (requiresAuth && !isAuth) {
    return navigateTo('/login')
  }

  // 4) Si está autenticado e intenta acceder a páginas de invitado → redirigir según rol
  if (isAuth && (isPublic || to.meta?.guestOnly)) {
    if (auth.userRole === 5) {
      return navigateTo('/admin/users')
    } else {
      return navigateTo('/workshops')
    }
  }

  // 5) Bloquear admin si no es roleId 5
  if (isAuth && to.path.startsWith('/admin') && auth.userRole !== 5) {
    return navigateTo('/workshops')
  }

  // 6) Rutas específicas por rol
  if (isAuth) {
    const userRoutes = ['/workshops', '/game', '/game/leaderboard', '/profile']
    const adminRoutes = ['/admin/users', '/admin/dashboard']
    
    const allowedRoutes = auth.userRole === 5 
      ? [...userRoutes, ...adminRoutes]
      : userRoutes

    if (!allowedRoutes.includes(to.path) && to.path !== '/') {
      return auth.userRole === 5 ? navigateTo('/admin/users') : navigateTo('/workshops')
    }
  }
})