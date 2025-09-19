// utils/http/error.js
export function parseAxiosError(err) {
  if (err?.code === 'ERR_NETWORK') {
    return 'No se puede conectar al servidor. Verifica tu conexión o que el backend esté activo.';
  }
  const res = err?.response;
  if (!res) return 'Error de conexión con el servidor';
  const msg = res.data?.message;
  if (Array.isArray(msg)) return msg.join(' • ');
  if (typeof msg === 'string') return msg;
  return `Error ${res.status}: ${res.statusText || 'Solicitud fallida'}`;
}
