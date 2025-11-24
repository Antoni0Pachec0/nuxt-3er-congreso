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
    if (!selectedIds?.value || selectedIds.value.size === 0) {
      toast.warn('Selecciona usuarios', 'Debes seleccionar al menos un usuario.')
      return
    }

    try {
      busy.value = true

      const ids = [...selectedIds.value]
      const pdfBlob = await AdminBadgesApi.generateBadges({ ids, markPrinted })

      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'gafetes.pdf'
      a.click()
      URL.revokeObjectURL(url)

      toast.ok('Descargado', 'Los gafetes se generaron correctamente.')
    } catch (e) {
      const serverMsg = e?.response?.data?.message
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
