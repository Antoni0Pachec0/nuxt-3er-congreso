// backend/workshops/workshops-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

// Asegúrate de tener definidos estos paths en ROUTES
// ROUTES.WORKSHOPS = {
//   LIST: '/admin/workshops',
//   CREATE: '/admin/workshops',
//   UPDATE: (id) => `/admin/workshops/${id}`,
//   DELETE: (id) => `/admin/workshops/${id}`,
// }

export const WorkshopsApi = {
  list () {
    return api.get(ROUTES.WORKSHOPS.LIST, { withCredentials: true })
  },
  create (payload) {
    return api.post(ROUTES.WORKSHOPS.CREATE, payload, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    })
  },
  update (id, payload) {
    return api.put(ROUTES.WORKSHOPS.UPDATE(id), payload, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    })
  },
  remove (id) {
    return api.delete(ROUTES.WORKSHOPS.DELETE(id), { withCredentials: true })
  }
}
