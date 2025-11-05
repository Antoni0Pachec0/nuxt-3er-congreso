// security/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoggingOut: false,
    accessToken: null,
    refreshToken: null
  }),

  getters: {
    userId: (s) => s.user?.id,
    userRole: (s) => s.user?.roleId,
    userRoleName: (s) => s.user?.roleName,
    userName: (s) => s.user?.name
  },

  actions: {
    setUser(userData) {
      this.user = userData
      this.isAuthenticated = !!userData
      this.persist()
    },

    setAccessToken(token) {
      this.accessToken = token || ''
      // Guardar también en localStorage para compatibilidad
      if (token) {
        localStorage.setItem('access_token', token)
      }
      this.persist()
      this.applyApiAuthHeader()
    },

    persist() {
      try {
        localStorage.setItem('auth_store', JSON.stringify({
          user: this.user,
          isAuthenticated: this.isAuthenticated,
          accessToken: this.accessToken || ''
        }))
      } catch (e) { 
        console.error('Error saving auth to storage:', e) 
      }
    },

    clearUser() {
      this.user = null
      this.isAuthenticated = false
      this.isLoggingOut = false
      this.accessToken = ''
      this.refreshToken = ''
      
      try {
        // Limpiar todo el almacenamiento relacionado con auth
        localStorage.removeItem('auth_store')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('verification_purpose')
        sessionStorage.removeItem('verify_email')
        sessionStorage.removeItem('reset_token')
        sessionStorage.removeItem('reset_email')
      } catch (e) { 
        console.error('Error removing auth from storage:', e) 
      }
    },

    loadFromStorage() {
      try {
        const raw = localStorage.getItem('auth_store')
        if (raw) {
          const parsed = JSON.parse(raw)
          this.user = parsed?.user ?? null
          this.isAuthenticated = !!parsed?.isAuthenticated
          this.accessToken = parsed?.accessToken || localStorage.getItem('access_token') || ''
          
          if (this.accessToken) {
            this.applyApiAuthHeader()
          }
        }
      } catch (e) {
        console.error('Error loading auth from storage:', e)
        this.clearUser()
      }
    },

    async logout() {
      if (this.isLoggingOut) return
      this.isLoggingOut = true
      
      try {
        const { AuthApi } = await import('@/backend/auth/login-api')
        await AuthApi.logout()
      } catch (e) {
        console.error('Error during logout API call:', e)
      }
      
      this.clearUser()
      this.clearAuthCookies()
      await this.clearApiAuth()
      this.isLoggingOut = false
    },

    clearAuthCookies() {
      if (typeof document === 'undefined') return
      
      const cookies = ['access_token', 'refresh_token', 'verify']
      const domain = window.location.hostname
      const isLocalhost = domain === 'localhost'
      const baseDomain = isLocalhost ? '' : `.congresoti.com.mx`
      
      cookies.forEach((name) => {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${baseDomain ? `; Domain=${baseDomain}` : ''}`
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
      })
    },

    async applyApiAuthHeader() {
      try {
        const { default: api } = await import('@/backend/http/api')
        if (this.accessToken) {
          api.defaults.headers.Authorization = `Bearer ${this.accessToken}`
          // También configurar withCredentials para cookies
          api.defaults.withCredentials = true
        }
      } catch (e) {
        console.warn('Error applying API authorization:', e)
      }
    },

    async clearApiAuth() {
      try {
        const { default: api } = await import('@/backend/http/api')
        delete api.defaults.headers.Authorization
        api.defaults.withCredentials = false
      } catch (e) {
        console.warn('Error clearing API authorization:', e)
      }
    }
  }
})