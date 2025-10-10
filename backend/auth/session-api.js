// backend/auth/session-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const SessionApi = {
  /**
   * Cerrar sesión en el backend
   */
  async logout () {
    // Ajusta método/ruta si tu backend usa otro (POST/DELETE, etc.)
    return api.post(ROUTES.AUTH.LOGOUT, {}, { withCredentials: true })
  }
}
