// backend/admin/attendance-api.js
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

export const AdminAttendanceApi = {
  async listWorkshops () {
    try {
      const { data } = await api.get(ROUTES.ADMIN.ATTENDANCE.WORKSHOPS)
      console.log('🟢 listWorkshops RAW data:', data)
      return Array.isArray(data) ? data : data.workshops || []
    } catch (e) {
      console.error('❌ listWorkshops ERROR:', {
        status: e?.response?.status,
        data: e?.response?.data,
        url: ROUTES.ADMIN.ATTENDANCE.WORKSHOPS,
      })
      throw e
    }
  },

  async scanQr ({ qrValue, workshopId, scheduleId }) {
    const payload = {
      qrValue,
      workshopId,
      scheduleId: scheduleId || undefined,
    }

    try {
      const { data } = await api.post(ROUTES.ADMIN.ATTENDANCE.SCAN_QR, payload)
      return data
    } catch (e) {
      console.error('❌ scanQr ERROR:', {
        status: e?.response?.status,
        data: e?.response?.data,
        url: ROUTES.ADMIN.ATTENDANCE.SCAN_QR,
        payload,
      })
      throw e
    }
  },

  async listAttendance ({ workshopId }) {
    const url = ROUTES.ADMIN.ATTENDANCE.USERS_BY_TYPE(workshopId)
    try {
      const { data } = await api.get(url)
      return data
    } catch (e) {
      console.error('❌ listAttendance ERROR:', {
        status: e?.response?.status,
        data: e?.response?.data,
        url,
      })
      throw e
    }
  },
}
