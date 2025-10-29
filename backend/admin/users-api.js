// backend/admin/users-api.js (versión con manejo de errores mejorado)
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AdminUsersApi = {
  async list({ q, filter, grade, group, page = 1, pageSize = 20 } = {}, { signal, timeout = 20000 } = {}) {
    const params = { q, filter, grade, group, page, pageSize }
    const { data } = await api.get(ROUTES.ADMIN.USERS.LIST, {
      params,
      withCredentials: true,
      timeout,
      signal,
    })
    return data
  },

  async getFilterOptions({ timeout = 10000 } = {}) {
    const { data } = await api.get(ROUTES.ADMIN.USERS.FILTER_OPTIONS, {
      withCredentials: true,
      timeout,
    })
    return data
  },

  async setActivation(userId, { activate, reason = null, force = false, status_event }, { timeout = 15000 } = {}) {
    const payload = {
      activate,
      reason,
      force,
      status_event: typeof status_event === 'boolean' ? status_event : activate
    }

    const { data } = await api.patch(
      ROUTES.ADMIN.USERS.ACTIVATION(userId),
      payload,
      { withCredentials: true, timeout }
    )
    return data
  },

  async bulkActivation({ ids = [], activate, force = true, status_event }, { timeout = 30000 } = {}) {
    try {
      const payload = {
        ids, 
        activate, 
        force,
        status_event: typeof status_event === 'boolean' ? status_event : activate
      }

      const { data } = await api.patch(
        ROUTES.ADMIN.USERS.ACTIVATION_BULK,
        payload,
        { withCredentials: true, timeout }
      )
      return data
    } catch (error) {
      // Si el endpoint no existe, lanzar error específico para que el frontend use fallback
      if (error.response?.status === 404 || error.response?.status === 405) {
        const notFoundError = new Error('Bulk activation endpoint not found')
        notFoundError.code = 'ENDPOINT_NOT_FOUND'
        throw notFoundError
      }
      throw error
    }
  }
}