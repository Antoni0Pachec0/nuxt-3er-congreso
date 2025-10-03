// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    setAuthenticated(status) {
      this.isAuthenticated = status
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
    },
  },
})
