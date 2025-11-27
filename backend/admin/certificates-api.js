// backend/admin/certificates-api.js
import api from '@/backend/http/api'

export const AdminCertificatesApi = {
    // AdminCertificatesApi
    async sendCertificates({ ids = [] }) {
        const payload = { ids }
        const response = await api.post(
            '/admin/users/send-certificates',
            payload,
            { withCredentials: true, timeout: 300000 }
        )
        return response.data
    },
}
