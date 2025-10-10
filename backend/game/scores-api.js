// backend/scores/scores-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const ScoresApi = {
  /**
   * Crea un score.
   * @param {{ value: number }} payload
   * @param {string} accessToken
   */
  async create (payload, accessToken) {
    return api.post(
      ROUTES.SCORES.CREATE,
      payload,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 10000
      }
    )
  }
}
