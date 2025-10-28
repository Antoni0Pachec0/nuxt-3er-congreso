// backend/admin/users-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AdminUsersApi = {
  async list ({ q, filter, page = 1, pageSize = 20 } = {}) {
    const params = { q, filter, page, pageSize }
    const { data } = await api.get(ROUTES.ADMIN.USERS.LIST, {
      params,
      withCredentials: true,
      timeout: 20000,
    })
    return data
  },

  async setActivation (userId, { activate, reason = null, force = false }) {
    const { data } = await api.patch(
      ROUTES.ADMIN.USERS.ACTIVATION(userId),
      { activate, reason, force },
      { withCredentials: true, timeout: 15000 }
    )
    return data
  },
}
