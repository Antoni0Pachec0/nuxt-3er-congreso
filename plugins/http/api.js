// utils/http/api.js
import axios from 'axios';

// ===== Entorno / base URL =====
const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? 'http://localhost:3001' : 'https://api.congresoti.com.mx';

// Logger mínimo: solo imprime en desarrollo
const log = {
  error: (...a) => isDev && console.error(...a),
  warn:  (...a) => isDev && console.warn(...a),
  info:  (...a) => isDev && console.info(...a),
};

// ===== Instancia Axios =====
const api = axios.create({
  baseURL,
  timeout: 15000, // puedes subir a 30000 si /auth/register tarda por el correo
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // cookies
});

// ===== Interceptor de request =====
api.interceptors.request.use(
  (config) => {
    // Headers esenciales
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => {
    // No “rompas” producción con prints
    log.error('❌ Error en request:', {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      code: error.code,
    });
    return Promise.reject(error);
  }
);

// ===== Interceptor de response =====
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extrae respuesta (puede no existir en timeouts / red)
    const r = error?.response;

    // Mensaje base
    let message =
      r?.data?.message ||
      (error?.code === 'ECONNABORTED' ? 'Se agotó el tiempo de espera de la solicitud.' : error?.message) ||
      'Ocurrió un error desconocido.';

    // Ajustes de mensaje por escenario
    if (error?.code === 'ERR_NETWORK') {
      message = `No se pudo conectar al servidor (${baseURL}). Verifica tu conexión.`;
    }

    // Paquete normalizado para tu UI
    const normalized = {
      url: error?.config?.url || '',
      method: (error?.config?.method || 'get').toUpperCase(),
      status: r?.status ?? 0, // 0 cuando no hay response (timeout/red)
      code: error?.code || 'ERR_UNKNOWN',
      message,
      error: r?.data?.error,
      errors: Array.isArray(r?.data?.errors) ? r.data.errors : undefined,
      // raw opcional si quieres inspeccionar
      // raw: r?.data,
    };

    // Log SOLO en desarrollo
    log.warn('❌ API error:', normalized);

    // Adjunta el normalizado al error y rechaza
    return Promise.reject(Object.assign(error, { normalized }));
  }
);

export default api;
