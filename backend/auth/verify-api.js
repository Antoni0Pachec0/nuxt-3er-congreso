// backend/auth/verify-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const VerifyApi = {
  /**
   * Verifica el código OTP
   * @param {{ email: string, code: string, token_type: 'email_verification'|'reset_password' }} payload
   */
  async verifyCode (payload) {
    const { data } = await api.post(ROUTES.AUTH.VERIFY, payload, { withCredentials: true })
    return data
  },

  /**
   * Reenvía código según el propósito
   * @param {{ email: string, purpose: 'email_verification'|'reset_password' }} params
   */
  async resend ({ email, purpose }) {
    const endpoint = purpose === 'reset_password'
      ? ROUTES.AUTH.FORGOT_PASSWORD // envía mail de reset
      : ROUTES.AUTH.RESEND          // reenvía código de verificación

    const { data } = await api.post(endpoint, { email }, { withCredentials: true })
    return data
  },
}