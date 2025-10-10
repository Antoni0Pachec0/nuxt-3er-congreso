// composables/admin/use-schedule-static.js
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export function useScheduleStatic () {
  /* ===== Estado del día ===== */
  const dayOptions = [
    { value: 'day1', label: 'Día 1 - Miércoles 12 Noviembre' },
    { value: 'day2', label: 'Día 2 - Jueves 13 Noviembre' },
    { value: 'day3', label: 'Día 3 - Viernes 14 Noviembre' }
  ]
  const dayDates = { day1: '2025-11-12', day2: '2025-11-13', day3: '2025-11-14' }

  const selectedDay = ref('day1')
  const selectedDayLabel = computed(() =>
    dayOptions.find(d => d.value === selectedDay.value)?.label ?? ''
  )
  const selectedDayTitle = computed(() => selectedDayLabel.value.split(' - ')[0])
  const selectedDayDate = computed(() => dayDates[selectedDay.value] || '')

  const dayOpen = ref(false)
  const dayActive = ref(0)
  const dayRef = ref(null)

  function toggleDay () {
    dayOpen.value = !dayOpen.value
    if (dayOpen.value) {
      const idx = Math.max(0, dayOptions.findIndex(d => d.value === selectedDay.value))
      dayActive.value = idx
    }
  }

  function pickDay (val) {
    selectedDay.value = val
    dayActive.value = dayOptions.findIndex(d => d.value === val)
    dayOpen.value = false
  }

  const onClickOutside = e => {
    if (!dayRef.value?.contains(e.target)) dayOpen.value = false
  }

  onMounted(() => document.addEventListener('click', onClickOutside))
  onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

  /* ===== Modal Nueva Actividad ===== */
  const showNew = ref(false)
  const modalRef = ref(null)

  const onClickNewActivity = () => { showNew.value = true }
  const closeNew = () => { showNew.value = false }

  watch(showNew, v => {
    document.body.classList.toggle('modal-open', v)
  })

  /* ===== Datos de ejemplo ===== */
  const data = {
    day1: [
      { id: 1, type: 'registro', title: 'Registro y Bienvenida', time: '08:00 - 09:00', place: 'Entrada del salón', speaker: 'Director del salón', description: 'Acreditación de participantes y entrega de materiales', icon: 'mdi-magnify-scan' },
      { id: 2, type: 'conferencia', title: 'Inteligencia Artificial en el Futuro', time: '09:00 - 10:30', place: 'Auditorio Central', speaker: 'Dra. María González', description: 'Explorando tendencias emergentes en IA y su impacto en la sociedad', icon: 'mdi-presentation' },
      { id: 3, type: 'pausa', title: 'Pausa para el café', time: '10:30 - 11:00', place: 'Área de Networking', description: 'Pausa para networking y refrigerios', icon: 'mdi-coffee-outline' },
      { id: 4, type: 'conferencia', title: 'Blockchain y Criptomonedas', time: '11:00 - 12:30', place: 'Sala Beta', speaker: 'Ing. Carlos Rodríguez', description: 'Fundamentos y aplicaciones prácticas de la tecnología blockchain', icon: 'mdi-presentation' },
      { id: 5, type: 'taller', title: 'Taller: Desarrollo con React', time: '14:00 - 17:00', place: 'Laboratorio de Computación A', speaker: 'Ana Martínez', description: 'Sesión práctica de frontend con React y TypeScript', icon: 'mdi-laptop' }
    ],
    day2: [],
    day3: []
  }

  const currentItems = computed(() => data[selectedDay.value] || [])

  /* ===== Helpers UI ===== */
  const badgeClass = type => {
    switch ((type || '').toLowerCase()) {
      case 'conferencia': return 'badge--conference'
      case 'registro': return 'badge--register'
      case 'pausa': return 'badge--break'
      case 'taller': return 'badge--workshop'
      default: return 'badge--default'
    }
  }

  const iconClass = type => {
    switch ((type || '').toLowerCase()) {
      case 'conferencia': return 'icon--conference'
      case 'registro': return 'icon--register'
      case 'pausa': return 'icon--break'
      case 'taller': return 'icon--workshop'
      default: return 'icon--default'
    }
  }

  const typeLabel = type => {
    switch ((type || '').toLowerCase()) {
      case 'conferencia': return 'Conferencia'
      case 'registro': return 'Registro'
      case 'pausa': return 'Pausa'
      case 'taller': return 'Taller'
      default: return 'Actividad'
    }
  }

  const onEdit = item => console.log('Editar', item)
  const exportSchedule = () => console.log('Exportar cronograma de', selectedDay.value)

  /* ===== Crear nueva actividad ===== */
  const uid = () => Math.random().toString(36).slice(2, 9)

  const handleCreated = payload => {
    const iconByType = {
      taller: 'mdi-laptop',
      conferencia: 'mdi-presentation',
      registro: 'mdi-magnify-scan',
      pausa: 'mdi-coffee-outline',
      actividad: 'mdi-calendar-blank'
    }
    data[selectedDay.value].push({
      id: uid(),
      type: payload.type,
      title: payload.title,
      time: payload.time,
      place: payload.place,
      speaker: payload.speaker || '',
      description: payload.description || '',
      icon: iconByType[payload.type?.toLowerCase()] || 'mdi-calendar-blank'
    })
    closeNew()
  }

  return {
    dayOptions, dayDates,
    selectedDay, selectedDayLabel, selectedDayTitle, selectedDayDate,
    dayOpen, dayActive, dayRef, toggleDay, pickDay,

    showNew, modalRef, onClickNewActivity, closeNew,
    currentItems, badgeClass, iconClass, typeLabel,
    onEdit, exportSchedule, handleCreated
  }
}
