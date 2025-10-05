// stores/auth.js
import { defineStore } from 'pinia'
import { nextTick } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoggingOut: false
  }),

  actions: {
    setUser(user) { this.user = user; this.isAuthenticated = !!user },
    setAuthenticated(status) { this.isAuthenticated = status; if (!status) this.user = null },
    loadFromStorage() {
      try { const raw = localStorage.getItem('auth_store'); if (raw) {
        const p = JSON.parse(raw); this.user = p?.user ?? null; this.isAuthenticated = !!p?.isAuthenticated
      }} catch {}
    },

    async logout() {
      if (this.isLoggingOut) return
      this.isLoggingOut = true
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        })
      } catch (e) {
        console.error('Error during logout:', e)
      } finally {
        // limpiar estado
        this.user = null
        this.isAuthenticated = false

        // expira cookies también en cliente (por si acaso)
        const expire = 'Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = `access_token=; Path=/; SameSite=Lax; Expires=${expire}`
        document.cookie = `refresh_token=; Path=/; SameSite=Lax; Expires=${expire}`

        // 🚀 redirige y mantén isLoggingOut hasta que termine
        try {
          await navigateTo('/login', { replace: true })
          await nextTick()
        } finally {
          this.isLoggingOut = false
        }
      }
    }
  },

  persist: true
})
