import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  // 1) Token (cookie o localStorage)
  const accessTokenCookie = useCookie('access_token')
  const localStorageToken = localStorage.getItem('accessToken')
  const token = accessTokenCookie.value || localStorageToken

  // 2) Rutas protegidas
  if (to.meta?.requiresAuth && !token) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 3) Rutas solo invitados
  if (to.meta?.guestOnly && token) {
    return navigateTo('/')
  }

  // 4) Protección /verify
  if (to.name === 'verify' || to.path === '/verify') {
    const emailToVerify = sessionStorage.getItem('verify_email') || localStorage.getItem('verify_email')
    if (!emailToVerify) {
      const verificationPurpose = localStorage.getItem('verification_purpose')
      return navigateTo(verificationPurpose === 'reset_password' ? '/forgot' : '/register')
    }
  }

  // 5) Protección /reset - MÁS SEGURO
  if (to.name === 'reset' || to.path === '/reset') {
    // Verificar si hay un token temporal válido para reset
    const resetToken = sessionStorage.getItem('reset_token')
    const resetEmail = sessionStorage.getItem('reset_email')
    
    if (!resetToken || !resetEmail) {
      return navigateTo('/forgot')
    }
    
    // Opcional: verificar expiración del token
    const tokenExpiry = sessionStorage.getItem('reset_token_expiry')
    if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
      sessionStorage.removeItem('reset_token')
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_token_expiry')
      return navigateTo('/forgot')
    }
  }
})