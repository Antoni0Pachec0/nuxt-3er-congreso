// backend/auth/reset-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const ResetApi = {
  /**
   * Restablece la contraseña usando email + código de 6 dígitos
   * @param {{ email: string, password: string, code: string }} payload
   */
  async resetPassword(payload) {
    console.log('📤 [RESET-API] Enviando solicitud de reset:', {
      email: payload.email,
      code: payload.code,
      passwordLength: payload.password?.length
    });

    try {
      const response = await api.post(ROUTES.AUTH.RESET_PASSWORD, payload, { 
        withCredentials: true 
      });
      
      console.log('✅ [RESET-API] Respuesta exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [RESET-API] Error en la solicitud:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
}