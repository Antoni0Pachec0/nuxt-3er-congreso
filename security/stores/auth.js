// security/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoggingOut: false
  }),

  actions: {
    setUser(user) { 
      this.user = user; 
      this.isAuthenticated = !!user 
    },
    
    setAuthenticated(status) { 
      this.isAuthenticated = status; 
      if (!status) this.user = null 
    },
    
    loadFromStorage() {
      try { 
        const raw = localStorage.getItem('auth_store'); 
        if (raw) {
          const p = JSON.parse(raw); 
          this.user = p?.user ?? null; 
          this.isAuthenticated = !!p?.isAuthenticated
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
        
        // Limpiar localStorage
        localStorage.removeItem('auth_store')
        
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