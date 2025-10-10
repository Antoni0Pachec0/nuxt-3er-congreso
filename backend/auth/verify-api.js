// backend/auth/verify-api.js
import api from '@/plugins/http/api'
import { ROUTES } from '@/plugins/http/routes'

// Asumo que ya tienes definidos en ROUTES:
// ROUTES.AUTH.VERIFY
// ROUTES.AUTH.RESEND
// ROUTES.AUTH.FORGOT_PASSWORD
//
// Si no, cambia los endpoints aquí mismo.

export const VerifyApi = {
  /**
   * Verifica el código OTP
   * @param {{ email: string, code: string, token_type: 'email_verification'|'reset_password' }} payload
   */
  async verifyCode (payload) {
    // withCredentials si tu backend usa cookies
    return api.post(ROUTES.AUTH.VERIFY, payload, { withCredentials: true })
  },

  /**
   * Reenvía código según el propósito
   * @param {{ email: string, purpose: 'email_verification'|'reset_password' }} params
   */
  async resend ({ email, purpose }) {
    const endpoint = purpose === 'reset_password'
      ? ROUTES.AUTH.FORGOT_PASSWORD // envía mail de reset
      : ROUTES.AUTH.RESEND          // reenvía código de verificación

    return api.post(endpoint, { email }, { withCredentials: true })
  },
}
