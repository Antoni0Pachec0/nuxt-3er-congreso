// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  // Cargar estado inicial desde localStorage
  if (!authStore.isAuthenticated) {
    authStore.loadFromStorage()
  }

  // Rutas públicas (sin sesión requerida)
  const PUBLIC_PATHS = new Set([
    '/', '/login', '/register', '/verify', '/forgot', '/reset'
  ])
  const isPublic = PUBLIC_PATHS.has(to.path) || to.meta?.guestOnly === true

  // Si está en proceso de logout, permitir navegación a login
  if (authStore.isLoggingOut && to.path === '/login') {
    return
  }

  // Si ya está autenticado en el store, permitir
  let isAuth = authStore.isAuthenticated

  // Si no está autenticado pero va a una ruta privada, verificar con backend
  if (!isAuth && !isPublic) {
    try {
      const me = await $fetch(`${config.public.apiBase}/auth/me`, { 
        credentials: 'include',
        retry: 0,
        timeout: 5000
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
    } catch (error) {
      console.log('Auth check failed, redirecting to login')
      authStore.setAuthenticated(false)
      authStore.setUser(null)
    }
  }

  // Redirigir a login si no está autenticado y va a ruta privada
  if (!isPublic && !isAuth) {
    return navigateTo({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    })
  }

  // Redirigir a home si ya está autenticado y va a login/register
  if ((to.path === '/login' || to.meta?.guestOnly === true) && authStore.isAuthenticated && !authStore.isLoggingOut) {
    return navigateTo('/user-home')
  }
})