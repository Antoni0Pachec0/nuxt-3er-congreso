// /middleware/auth.global.js
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  // Solo corre en cliente
  if (import.meta.server) return

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

  // 4) Protección /verify (requiere contexto en sessionStorage)
  if (to.name === 'verify' || to.path === '/verify') {
    const emailToVerify =
      sessionStorage.getItem('verify_email') ||
      localStorage.getItem('verify_email') // fallback por si quedó de sesiones viejas

    if (!emailToVerify) {
      return navigateTo('/register')
    }
  }
})
