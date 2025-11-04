// backend/scores/scores-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const ScoresApi = {
  // ✅ Crear score usando solo cookies (withCredentials true viene desde api.js)
  create (payload) {
    return api.post(ROUTES.SCORES.CREATE, payload, {
      // No agregues Authorization aquí
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })
  },

  // ✅ Método que tu checkGameAuthentication está intentando usar
  getMyBest () {
    return api.get(ROUTES.SCORES.MY_BEST, {
      withCredentials: true,
      timeout: 10000,
    })
  },
}
