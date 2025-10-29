// backend/admin/users-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AdminUsersApi = {
  async list ({ q, filter, grade, group, page = 1, pageSize = 20 } = {}, { signal, timeout = 20000 } = {}) {
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

  async setActivation (userId, { activate, reason = null, force = false, status_event }, { timeout = 15000 } = {}) {
    // Enviamos también status_event por si tu BE lo persiste directo
    const payload = { activate, reason, force }
    if (typeof status_event === 'boolean') payload.status_event = status_event

    const { data } = await api.patch(
      ROUTES.ADMIN.USERS.ACTIVATION(userId),
      payload,
      { withCredentials: true, timeout }
    )
    return data
  },

  // ===== NUEVO: intento de endpoint masivo =====
  async bulkActivation ({ ids = [], activate, force = true }, { timeout = 30000 } = {}) {
    // Ajusta la ruta si tu backend usa otra. Ejemplo sugerido:
    // PATCH /admin/users/activation-bulk  { ids: number[], activate: boolean, force: boolean }
    const { data } = await api.patch(
      ROUTES.ADMIN.USERS.ACTIVATION_BULK, // <<--- define esta ruta en routes
      { ids, activate, force },
      { withCredentials: true, timeout }
    )
    // Espera que data sea: [{ id, eventEnabled, status_event }, ...]
    return data
  }
}
