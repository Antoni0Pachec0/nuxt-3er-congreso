// middleware/auth.global.js
import { useAuthStore } from '@/security/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const auth = useAuthStore()

  // 1) Hidratar del storage (para que el header cambie al instante)
  if (!auth.isAuthenticated) auth.loadFromStorage()

  const PUBLIC_PATHS = new Set([
    '/', '/login', '/register', '/verify', '/forgot-password', '/reset-password',
    '/schedule', '/conferees', '/workshops'
  ])

  const isPublic = PUBLIC_PATHS.has(to.path) || to.meta?.guestOnly === true
  const requiresAuth = to.meta?.requiresAuth === true

  // 2) Si la ruta requiere auth y no hay sesión en memoria → intenta con cookies (GET /auth/me)
  let isAuth = auth.isAuthenticated
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
        isAuth = true
      }else{
        isAuth = false
      }
    } catch (e) {
      auth.clearUser()
      isAuth = false
    }
  }

  // 3) Si requiere auth y no hay sesión → login
  if (requiresAuth && !isAuth){
    auth.clearUser()
    return navigateTo('/login')
  }

  // 4) Si hay sesión e intenta entrar a páginas de invitado → redirigir por rol
  if (isAuth && to.meta?.guestOnly) {
    return auth.userRole === 5 ? navigateTo('/admin/users') : navigateTo('/workshops')
  }

  // 5) Bloquear admin si no es roleId 5
  if (isAuth && to.path.startsWith('/admin') && auth.userRole !== 5) {
    return navigateTo('/workshops')
  }

  // 6) (Opcional) Si es auth y va a rutas no permitidas, reubicar
  if (isAuth && !isPublic) {
    const ALLOWED = new Set(['/workshops','/game','/game/leaderboard','/admin/users','/profile'])
    if (!ALLOWED.has(to.path)) {
      return auth.userRole === 5 ? navigateTo('/admin/users') : navigateTo('/workshops')
    }
  }
})
