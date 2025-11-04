export default defineNuxtRouteMiddleware((to) => {
  // Proteger rutas /admin*
  if (to.path.startsWith('/admin')) {
    if (process.client) {
      try {
        const raw = localStorage.getItem('auth_store') || '{}'
        const auth = JSON.parse(raw)
        const roleId = Number(auth?.user?.roleId || 0)
        if (roleId !== 5) {
          return navigateTo('/user-home')
        }
      } catch (_) {
        return navigateTo('/user-home')
      }
    }
  }
})
