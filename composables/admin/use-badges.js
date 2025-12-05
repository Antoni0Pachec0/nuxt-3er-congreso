// composables/admin/use-badges.js
import { ref } from 'vue'
import { AdminBadgesApi } from '@/backend/admin/badges-api'
import { createNotifyAdapter } from '@/utils/notify/adapter'

const notify = typeof createNotifyAdapter === 'function' ? createNotifyAdapter() : null

const toast = {
  ok: (t, m) => notify?.('success', t, m),
  err: (t, m) => notify?.('error', t, m),
  warn: (t, m) => notify?.('warning', t, m),
}

export function useBadges(selectedIds) {
  const busy = ref(false)

  async function downloadBadges(markPrinted = true) {
    // 1) Validar que selectedIds exista
    if (!selectedIds || !selectedIds.value) {
      console.warn('[useBadges] selectedIds no está inicializado:', selectedIds)
      toast.err('Error', 'No se pudo leer la selección de usuarios.')
      return
    }

    // 2) Normalizar: puede ser Set o Array
    const raw = Array.isArray(selectedIds.value)
      ? selectedIds.value
      : [...selectedIds.value]

    // 3) Limpiar y convertir a números válidos
    const ids = raw
      .map((v) => {
        // asegurar string y quitar espacios
        const s = String(v ?? '').trim()
        return Number(s)
      })
      .filter((n) => Number.isFinite(n) && n > 0)


    if (!ids.length) {
      toast.warn('Selecciona usuarios', 'Debes seleccionar al menos un usuario válido.')
      return
    }

    try {
      busy.value = true

      // 4) Llamar a la API con IDs limpios
      const pdfBlob = await AdminBadgesApi.generateBadges({ ids, markPrinted })

      // 5) Descargar el PDF
      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'gafetes.pdf'
      a.click()
      URL.revokeObjectURL(url)

      toast.ok('Descargado', 'Los gafetes se generaron correctamente.')
    } catch (e) {
      let serverMsg = e?.response?.data?.message

      // Si la respuesta viene como Blob (por responseType: "blob"), intentar leer el JSON o texto
      if (!serverMsg && e?.response?.data instanceof Blob) {
        try {
          const text = await e.response.data.text()
          try {
            const json = JSON.parse(text)
            console.warn('🔍 ERROR JSON BACKEND generate-badges:', json)
            serverMsg = json?.message || json?.error || JSON.stringify(json)
          } catch {
            console.warn('🔍 ERROR TEXT BACKEND generate-badges:', text)
            serverMsg = text
          }
        } catch (blobErr) {
          console.warn('No se pudo leer el blob de error:', blobErr)
        }
      }

      console.warn('❌ Error en downloadBadges:', e)
      toast.err('Error', serverMsg || e?.message || 'No se pudieron generar los gafetes.')
    } finally {
      busy.value = false
    }
  }

  return {
    busy,
    downloadBadges,
  }
}
