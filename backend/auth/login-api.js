// backend/auth/login-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AuthApi = {
  async login(credentials) {
    const { data } = await api.post(ROUTES.AUTH.LOGIN, credentials)
    return data
  },

  // Podrías agregar más métodos relacionados con auth
  async logout() {
    const { data } = await api.post(ROUTES.AUTH.LOGOUT)
    return data
  },

  async getMe() {
    const { data } = await api.get(ROUTES.AUTH.ME)
    return data
  }
}