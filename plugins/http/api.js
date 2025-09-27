// utils/http/api.js
import axios from 'axios';

// Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
  if (typeof document === 'undefined') return null; // Previene errores en el servidor (Nuxt)
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const baseURL = import.meta.env?.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Esto es vital para enviar y recibir cookies
});

// Agrega Authorization leyendo el token de la cookie
api.interceptors.request.use((config) => {
  // 💡 Nombre de la cookie donde tu backend guarda el token de acceso
  const token = getCookie('access_token'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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