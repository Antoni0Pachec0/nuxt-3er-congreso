// backend/auth/token-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const TokenApi = {
  /**
   * Refresca el access_token usando un refresh_token.
   * Devuelve el nuevo access_token (string) o lanza error.
   */
  async refresh (refreshToken) {
    const { data } = await api.post(
      ROUTES.AUTH.REFRESH,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    )
    return data?.access_token
  }
}
