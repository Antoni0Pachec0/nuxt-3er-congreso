// security/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoggingOut: false
  }),

  getters: {
    userId: (state) => state.user?.id,
    userRole: (state) => state.user?.roleId,
    userRoleName: (state) => state.user?.roleName
  },

  actions: {
    setUser(userData) { 
      this.user = userData
      this.isAuthenticated = !!userData
      
      // Persistir en localStorage
      try {
        localStorage.setItem('auth_store', JSON.stringify({
          user: userData,
          isAuthenticated: !!userData
        }))
      } catch (error) {
        console.error('Error saving auth to storage:', error)
      }
    },
    
    clearUser() {
      this.user = null
      this.isAuthenticated = false
      this.isLoggingOut = false
      
      try {
        localStorage.removeItem('auth_store')
      } catch (error) {
        console.error('Error removing auth from storage:', error)
      }
    },
    
    loadFromStorage() {
      try { 
        const raw = localStorage.getItem('auth_store')
        if (raw) {
          const parsed = JSON.parse(raw)
          this.user = parsed?.user ?? null
          this.isAuthenticated = !!parsed?.isAuthenticated
        }
      } catch (error) {
        console.error('Error loading auth from storage:', error)
        this.clearUser()
      }
    },

    async logout() {
      if (this.isLoggingOut) return
      
      this.isLoggingOut = true
      
      try {
        // Importar dinámicamente para evitar ciclos de dependencia
        const { AuthApi } = await import('@/backend/auth/login-api')
        await AuthApi.logout()
      } catch (error) {
        console.error('Error during logout API call:', error)
        // Continuamos con la limpieza local aunque falle el API
      }
      
      // Limpiar estado local SIEMPRE
      this.clearUser()
      
      // Limpiar todas las cookies relacionadas con auth
      this.clearAuthCookies()
      
      // Limpiar headers de API
      this.clearApiAuth()
    },

    clearAuthCookies() {
      if (typeof document === 'undefined') return
      
      const cookies = [
        'access_token',
        'refresh_token', 
        'verify'
      ]
      
      const domain = window.location.hostname
      const isLocalhost = domain === 'localhost'
      const baseDomain = isLocalhost ? '' : `.${domain.split('.').slice(-2).join('.')}`
      
      cookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${baseDomain ? `; Domain=${baseDomain}` : ''}`
        // Intentar también sin domain para coverage completo
        document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
      })
    },

    async clearApiAuth() {
      try {
        const { default: api } = await import('@/backend/http/api')
        delete api.defaults.headers.Authorization
      } catch (error) {
        console.warn('Error clearing API authorization:', error)
      }
    }
  }
})