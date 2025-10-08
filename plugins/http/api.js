// utils/http/api.js
import axios from 'axios';

// Configuración base
const isDevelopment = process.env.NODE_ENV === 'development';
const baseURL = isDevelopment 
  ? 'http://localhost:3001' 
  : 'https://api.congresoti.com.mx';

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANTE para cookies
});

// Interceptor de request SIMPLIFICADO
api.interceptors.request.use((config) => {
  
  // 🔥 SOLO HEADERS ESENCIALES - eliminar headers problemáticos
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  
  return config;
}, (error) => {
  console.error('❌ Error en request:', error);
  return Promise.reject(error);
});

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });
    
    if (error.code === 'ERR_NETWORK') {
      error.message = `No se pudo conectar al servidor (${baseURL}). Verifica la conexión.`;
    }
    
    return Promise.reject(error);
  }
);

export default api;