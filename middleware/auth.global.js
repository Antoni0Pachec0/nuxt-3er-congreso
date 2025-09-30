import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  // 1) Token de sesión (localStorage)
  const token = localStorage.getItem('accessToken')

  // 2) Rutas protegidas (requieren login)
  if (to.meta?.requiresAuth && !token) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 3) Rutas solo invitados (login, register, forgot, verify, reset)
  if (to.meta?.guestOnly && token) {
    return navigateTo('/user-home')
  }

  // 4) Protección para /verify
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

  // 5) Protección para /reset
  if (to.name === 'reset' || to.path === '/reset') {
    const resetToken = sessionStorage.getItem('reset_token')
    const resetEmail = sessionStorage.getItem('reset_email')

    if (!resetToken || !resetEmail) {
      return navigateTo('/forgot')
    }

    // Verificar expiración
    const tokenExpiry = sessionStorage.getItem('reset_token_expiry')
    if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
      sessionStorage.removeItem('reset_token')
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_token_expiry')
      return navigateTo('/forgot')
    }
  }
})
