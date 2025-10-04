// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoggingOut: false
  }),

  actions: {
    setUser(user) {
      this.user = user
      this.isAuthenticated = !!user
    },

    setAuthenticated(status) {
      this.isAuthenticated = status
      if (!status) this.user = null
    },

    async logout() {
      if (this.isLoggingOut) return
      
      this.isLoggingOut = true
      
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        })
      } catch (error) {
        console.error('Error during logout:', error)
      } finally {
        this.user = null
        this.isAuthenticated = false
        this.isLoggingOut = false
        
        await navigateTo('/login')
      }
    }
  },

  persist: true
})