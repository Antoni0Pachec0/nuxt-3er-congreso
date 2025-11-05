/**import { useAuthStore } from "~/security/stores/auth"

// composables/useAuth.js
export const useAuth = () => {
  const authStore = useAuthStore()
  
  // Inicializar desde localStorage
  if (process.client) {
    authStore.loadFromStorage()
  }

  const setToken = (token: string) => {
    // Solo guardar en localStorage, tu store no maneja tokens
    if (process.client) {
      localStorage.setItem('access_token', token)
    }
  }

  const getToken = () => {
    // Obtener token desde localStorage
    if (process.client) {
      return localStorage.getItem('access_token')
    }
    return null
  }

  const isAuthenticated = () => {
    // Verificar tanto el store como el token
    const hasStoreAuth = authStore.isAuthenticated && !!authStore.user
    const hasToken = !!getToken()
    return hasStoreAuth && hasToken
  }

  const logout = () => {
    authStore.logout()
  }

  return {
    user: computed(() => authStore.user),
    token: computed(() => getToken()),
    setToken,
    getToken,
    isAuthenticated,
    logout
  }
}**/