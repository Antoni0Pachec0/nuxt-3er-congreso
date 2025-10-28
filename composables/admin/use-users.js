// composables/admin/use-users.js
import { ref, computed, onMounted, nextTick } from 'vue'
import { AdminUsersApi } from '@/backend/admin/users-api'
import { createNotifyAdapter } from '@/utils/notify/adapter'

// Notivue
const notify = typeof createNotifyAdapter === 'function' ? createNotifyAdapter() : null
const toast = {
  ok:   (t, m) => (notify ? notify('success', t, m) : void 0),
  warn: (t, m) => (notify ? notify('warning', t, m) : void 0),
  err:  (t, m) => (notify ? notify('error',   t, m) : void 0),
  info: (t, m) => (notify ? notify('info',    t, m) : void 0),
}

export function useAdminUsers () {
  // Estado principal (API)
  const busy = ref(false)
  const error = ref(null)

  const users = ref([])      // [{ id, name, email, code, type, isActive, eventEnabled, paymentStatus }]
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)
  const q = ref('')
  const filter = ref('Todos')

  // UI: filtros (search + mini-select)
  const searchInput = ref('')
  const options = ['Todos','Estudiante','Docente','Ponente/Tallerista','Externo','Activo','Inactivo','Pagado','No pagado']
  const selectedFilter = ref('Todos')

  // Mini-select UI
  const msOpen = ref(false)
  const msActive = ref(0)
  const msRef = ref(null)

  function msToggle (force) {
    msOpen.value = (typeof force === 'boolean') ? force : !msOpen.value
    if (msOpen.value) {
      const idx = Math.max(0, options.findIndex(o => o === selectedFilter.value))
      msActive.value = idx
      nextTick(() => {
        const el = msRef.value && msRef.value.querySelector ? msRef.value.querySelector('#ms-' + msActive.value) : null
        if (el && typeof el.focus === 'function') el.focus()
      })
    }
  }

  function pickMs (opt) {
    selectedFilter.value = opt ? String(opt) : 'Todos'
    msOpen.value = false
    filter.value = selectedFilter.value
    fetchUsers({ page: 1, q: q.value, filter: filter.value }).catch(() => {})
  }

  function onMsListKeydown (e) {
    if (!msOpen.value) return
    if (e.key === 'ArrowDown') msActive.value = (msActive.value + 1) % options.length
    else if (e.key === 'ArrowUp') msActive.value = (msActive.value - 1 + options.length) % options.length
    else if (e.key === 'Enter' || e.key === ' ') pickMs(options[msActive.value])
    else if (e.key === 'Escape' || e.key === 'Tab') msOpen.value = false
  }

  function onClickOutside (ev) {
    if (!msRef.value) return
    if (!msRef.value.contains(ev.target)) msOpen.value = false
  }

  // Helpers de UI
  function mapTypeColor (type) {
    if (type === 'Estudiante') return 'type-estudiante'
    if (type === 'Docente') return 'type-docente'
    if (type === 'Ponente/Tallerista') return 'type-ponente'
    return 'type-externo'
  }
  function getIdLabel (type) {
    return (type === 'Estudiante' || type === 'Docente') ? 'Matrícula' : 'ID'
  }

  // Paginación
  const totalPages = computed(() => {
    const t = Number.isFinite(Number(total.value)) ? Number(total.value) : 0
    const ps = Number.isFinite(Number(pageSize.value)) ? Number(pageSize.value) : 20
    return Math.max(1, Math.ceil(t / ps))
  })

  function goPage (p) {
    if (p < 1 || p > totalPages.value || busy.value) return
    fetchUsers({ page: p, q: q.value, filter: filter.value }).catch(() => {})
  }

  // Carga de usuarios
  async function fetchUsers (opts = {}) {
    busy.value = true; error.value = null
    try {
      const params = {
        q: (opts.q !== undefined ? opts.q : q.value) || undefined,
        filter: (opts.filter !== undefined ? opts.filter : filter.value) || undefined,
        page: (opts.page !== undefined ? opts.page : page.value),
        pageSize: (opts.pageSize !== undefined ? opts.pageSize : pageSize.value),
      }
      const data = await AdminUsersApi.list(params)
      users.value = (data && data.data) ? data.data : []
      total.value = (data && Number.isFinite(Number(data.total))) ? Number(data.total) : 0
      page.value = (data && Number.isFinite(Number(data.page))) ? Number(data.page) : 1
      pageSize.value = (data && Number.isFinite(Number(data.pageSize))) ? Number(data.pageSize) : 20
    } catch (e) {
      error.value = (e && (e.normalized && e.normalized.message)) ? e.normalized.message : (e && e.message ? e.message : 'No se pudo cargar usuarios')
      toast.err('Error', error.value)
      throw e
    } finally {
      busy.value = false
    }
  }

  // Búsqueda con debounce
  let _deb = null
  function onSearchInput (val) {
    searchInput.value = val ? String(val) : ''
    if (_deb) clearTimeout(_deb)
    _deb = setTimeout(() => {
      q.value = searchInput.value
      fetchUsers({ page: 1, q: q.value, filter: filter.value }).catch(() => {})
    }, 350)
  }

  // Modal de confirmación
  const showModal = ref(false)
  const pendingActivate = ref(false)
  const currentUser = ref(null)
  const confirmBtn = ref(null)

  function onToggleActivation (user, event) {
    if (event && event.target) event.target.checked = !!user.eventEnabled // revert UI temporal
    currentUser.value = user
    pendingActivate.value = !user.eventEnabled
    showModal.value = true
    nextTick(() => { if (confirmBtn.value && typeof confirmBtn.value.focus === 'function') confirmBtn.value.focus() })
  }

  async function applyToggle (force) {
    if (!currentUser.value) return
    try {
      await setActivation(currentUser.value.id, pendingActivate.value, null, !!force)
      showModal.value = false
      toast.ok('Actualizado', 'Estado de acceso al evento actualizado.')
    } catch (e) {
      const msg = (e && e.normalized && e.normalized.message) ? e.normalized.message : (e && e.message ? e.message : 'No se pudo actualizar el estado')
      toast.err('Error', msg)
    }
  }
  function cancelToggle () { showModal.value = false }

  // PATCH
  async function setActivation (userId, activate, reason, force) {
    busy.value = true; error.value = null
    try {
      const res = await AdminUsersApi.setActivation(userId, {
        activate: !!activate,
        reason: reason ? String(reason) : null,
        force: !!force
      })
      const idx = users.value.findIndex(u => Number(u.id) === Number(userId))
      if (idx !== -1) {
        const prev = users.value[idx]
        users.value[idx] = {
          ...prev,
          eventEnabled: !!res.eventEnabled,
          isActive: (res.status === 'active') ? true : !!prev.isActive,
        }
      }
      return res
    } catch (e) {
      error.value = (e && e.normalized && e.normalized.message) ? e.normalized.message : (e && e.message ? e.message : 'No se pudo actualizar el estado')
      throw e
    } finally {
      busy.value = false
    }
  }

  // Export CSV
  function exportData () {
    const rows = [
      ['Nombre', 'Correo', 'Matrícula/ID', 'Tipo', 'Estado', 'Pago', 'Acceso evento'],
      ...users.value.map((u) => [
        u && u.name ? u.name : '',
        u && u.email ? u.email : '',
        u && u.code ? u.code : '',
        u && u.type ? u.type : '',
        (u && u.isActive) ? 'Activo' : 'Inactivo',
        u && u.paymentStatus ? u.paymentStatus : '',
        (u && u.eventEnabled) ? 'Habilitado' : 'Deshabilitado'
      ]),
    ]
    const csv = rows.map(r => r.map(s => `"${String((s ?? '')).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'usuarios.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Carga inicial
  onMounted(() => {
    if (typeof document !== 'undefined') document.addEventListener('click', onClickOutside)
    fetchUsers().catch(() => {})
  })

  return {
    // estado API
    users, total, page, pageSize, q, filter, busy, error,
    fetchUsers, setActivation,

    // filtros / mini-select
    searchInput, onSearchInput,
    options, selectedFilter,
    msOpen, msActive, msRef, msToggle, pickMs, onMsListKeydown,

    // helpers UI
    mapTypeColor, getIdLabel,

    // paginación
    totalPages, goPage,

    // modal
    showModal, pendingActivate, currentUser, confirmBtn,
    onToggleActivation, applyToggle, cancelToggle,

    // export
    exportData,
  }
}
