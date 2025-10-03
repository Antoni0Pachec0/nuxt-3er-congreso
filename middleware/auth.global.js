import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import api from '~/plugins/http/api'
import { ROUTES } from '~/plugins/http/routes'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  const isAuthenticated = async () => {
    try {
      await api.get(ROUTES.AUTH.ME, { withCredentials: true })
      return true
    } catch {
      return false
    }
  }

  // 1) Rutas protegidas
  if (to.meta?.requiresAuth) {
    const ok = await isAuthenticated()
    if (!ok) {
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
  }

  // 2) Bloqueo en user-home → no puede salir salvo excepciones
  if (from?.path === '/user-home' && !['/game', '/login', '/'].includes(to.path)) {
    return navigateTo('/user-home')
  }

  // 3) Solo invitados
  if (to.meta?.guestOnly) {
    const ok = await isAuthenticated()
    if (ok) {
      return navigateTo('/user-home')
    }
  }
})
