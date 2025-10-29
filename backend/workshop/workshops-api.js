// backend/workshops/workshops-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const WorkshopsApi = {
  /**
   * Obtener todos los talleres activos (para usuarios autenticados)
   */
  async getAll() {
    console.log('📡 [WorkshopsApi] Obteniendo talleres autenticados...');
    try {
      const response = await api.get(ROUTES.WORKSHOPS.LIST)
      console.log('✅ [WorkshopsApi] Talleres autenticados recibidos:', response.data);
      return response.data
    } catch (error) {
      console.error('❌ [WorkshopsApi] Error obteniendo talleres autenticados:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los talleres activos (público - sin autenticación)
   */
  async getPublic() {
    console.log('📡 [WorkshopsApi] Obteniendo talleres públicos...');
    try {
      const response = await api.get(ROUTES.WORKSHOPS.PUBLIC)
      console.log('✅ [WorkshopsApi] Talleres públicos recibidos:', response.data);
      return response.data
    } catch (error) {
      console.error('❌ [WorkshopsApi] Error obteniendo talleres públicos:', error);
      throw error;
    }
  },

  /**
   * Obtener un taller específico por ID (autenticado)
   */
  async getById(id) {
    const { data } = await api.get(ROUTES.WORKSHOPS.BY_ID(id))
    return data
  },

  /**
   * Obtener un taller específico por ID (público)
   */
  async getPublicById(id) {
    const { data } = await api.get(`/workshops/public/${id}`)
    return data
  },

  /**
   * Obtener talleres con disponibilidad (autenticado)
   */
  async getAvailable() {
    const { data } = await api.get(ROUTES.WORKSHOPS.AVAILABLE)
    return data
  },

  /**
   * Obtener talleres con disponibilidad (público)
   */
  async getPublicAvailable() {
    const { data } = await api.get('/workshops/available/public')
    return data
  }
}