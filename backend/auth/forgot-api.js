// backend/auth/forgot-api.js
import api from '@/plugins/http/api'
import { ROUTES } from '@/plugins/http/routes'

export const ForgotApi = {
  /**
   * Solicita envío de código de recuperación al email
   * @param {{ email: string }} payload
   */
  async sendResetCode (payload) {
    // Si tu backend necesita cookies para rate-limits/sesión, deja withCredentials: true
    return api.post(ROUTES.AUTH.FORGOT_PASSWORD, payload, { withCredentials: true })
  },
}
