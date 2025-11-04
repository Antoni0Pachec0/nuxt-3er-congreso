// src/backend/user/users-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const UsersApi = {
  async enrollMyWorkshop(workshopId) {
    const { data } = await api.post(ROUTES.USERS.ENROLL_WORKSHOP, { workshopId })
    return data
  }
}
