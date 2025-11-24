// backend/admin/badges-api.js
import api from '@/backend/http/api'

export const AdminBadgesApi = {
  async generateBadges({ ids = [], markPrinted = true }) {
    const payload = { ids, markPrinted }

    const response = await api.post(
      '/admin/users/generate-badges',
      payload,
      {
        responseType: 'blob',
        withCredentials: true,
        timeout: 180000, // 3 minutos
      }
    )

    return new Blob([response.data], { type: 'application/pdf' })
  }
}
