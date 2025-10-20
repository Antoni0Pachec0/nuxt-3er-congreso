// backend/auth/reset-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

// Debe existir ROUTES.AUTH.RESET_PASSWORD
// Si tu backend requiere cookies, deja withCredentials: true

export const ResetApi = {
  /**
   * Restablece la contraseña usando email + código de 6 dígitos
   * @param {{ email: string, password: string, code: string }} payload
   */
  async resetPassword (payload) {
    return api.post(ROUTES.AUTH.RESET_PASSWORD, payload, { withCredentials: true })
  },
}
