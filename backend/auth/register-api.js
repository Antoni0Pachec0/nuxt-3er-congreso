// backend/auth/register-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AuthApi = {
  async register(userData) {
    const { data } = await api.post(ROUTES.AUTH.REGISTER, userData, {
      withCredentials: true,
      timeout: 30000
    })
    return data
  },

  async validateSpeakerSecret(secretData) {
    const { data } = await api.post(ROUTES.AUTH.CHECK_SPEAKER_SECRET, secretData)
    return data
  }
}