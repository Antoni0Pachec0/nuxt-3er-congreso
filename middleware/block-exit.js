// middleware/block-exit.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return
  
  const authStore = useAuthStore()
  
  // Si estamos en user-home y tratamos de navegar fuera (excepto rutas permitidas)
  if (from.path === '/user-home' && authStore.isAuthenticated) {
    const allowedRoutes = ['/game', '/login', '/']
    const isLogoutIntent = to.query.logout === 'true'
    
    // Permitir solo si es logout o rutas permitidas
    if (!allowedRoutes.includes(to.path) && !isLogoutIntent && !authStore.isLoggingOut) {
      // Mostrar confirmación
      const confirmExit = window.confirm(
        'Para salir, por favor usa el botón "Cerrar Sesión". ¿Deseas continuar?'
      )
      
      if (!confirmExit) {
        return abortNavigation()
      }
    }
  }
})