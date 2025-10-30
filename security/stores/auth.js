// security/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoggingOut: false,
    accessToken: null, // 👈 Añadir esta línea
    refreshToken: null // 👈 Añadir esta línea
  }),

  actions: {
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user
    },

    setAuthenticated(status) {
      this.isAuthenticated = status;
      if (!status) {
        this.user = null
        this.accessToken = null
        this.refreshToken = null
      }
    },

    // 👇 NUEVA ACCIÓN: Guardar tokens
    setTokens(accessToken, refreshToken = null) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken

      // Guardar en localStorage para persistencia
      if (process.client) {
        if (accessToken) {
          localStorage.setItem('access_token', accessToken)
        }
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken)
        }
      }
    },

    // 👇 NUEVA ACCIÓN: Obtener token
    getToken() {
      return this.accessToken || (process.client ? localStorage.getItem('access_token') : null)
    },

    // 👇 NUEVA ACCIÓN: Verificar autenticación con token
    isUserAuthenticated() {
      const hasToken = !!this.getToken()
      const hasUser = !!this.user
      return this.isAuthenticated && hasToken && hasUser
    },

    loadFromStorage() {
      try {
        const raw = localStorage.getItem('auth_store');
        if (raw) {
          const p = JSON.parse(raw);
          this.user = p?.user ?? null;
          this.isAuthenticated = !!p?.isAuthenticated
        }

        if (process.client) {
          const storedToken = localStorage.getItem('access_token')
          const storedRefreshToken = localStorage.getItem('refresh_token')

          if (storedToken) {
            this.accessToken = storedToken
          }
          if (storedRefreshToken) {
            this.refreshToken = storedRefreshToken
          }
        }

      } catch (error) {
        console.error('Error loading auth from storage:', error)
      }
    },

    async logout() {
      if (this.isLoggingOut) return

      this.isLoggingOut = true

      try {
        const config = useRuntimeConfig()

        // Hacer la petición de logout al backend
        await $fetch(`${config.public.apiBase}/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        })

      } catch (error) {
        console.error('Error during logout API call:', error)
        // No lanzamos el error para permitir limpieza local
      } finally {
        // Limpiar estado local SIEMPRE
        this.user = null
        this.isAuthenticated = false
        this.accessToken = null
        this.refreshToken = null

        // Limpiar localStorage
        localStorage.removeItem('auth_store')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        // Limpiar cookies en el cliente
        const expire = 'Thu, 01 Jan 1970 00:00:00 GMT'
        const domain = window.location.hostname
        const isLocalhost = domain === 'localhost'

        document.cookie = `access_token=; Path=/; SameSite=Lax; Expires=${expire}${!isLocalhost ? `; Domain=.${domain}` : ''}`
        document.cookie = `refresh_token=; Path=/; SameSite=Lax; Expires=${expire}${!isLocalhost ? `; Domain=.${domain}` : ''}`
        document.cookie = `verify=; Path=/; SameSite=Lax; Expires=${expire}${!isLocalhost ? `; Domain=.${domain}` : ''}`

        // IMPORTANTE: Resetear el estado de logout después de limpiar todo
        this.isLoggingOut = false
      }
    }
  },

  persist: true
})