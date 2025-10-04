// utils/http/error.js
export function parseAxiosError(err) {
  if (err?.code === 'ERR_NETWORK') {
    return 'No se puede conectar verifica tu conexion';
  }
  const res = err?.response;
  if (!res) return 'Error de conexión';
  const msg = res.data?.message;
  if (Array.isArray(msg)) return msg.join(' • ');
  if (typeof msg === 'string') return msg;
  return `Error ${res.status}: ${res.statusText || 'Solicitud fallida'}`;
}
