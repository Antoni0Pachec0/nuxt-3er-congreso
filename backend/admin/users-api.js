// backend/admin/users-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AdminUsersApi = {
  async list ({ q, filter, grade, group, page = 1, pageSize = 20 } = {}) {
    const params = { q, filter, grade, group, page, pageSize }
    const { data } = await api.get(ROUTES.ADMIN.USERS.LIST, {
      params,
      withCredentials: true,
      timeout: 20000,
    })
    return data
  },

  async getFilterOptions() {
    const { data } = await api.get(ROUTES.ADMIN.USERS.FILTER_OPTIONS, { // 👈 Usa la ruta definida
      withCredentials: true,
      timeout: 10000,
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