// backend/admin/attendance-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AdminAttendanceApi = {
  async listWorkshops () {
    const { data } = await api.get(ROUTES.ADMIN.ATTENDANCE.WORKSHOPS)
    return Array.isArray(data) ? data : data.workshops || []
  },

  async scanQr ({ qrValue, workshopId, scheduleId }) {
    const payload = {
      qrValue,
      workshopId,
      scheduleId: scheduleId || undefined,
    }

    const { data } = await api.post(ROUTES.ADMIN.ATTENDANCE.SCAN_QR, payload)
    return data
  },

  async listAttendance ({ workshopId }) {
    const url = ROUTES.ADMIN.ATTENDANCE.USERS_BY_TYPE(workshopId)
    const { data } = await api.get(url)
    // devolvemos { workshop, all, byType }
    return data
  },
}
