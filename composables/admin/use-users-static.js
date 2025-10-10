// composables/admin/use-users-static.js
import { ref, reactive, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'

export function useUsersStatic () {
  /* === Filtros === */
  const searchQuery = ref('')
  const options = [
    'Todos','Estudiante','Docente','Ponente/Tallerista','Externo',
    'Activo','Inactivo','Pagado','No pagado'
  ]
  const selectedFilter = ref('Todos')

  /* === Helper etiqueta === */
  const getIdLabel = (type) => (
    type === 'Estudiante' || type === 'Docente' ? 'Matrícula' : 'ID'
  )

  /* === Datos demo === */
  const users = reactive([
    { name: 'Ana García López', email: 'ana.garcia@universidad.edu.mx', code: 'EST2024001', type: 'Estudiante', typeColor: 'type-estudiante', state: 'Activo', stateColor: 'state-activo', payment: 'No pagado', paymentColor: 'payment-no' },
    { name: 'Dr. Carlos Mendoza', email: 'carlos.mendoza@universidad.edu.mx', code: 'DOC2024001', type: 'Docente', typeColor: 'type-docente', state: 'Activo', stateColor: 'state-activo', payment: 'No pagado', paymentColor: 'payment-no' },
    { name: 'María Elena Ruiz', email: 'maria.ruiz@techcorp.com', code: 'EMP2024001', type: 'Ponente/Tallerista', typeColor: 'type-ponente', state: 'Activo', stateColor: 'state-activo', payment: 'No aplica', paymentColor: 'payment-noaplica' },
    { name: 'Roberto Silva', email: 'roberto.silva@gmail.com', code: 'EXT2024001', type: 'Externo', typeColor: 'type-externo', state: 'Inactivo', stateColor: 'state-inactivo', payment: 'No pagado', paymentColor: 'payment-no' },
    { name: 'Laura Hernández Torres', email: 'laura.hernandez@universidad.edu.mx', code: 'EST2024002', type: 'Estudiante', typeColor: 'type-estudiante', state: 'Activo', stateColor: 'state-activo', payment: 'Pagado', paymentColor: 'payment-pagado' },
    { name: 'Fernando López', email: 'fernando.lopez@yahoo.com', code: 'EXT2024002', type: 'Externo', typeColor: 'type-externo', state: 'Activo', stateColor: 'state-activo', payment: 'Pagado', paymentColor: 'payment-pagado' }
  ])

  /* === Filtro combinado === */
  const filteredUsers = computed(() =>
    users.filter(u => {
      const q = searchQuery.value.trim().toLowerCase()
      const matchText =
        !q || u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q)
      const f = selectedFilter.value
      const matchFilter = f === 'Todos' || u.type === f || u.state === f || u.payment === f
      return matchText && matchFilter
    })
  )

  /* === Toggle con confirmación === */
  const showModal = ref(false)
  const selectedCode = ref(null)
  const pendingChange = ref(null)
  const confirmBtn = ref(null)
  const currentUser = computed(() => users.find(u => u.code === selectedCode.value) || null)

  function confirmToggle (code, event) {
    const user = users.find(u => u.code === code)
    if (!user) return
    pendingChange.value = user.payment === 'Pagado' ? 'No pagado' : 'Pagado'
    event.target.checked = user.payment === 'Pagado'
    selectedCode.value = code
    showModal.value = true
  }

  function applyToggle () {
    const user = users.find(u => u.code === selectedCode.value)
    if (!user) return
    user.payment = pendingChange.value
    user.paymentColor = user.payment === 'Pagado' ? 'payment-pagado' : 'payment-no'
    showModal.value = false
  }

  const cancelToggle = () => { showModal.value = false }

  watch(showModal, val => {
    if (val) nextTick(() => confirmBtn.value?.focus())
  })

  /* === Exportar CSV === */
  const exportData = () => {
    const rows = [
      ['Nombre', 'Correo', 'Matrícula/ID', 'Tipo', 'Estado', 'Estatus de pago'],
      ...filteredUsers.value.map(u => [u.name, u.email, u.code, u.type, u.state, u.payment])
    ]
    const csv = rows.map(r => r.map(s => `"${String(s).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'usuarios.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  /* === Mini-select === */
  const msOpen = ref(false)
  const msActive = ref(0)
  const msRef = ref(null)

  function msToggle (force) {
    msOpen.value = typeof force === 'boolean' ? force : !msOpen.value
    if (msOpen.value) {
      const idx = Math.max(0, options.findIndex(o => o === selectedFilter.value))
      msActive.value = idx
      nextTick(() => {
        const el = msRef.value?.querySelector(`#ms-${msActive.value}`)
        el?.focus?.()
      })
    }
  }

  const pickMs = opt => { selectedFilter.value = opt; msOpen.value = false }

  function onMsListKeydown (e) {
    if (!msOpen.value) return
    if (e.key === 'ArrowDown') msActive.value = (msActive.value + 1) % options.length
    else if (e.key === 'ArrowUp') msActive.value = (msActive.value - 1 + options.length) % options.length
    else if (['Enter', ' '].includes(e.key)) pickMs(options[msActive.value])
    else if (['Escape', 'Tab'].includes(e.key)) msOpen.value = false
  }

  const onClickOutside = e => {
    if (!msRef.value?.contains(e.target)) msOpen.value = false
  }
  onMounted(() => document.addEventListener('click', onClickOutside))
  onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

  return {
    searchQuery, options, selectedFilter,
    msRef, msOpen, msActive, msToggle, pickMs, onMsListKeydown,

    users, filteredUsers, getIdLabel,

    confirmToggle, applyToggle, cancelToggle,
    currentUser, showModal, pendingChange, confirmBtn,

    exportData
  }
}
