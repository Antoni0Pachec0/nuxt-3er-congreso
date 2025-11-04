// backend/workshop/workshops-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

function looksLikeArrayPayload(data) {
  if (Array.isArray(data)) return true
  if (data && typeof data === 'object') {
    return Object.values(data).some(v => Array.isArray(v))
  }
  return false
}

export const WorkshopsApi = {
  async getAll() {
    try {
      const response = await api.get(ROUTES.WORKSHOPS.LIST)
      const data = response?.data
      // fallback: si no parece lista válida, intenta público
      if (!looksLikeArrayPayload(data)) {
        const pub = await api.get(ROUTES.WORKSHOPS.PUBLIC)
        return pub.data
      }
      return data
    } catch (e) {
      // si 401/403 o error cualquiera, intenta público
      try {
        const pub = await api.get(ROUTES.WORKSHOPS.PUBLIC)
        return pub.data
      } catch {
        throw e
      }
    }
  },

  async getPublic() {
    const response = await api.get(ROUTES.WORKSHOPS.PUBLIC)
    return response.data
  },

  async getById(id) {
    const { data } = await api.get(ROUTES.WORKSHOPS.BY_ID(id))
    return data
  },

  async getPublicById(id) {
    const { data } = await api.get(`/workshops/public/${id}`)
    return data
  },

  async getAvailable() {
    const { data } = await api.get(ROUTES.WORKSHOPS.AVAILABLE)
    return data
  },

  async getPublicAvailable() {
    const { data } = await api.get('/workshops/available/public')
    return data
  }
}
