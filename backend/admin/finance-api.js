import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AdminFinanceApi = {
  // ============================
  // RESUMEN
  // ============================
  async getSummary(price) {
    const response = await api.get(ROUTES.ADMIN.FINANCE.SUMMARY, {
      params: { price },
      withCredentials: true,
      timeout: 300000,
    })
    return response.data
  },

  // ============================
  // CATEGORÍAS
  // ============================
  async listCategories() {
    const response = await api.get(ROUTES.ADMIN.FINANCE.CATEGORIES, {
      withCredentials: true,
      timeout: 300000,
    })
    return response.data
  },

  async createCategory(payload) {
    const response = await api.post(
      ROUTES.ADMIN.FINANCE.CATEGORIES,
      payload,
      { withCredentials: true, timeout: 300000 }
    )
    return response.data
  },

  async updateCategory(id, payload) {
    const response = await api.put(
      `${ROUTES.ADMIN.FINANCE.CATEGORIES}/${id}`,
      payload,
      { withCredentials: true, timeout: 300000 }
    )
    return response.data
  },

  async deleteCategory(id) {
    const response = await api.delete(
      `${ROUTES.ADMIN.FINANCE.CATEGORIES}/${id}`,
      { withCredentials: true, timeout: 300000 }
    )
    return response.data
  },

  // ============================
  // MOVIMIENTOS
  // ============================
  async listMovements() {
    const response = await api.get(ROUTES.ADMIN.FINANCE.MOVEMENTS, {
      withCredentials: true,
      timeout: 300000,
    })
    return response.data
  },

  async createMovement(payload) {
    const response = await api.post(
      ROUTES.ADMIN.FINANCE.MOVEMENTS,
      payload,
      { withCredentials: true, timeout: 300000 }
    )
    return response.data
  },

  async updateMovement(id, payload) {
    const response = await api.put(
      `${ROUTES.ADMIN.FINANCE.MOVEMENTS}/${id}`,
      payload,
      { withCredentials: true, timeout: 300000 }
    )
    return response.data
  },

  async deleteMovement(id) {
    const response = await api.delete(
      `${ROUTES.ADMIN.FINANCE.MOVEMENTS}/${id}`,
      { withCredentials: true, timeout: 300000 }
    )
    return response.data
  },
}
