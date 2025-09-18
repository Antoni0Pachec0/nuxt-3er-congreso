import axios from 'axios'

const baseURL = import.meta.env?.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 
    'Content-Type': 'application/json'
  },
  withCredentials: true // 👈 ESTO ES IMPORTANTE para cookies/auth
})

// Interceptor para requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor para responses - manejo mejorado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Error de conexión. Verifica que el backend esté ejecutándose en http://localhost:3001'
    }
    return Promise.reject(error)
  }
)

export function parseAxiosError(err) {
  if (err.code === 'ERR_NETWORK') {
    return 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.'
  }
  
  const res = err?.response
  if (!res) return 'Error de conexión con el servidor'
  
  const msg = res.data?.message
  if (Array.isArray(msg)) return msg.join(' • ')
  if (typeof msg === 'string') return msg
  return `Error ${res.status}: ${res.statusText || 'Solicitud fallida'}`
}

export default api