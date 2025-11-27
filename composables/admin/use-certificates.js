// composables/admin/use-certificates.js
import { ref } from 'vue'
import { AdminCertificatesApi } from '@/backend/admin/certificates-api'
import { createNotifyAdapter } from '@/utils/notify/adapter'

const notify = typeof createNotifyAdapter === 'function' ? createNotifyAdapter() : null
const toast = {
  ok: (t, m) => notify?.('success', t, m),
  err: (t, m) => notify?.('error', t, m),
  warn: (t, m) => notify?.('warning', t, m),
  loading: (t, m) => notify?.('loading', t, m),
}

export function useCertificates(selectedIds) {
  const busy = ref(false)

  async function sendCertificates() {
    if (!selectedIds?.value || selectedIds.value.size === 0) {
      toast.warn('Selecciona usuarios', 'Debes seleccionar al menos un usuario.')
      return
    }

    const ids = [...selectedIds.value]

    let loader
    try {
      busy.value = true
      loader = toast.loading(
        'Enviando certificados',
        'Se están enviando los certificados seleccionados…',
      )

      const res = await AdminCertificatesApi.sendCertificates({ ids })

      const total = res?.totalSolicitados ?? ids.length
      const enviados = res?.enviados ?? 0
      const fallidos = res?.fallidos ?? Math.max(total - enviados, 0)

      let title
      let message
      let isSuccess = false

      if (total === 0) {
        title = 'Sin usuarios'
        message = 'No se recibieron usuarios para enviar certificados.'
        isSuccess = false
      } else if (enviados === 0) {
        title = 'Sin envíos'
        message = 'No se pudo enviar ningún certificado. Revisa la configuración de correo.'
        isSuccess = false
      } else if (fallidos > 0) {
        title = 'Envío parcial'
        message = `Se enviaron ${enviados} certificado(s), pero ${fallidos} no pudieron enviarse.`
        isSuccess = false // lo tratamos como alerta/“error”
      } else {
        title = 'Proceso completado'
        message = `Se enviaron ${enviados} certificado(s) correctamente.`
        isSuccess = true
      }

      if (loader) {
        if (isSuccess) {
          loader.resolve({ title, message })
        } else {
          loader.reject({ title, message })
        }
      } else {
        if (isSuccess) {
          toast.ok(title, message)
        } else {
          toast.err(title, message)
        }
      }
    } catch (e) {
      const msg =
        'Ocurrió un error en el servidor al enviar los certificados. Intenta de nuevo más tarde.'

      if (loader) {
        loader.reject({ title: 'Error', message: msg })
      } else {
        toast.err('Error', msg)
      }
    } finally {
      busy.value = false
    }
  }

  return {
    busy,
    sendCertificates,
  }
}
