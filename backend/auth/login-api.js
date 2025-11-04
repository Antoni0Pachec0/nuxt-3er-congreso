// backend/auth/login-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AuthApi = {
  async login(credentials) {
    const { data } = await api.post(ROUTES.AUTH.LOGIN, credentials)
    return data
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  async getMe() {
    const { data } = await api.get(ROUTES.AUTH.ME)
    return data
  }
}