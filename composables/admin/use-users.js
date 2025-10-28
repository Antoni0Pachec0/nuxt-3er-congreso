// composables/admin/use-users.js
import { ref, computed, onMounted, nextTick } from 'vue'
import { AdminUsersApi } from '@/backend/admin/users-api'
import { createNotifyAdapter } from '@/utils/notify/adapter'
import { useAuthStore } from '@/security/stores/auth'

// Notivue
const notify = typeof createNotifyAdapter === 'function' ? createNotifyAdapter() : null
const toast = {
  ok:   (t, m) => (notify ? notify('success', t, m) : void 0),
  warn: (t, m) => (notify ? notify('warning', t, m) : void 0),
  err:  (t, m) => (notify ? notify('error',   t, m) : void 0),
  info: (t, m) => (notify ? notify('info',    t, m) : void 0),
}

export function useAdminUsers () {
  const authStore = useAuthStore()
  
  // Estado principal (API)
  const busy = ref(false)
  const error = ref(null)

  const users = ref([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)
  const q = ref('')
  const filter = ref('Todos')
  const grade = ref('')
  const group = ref('')

  // UI: filtros
  const searchInput = ref('')
  const options = ['Todos','Estudiante','Docente','Ponente/Tallerista','Externo','Activo','Inactivo','Pagado','No pagado']
  const selectedFilter = ref('Todos')
  
  // Nuevos filtros
  const gradeOptions = ref([])
  const selectedGrade = ref('')
  const groupOptions = ref([])
  const selectedGroup = ref('')

  // Mini-select UI para filtro principal
  const msOpen = ref(false)
  const msActive = ref(0)
  const msRef = ref(null)

  // Mini-select para grado
  const gradeOpen = ref(false)
  const gradeActive = ref(0)
  const gradeRef = ref(null)

  // Mini-select para grupo
  const groupOpen = ref(false)
  const groupActive = ref(0)
  const groupRef = ref(null)

  // Funciones para filtro principal (existentes)
  function msToggle (force) {
    msOpen.value = (typeof force === 'boolean') ? force : !msOpen.value
    if (msOpen.value) {
      const idx = Math.max(0, options.findIndex(o => o === selectedFilter.value))
      msActive.value = idx
      nextTick(() => {
        const el = msRef.value?.querySelector(`#ms-${msActive.value}`)
        el?.focus?.()
      })
    }
  }

  function pickMs (opt) {
    selectedFilter.value = opt ? String(opt) : 'Todos'
    msOpen.value = false
    filter.value = selectedFilter.value
    fetchUsers({ page: 1, q: q.value, filter: filter.value, grade: grade.value, group: group.value }).catch(() => {})
  }

  function onMsListKeydown (e) {
    if (!msOpen.value) return
    if (e.key === 'ArrowDown') msActive.value = (msActive.value + 1) % options.length
    else if (e.key === 'ArrowUp') msActive.value = (msActive.value - 1 + options.length) % options.length
    else if (e.key === 'Enter' || e.key === ' ') pickMs(options[msActive.value])
    else if (e.key === 'Escape' || e.key === 'Tab') msOpen.value = false
  }

  // Funciones para filtro de grado
  function gradeToggle (force) {
    gradeOpen.value = (typeof force === 'boolean') ? force : !gradeOpen.value
  }

  function pickGrade (selected) {
    selectedGrade.value = selected || ''
    gradeOpen.value = false
    grade.value = selectedGrade.value
    fetchUsers({ page: 1, q: q.value, filter: filter.value, grade: grade.value, group: group.value }).catch(() => {})
  }

  function onGradeListKeydown (e) {
    if (!gradeOpen.value) return
    if (e.key === 'ArrowDown') gradeActive.value = (gradeActive.value + 1) % gradeOptions.value.length
    else if (e.key === 'ArrowUp') gradeActive.value = (gradeActive.value - 1 + gradeOptions.value.length) % gradeOptions.value.length
    else if (e.key === 'Enter' || e.key === ' ') pickGrade(gradeOptions.value[gradeActive.value])
    else if (e.key === 'Escape' || e.key === 'Tab') gradeOpen.value = false
  }

  // Funciones para filtro de grupo
  function groupToggle (force) {
    groupOpen.value = (typeof force === 'boolean') ? force : !groupOpen.value
  }

  function pickGroup (selected) {
    selectedGroup.value = selected || ''
    groupOpen.value = false
    group.value = selectedGroup.value
    fetchUsers({ page: 1, q: q.value, filter: filter.value, grade: grade.value, group: group.value }).catch(() => {})
  }

  function onGroupListKeydown (e) {
    if (!groupOpen.value) return
    if (e.key === 'ArrowDown') groupActive.value = (groupActive.value + 1) % groupOptions.value.length
    else if (e.key === 'ArrowUp') groupActive.value = (groupActive.value - 1 + groupOptions.value.length) % groupOptions.value.length
    else if (e.key === 'Enter' || e.key === ' ') pickGroup(groupOptions.value[groupActive.value])
    else if (e.key === 'Escape' || e.key === 'Tab') groupOpen.value = false
  }

  // Cerrar dropdowns al hacer click fuera
  function onClickOutside (ev) {
    if (msRef.value && !msRef.value.contains(ev.target)) msOpen.value = false
    if (gradeRef.value && !gradeRef.value.contains(ev.target)) gradeOpen.value = false
    if (groupRef.value && !groupRef.value.contains(ev.target)) groupOpen.value = false
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
    fetchUsers({ page: p, q: q.value, filter: filter.value, grade: grade.value, group: group.value }).catch(() => {})
  }

  // Carga de usuarios y opciones de filtro
  async function fetchUsers (opts = {}) {
    busy.value = true; error.value = null
    try {
      const params = {
        q: (opts.q !== undefined ? opts.q : q.value) || undefined,
        filter: (opts.filter !== undefined ? opts.filter : filter.value) || undefined,
        grade: (opts.grade !== undefined ? opts.grade : grade.value) || undefined,
        group: (opts.group !== undefined ? opts.group : group.value) || undefined,
        page: (opts.page !== undefined ? opts.page : page.value),
        pageSize: (opts.pageSize !== undefined ? opts.pageSize : pageSize.value),
      }
      const data = await AdminUsersApi.list(params)
      users.value = data?.data || []
      total.value = Number(data?.total) || 0
      page.value = Number(data?.page) || 1
      pageSize.value = Number(data?.pageSize) || 20
    } catch (e) {
      error.value = e?.normalized?.message || e?.message || 'No se pudo cargar usuarios'
      toast.err('Error', error.value)
      throw e
    } finally {
      busy.value = false
    }
  }

  // Cargar opciones de filtro
  async function loadFilterOptions() {
    try {
      const data = await AdminUsersApi.getFilterOptions()
      gradeOptions.value = data?.grades || []
      groupOptions.value = data?.groups || []
    } catch (e) {
      console.error('Error loading filter options:', e)
    }
  }

  // Búsqueda con debounce
  let _deb = null
  function onSearchInput (val) {
    searchInput.value = val ? String(val) : ''
    if (_deb) clearTimeout(_deb)
    _deb = setTimeout(() => {
      q.value = searchInput.value
      fetchUsers({ page: 1, q: q.value, filter: filter.value, grade: grade.value, group: group.value }).catch(() => {})
    }, 350)
  }

  // Modal de confirmación (existente)
  const showModal = ref(false)
  const pendingActivate = ref(false)
  const currentUser = ref(null)
  const confirmBtn = ref(null)

  function onToggleActivation (user, event) {
    if (event && event.target) event.target.checked = !!user.eventEnabled
    currentUser.value = user
    pendingActivate.value = !user.eventEnabled
    showModal.value = true
    nextTick(() => confirmBtn.value?.focus?.())
  }

  async function applyToggle (force) {
    if (!currentUser.value) return
    try {
      await setActivation(currentUser.value.id, pendingActivate.value, null, !!force)
      showModal.value = false
      toast.ok('Actualizado', 'Estado de acceso al evento actualizado.')
    } catch (e) {
      const msg = e?.normalized?.message || e?.message || 'No se pudo actualizar el estado'
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
      error.value = e?.normalized?.message || e?.message || 'No se pudo actualizar el estado'
      throw e
    } finally {
      busy.value = false
    }
  }

  // Export CSV
  function exportData () {
    const rows = [
      ['Nombre', 'Correo', 'Matrícula/ID', 'Tipo', 'Grado', 'Grupo', 'Estado', 'Pago', 'Acceso evento'],
      ...users.value.map((u) => [
        u?.name || '',
        u?.email || '',
        u?.code || '',
        u?.type || '',
        u?.grade || '',
        u?.group || '',
        u?.isActive ? 'Activo' : 'Inactivo',
        u?.paymentStatus || '',
        u?.eventEnabled ? 'Habilitado' : 'Deshabilitado'
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

  // Cerrar sesión
  async function logout() {
    try {
      await authStore.logout()
      navigateTo('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.err('Error', 'No se pudo cerrar sesión')
    }
  }

  // Carga inicial
  onMounted(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', onClickOutside)
    }
    fetchUsers().catch(() => {})
    loadFilterOptions()
  })

  return {
    // estado API
    users, total, page, pageSize, q, filter, grade, group, busy, error,
    fetchUsers, setActivation,

    // filtros
    searchInput, onSearchInput,
    options, selectedFilter,
    gradeOptions, selectedGrade, gradeOpen, gradeActive, gradeRef, gradeToggle, pickGrade, onGradeListKeydown,
    groupOptions, selectedGroup, groupOpen, groupActive, groupRef, groupToggle, pickGroup, onGroupListKeydown,
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
    
    // logout
    logout
  }
}