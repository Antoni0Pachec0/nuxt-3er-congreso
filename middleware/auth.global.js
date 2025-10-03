// middleware/auth.global.ts (o el archivo que ya tienes)
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import api from '~/plugins/http/api'
import { ROUTES } from '~/plugins/http/routes'

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
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

  // 🚨 Nuevo: Si ya está en user-home, no puede irse a otras rutas arbitrarias
  const lockedRoutes = ['/user-home']
  const allowedExits = ['/game', '/auth/logout']

  if (lockedRoutes.includes(to.path)) {
    // ok, permanece en home
  } else {
    const from = useRoute()
    if (from.path === '/user-home' && !allowedExits.includes(to.path)) {
      return navigateTo('/user-home')
    }
  }

  // 2) Invitados
  if (to.meta?.guestOnly) {
    const ok = await isAuthenticated()
    if (ok) {
      return navigateTo('/user-home')
    }
  }
})
