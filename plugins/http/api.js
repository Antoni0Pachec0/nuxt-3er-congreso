// utils/http/api.js
import axios from 'axios';

const baseURL = import.meta.env?.NUXT_PUBLIC_API_BASE_URL || 'http://congreso-backedcongresodev-fsfi5q-801bf7-72-60-27-95.traefik.me';

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // cookies si tu backend las usa (recomendado)
});

// Agrega Authorization si guardas access_token (si usas solo cookies, puedes quitar esto)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mensaje legible para problemas de red
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      error.message = `No se pudo conectar al servidor (${baseURL}). Verifica que esté arriba.`;
    }
    return Promise.reject(error);
  }
);

export default api;
