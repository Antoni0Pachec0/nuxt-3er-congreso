// middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  
  const authStore = useAuthStore()
  
  // Verificar autenticación
  const checkAuth = async () => {
    try {
      const response = await $fetch('/api/auth/me', {
        credentials: 'include',
        retry: 0,
        timeout: 5000
      })
      
      if (response?.user_id) {
        authStore.setUser({ id: response.user_id, email: response.email })
        authStore.setAuthenticated(true)
        return true
      }
    } catch (error) {
      console.log('Auth check failed:', error)
      authStore.setAuthenticated(false)
      authStore.setUser(null)
    }
    return false
  }

  const isAuthenticated = await checkAuth()
  console.log(`Auth middleware: ${to.path} - Authenticated: ${isAuthenticated}`)

  // Rutas que requieren autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login, requires auth')
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // Rutas solo para invitados (como login)
  if (to.meta.guestOnly && isAuthenticated) {
    console.log('Redirecting to user-home, already authenticated')
    return navigateTo('/user-home')
  }
})