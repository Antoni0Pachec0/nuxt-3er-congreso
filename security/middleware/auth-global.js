// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Solo ejecutar en cliente
  if (process.server) return

  const authStore = useAuthStore()

  // 🔄 Cargar estado de autenticación desde localStorage
  if (!authStore.isAuthenticated) {
    authStore.loadFromStorage()
  }

  // Definir rutas públicas
  const PUBLIC_PATHS = new Set([
    '/', 
    '/login', 
    '/register', 
    '/verify', 
    '/forgot-password',
    '/reset-password',
    '/schedule',
    '/conferees', 
    '/workshops'
  ])

  // Determinar si la ruta actual es pública
  const isPublic = PUBLIC_PATHS.has(to.path) || to.meta?.guestOnly === true
  const requiresAuth = to.meta?.requiresAuth === true

  // Si no requiere autenticación y es pública, permitir acceso
  if (!requiresAuth && isPublic) {
    return
  }

  // Verificar autenticación con el backend si es necesario
  let isAuthenticated = authStore.isAuthenticated
  
  if (!isAuthenticated && requiresAuth) {
    try {
      const config = useRuntimeConfig()
      const { AuthApi } = await import('@/backend/auth/login-api')
      
      const userData = await AuthApi.getMe()
      if (userData?.user_id) {
        authStore.setUser({
          id: userData.user_id,
          email: userData.email,
          name: userData.name_user,
          roleId: userData.type_user_id,
          roleName: userData.type_user?.name_type
        })
        isAuthenticated = true
      }
    } catch (error) {
      console.warn('Auth verification failed:', error)
      authStore.clearUser()
      isAuthenticated = false
    }
  }

  // 🔒 Redirigir si requiere autenticación y no está autenticado
  if (requiresAuth && !isAuthenticated) {
    return navigateTo('/login')
  }

  // 🚫 Redirigir si está autenticado e intenta acceder a páginas de invitado
  if (isAuthenticated && to.meta?.guestOnly) {
    // Redirigir según el rol del usuario
    const userRole = authStore.userRole
    
    if (userRole === 5) {
      return navigateTo('/admin/users') // Admin
    } else {
      return navigateTo('/workshops') // Usuario normal va a workshops
    }
  }

  // ✅ Permitir acceso a rutas específicas para usuarios autenticados
  if (isAuthenticated) {
    const ALLOWED_AUTH_ROUTES = new Set([
      '/workshops', // ✅ Ahora workshops está permitido para usuarios autenticados
      '/game',
      '/game/leaderboard',
      '/admin/users', // Si tienes admin
      '/profile' // Si tienes perfil
    ])
    
    // Si la ruta no está en las permitidas y no es pública, redirigir
    if (!ALLOWED_AUTH_ROUTES.has(to.path) && !isPublic) {
      console.warn(`Redirecting: ${to.path} not allowed for authenticated users`)
      
      if (authStore.userRole === 5) {
        return navigateTo('/admin/users')
      } else {
        return navigateTo('/workshops') // ✅ Usuarios normales van a workshops
      }
    }
  }
})