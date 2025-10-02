// middleware/auth.global.ts (o el archivo que ya tienes)
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import api from '~/plugins/http/api'
import { ROUTES } from '~/plugins/http/routes'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  // helper para saber si hay sesión usando cookies httpOnly
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

  // 2) Rutas solo invitados
  if (to.meta?.guestOnly) {
    const ok = await isAuthenticated()
    if (ok) {
      return navigateTo('/user-home')
    }
  }

  // 3) Protección para /verify
  if (to.name === 'verify' || to.path === '/verify') {
    const emailToVerify =
      sessionStorage.getItem('verify_email') ||
      localStorage.getItem('verify_email')

    if (!emailToVerify) {
      const purpose = localStorage.getItem('verification_purpose')
      return navigateTo(
        purpose === 'reset_password' ? '/forgot' : '/register'
      )
    }
  }

  // 4) Protección para /reset
  if (to.name === 'reset' || to.path === '/reset') {
    const resetToken = sessionStorage.getItem('reset_token')
    const resetEmail = sessionStorage.getItem('reset_email')

    if (!resetToken || !resetEmail) {
      return navigateTo('/forgot')
    }

    const tokenExpiry = sessionStorage.getItem('reset_token_expiry')
    if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
      sessionStorage.removeItem('reset_token')
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_token_expiry')
      return navigateTo('/forgot')
    }
  }
})
