// utils/http/api.js
import axios from 'axios';

// ===== Entorno / base URL =====
const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? 'http://localhost:3001' : 'https://api.congresoti.com.mx';

// ===== Logger mínimo: solo imprime en desarrollo =====
const log = {
  error: (...a) => isDev && console.error(...a),
  warn:  (...a) => isDev && console.warn(...a),
  info:  (...a) => isDev && console.info(...a),
};

// ===== Instancia Axios =====
const api = axios.create({
  baseURL,
  timeout: 15000, // súbelo si /auth/register tarda por envío de correo
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 👈 importante para enviar cookies HttpOnly
});

// ─────────────────────────────────────────────────────────────
// Request interceptor
// ─────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'

    // ⬇️ Agrega Bearer si ya hay token en localStorage
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('access_token')
      if (t && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${t}`
      }
    }
    return config
  },
  (error) => {
    log.error('❌ Error en request:', {
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      code: error.code,
    });
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────
// Utilidades para refresh + cola de reintentos
// ─────────────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue = [];

/**
 * Encola callbacks que se ejecutarán cuando termine el refresh.
 * Devuelve una promesa que se resuelve cuando el refresh termina.
 */
function enqueueRefresh() {
  return new Promise((resolve) => {
    refreshQueue.push(resolve);
  });
}

/** Resuelve todas las promesas pendientes tras un refresh exitoso */
function flushQueue() {
  refreshQueue.forEach((resolve) => resolve());
  refreshQueue = [];
}

/** Rutas en las que NO debemos intentar refresh automático */
function shouldSkipRefresh(config = {}) {
  const url = (config.url || '').toLowerCase();
  // Evitar bucles: no refrescar en estas rutas
  return url.includes('/auth/refresh') || url.includes('/auth/login');
}

// ─────────────────────────────────────────────────────────────
// Response interceptor (normalización + auto-refresh 401)
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Response interceptor (normalización + auto-refresh 401/400 UnauthorizedException)
// ─────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const r = error?.response;
    const original = error?.config || {};

    // ===== Normalización de error =====
    let message =
      r?.data?.message ||
      (error?.code === 'ECONNABORTED'
        ? 'Se agotó el tiempo de espera de la solicitud.'
        : error?.message) ||
      'Ocurrió un error desconocido.';

    if (error?.code === 'ERR_NETWORK') {
      message = `No se pudo conectar al servidor (${baseURL}). Verifica tu conexión.`;
    }

    const normalized = {
      url: original?.url || '',
      method: (original?.method || 'get').toUpperCase(),
      status: r?.status ?? 0,
      code: error?.code || 'ERR_UNKNOWN',
      message,
      error: r?.data?.error,
      errors: Array.isArray(r?.data?.errors) ? r.data.errors : undefined,
    };

    log.warn('❌ API error:', normalized);

    // ===== Detectar "Unauthorized" aunque venga como 400 =====
    const looksUnauthorized =
      r?.status === 401 ||
      (r?.status === 400 && (
        String(r?.data?.error || '').includes('Unauthorized') ||
        String(r?.data?.message || '').includes('Unauthorized')
      ));

    // Auto-refresh si está no logueado y NO debemos saltarnos (para evitar bucles)
    if (looksUnauthorized && !original._retry && !shouldSkipRefresh(original)) {
      original._retry = true;

      if (isRefreshing) {
        await enqueueRefresh();
        return api(original);
      }

      isRefreshing = true;
      try {
        await api.post('/auth/refresh', null, {
          withCredentials: true,
          headers: { 'x-skip-refresh': 'true' },
        });

        flushQueue();
        isRefreshing = false;

        return api(original); // reintenta la original
      } catch (e) {
        refreshQueue = [];
        isRefreshing = false;
        return Promise.reject(Object.assign(error, { normalized }));
      }
    }

    return Promise.reject(Object.assign(error, { normalized }));
  }
);


export default api;
