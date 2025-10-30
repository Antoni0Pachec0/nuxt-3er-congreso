// composables/workshop/use-workshops.js
import { ref, computed, onMounted } from 'vue'
import { WorkshopsApi } from '@/backend/workshop/workshops-api'
import { UsersApi } from '@/backend/user/users-api'
import { parseAxiosError } from '@/backend/http/error'
import { useAuthStore } from '@/security/stores/auth'

/** Mapea posibles valores del backend a etiqueta en español */
function toLevelLabel(levelRaw, name, descript) {
  const v = (levelRaw || '').toString().toLowerCase()
  if (['advanced','avanzado','avanzada'].includes(v)) return 'Avanzado'
  if (['intermediate','intermedio','intermedia'].includes(v)) return 'Intermedio'
  if (['beginner','principiante','básico','basico'].includes(v)) return 'Principiante'

  // Fallback heurístico (por si un taller viejo no trae level)
  const text = ((name || '') + ' ' + (descript || '')).toLowerCase()
  if (text.includes('avanzad') || text.includes('experto')) return 'Avanzado'
  if (text.includes('intermed')) return 'Intermedio'
  return 'Principiante'
}

function getGradient(levelLabel) {
  switch (levelLabel) {
    case 'Avanzado': return 'linear-gradient(135deg, #EF4444, #2563EB, #111827)'
    case 'Intermedio': return 'linear-gradient(135deg, #EAB308, #2563EB, #111827)'
    default: return 'linear-gradient(135deg, #22C55E, #2563EB, #111827)'
  }
}

function getIconKey(category) {
  const map = {
    'Inteligencia Artificial': 'Cpu',
    'Desarrollo Web': 'Code2',
    'Desarrollo Móvil': 'Smartphone',
    'Ciberseguridad': 'Shield',
    'Redes': 'Network',
    'Bases de Datos': 'Database',
    'Hardware y Soporte': 'Wrench',
    'Blockchain': 'Code2',
    'Calidad de Software': 'GitBranchPlus'
  }
  return map[category] || 'Code2'
}

function getFormattedDate() { return '12 y 13 de noviembre · 14:00 - 18:00' }

export function useWorkshops() {
  const workshops = ref([])
  const loading = ref(false)
  const error = ref('')
  const toast = ref({ show: false, type: 'success', message: '' })
  const showPaymentModal = ref(false)

  // modal confirmación
  const confirmModal = ref({
    open: false,
    loading: false,
    workshopId: null,
    workshopName: ''
  })

  const authStore = useAuthStore()
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const hasWorkshops = computed(() => workshops.value.length > 0)
  const userWorkshop = computed(() =>
    workshops.value.find(w => w.is_user_enrolled || w.enrollment_status === 'already_enrolled') || null
  )

  function mapWorkshopFromBackend(w) {
    if (!w) return null

    // Valores crudos backend
    const spotsMaxRaw = Number.isFinite(w.spots_max) ? w.spots_max : 0
    const spotsOccRaw = Number.isFinite(w.spots_occupied) ? w.spots_occupied : 0
    // Backend ya envía available_spots (unificado). Aseguramos no-negativo:
    const available = Number.isFinite(w.available_spots)
      ? Math.max(w.available_spots, 0)
      : (spotsMaxRaw > 0 ? Math.max(spotsMaxRaw - spotsOccRaw, 0) : Number.MAX_SAFE_INTEGER)

    // level: usar backend y normalizar etiqueta
    const levelLabel = toLevelLabel(w.level, w.name_workshop, w.descript)
    const category = w.category || null // si no viene, el UI lo mostrará vacío
    const gradient = getGradient(levelLabel)

    return {
      id: Number(w.workshop_id),
      name: w.name_workshop || 'Taller sin nombre',
      instructor: w.instructor_name || 'Instructor por confirmar',
      category: category || '—',
      description: w.descript || 'Descripción no disponible',
      duration: '4 horas',
      date: getFormattedDate(),
      location: (w.building && w.classroom) ? `${w.building} - ${w.classroom}` : 'Ubicación por confirmar',

      level: levelLabel,
      gradient,
      icon: getIconKey(category),

      tools: Array.isArray(w.tools) ? w.tools : [],

      spots_max: spotsMaxRaw,
      spots_occupied: spotsOccRaw,
      available_spots: available,
      status: w.status || 'active',

      is_user_enrolled: Boolean(w.is_user_enrolled),
      enrollment_status: w.enrollment_status || 'not_authenticated',
      button_text: w.button_text || 'Inscribirse',
      button_disabled: w.button_disabled ?? true,
      button_type: w.button_type || 'default',

      _raw: w
    }
  }

  function processApiResponse(resp) {
    if (Array.isArray(resp)) return resp.map(mapWorkshopFromBackend).filter(Boolean)
    if (resp && typeof resp === 'object') {
      const key = Object.keys(resp).find(k => Array.isArray(resp[k]))
      if (key) return resp[key].map(mapWorkshopFromBackend).filter(Boolean)
    }
    return []
  }

  // Botón por estado (mismo contrato que ya usas en el template)
  function getEnrollmentButton(workshop) {
    const alreadyInOne = Boolean(userWorkshop.value)
    const isThisUserWorkshop = alreadyInOne && userWorkshop.value?.id === workshop.id

    if (!isAuthenticated.value) {
      return { showButton: false, text: '', disabled: true, variant: 'hidden', action: null, tooltip: '' }
    }

    if (alreadyInOne) {
      if (isThisUserWorkshop) {
        return { showButton: true, text: 'Seleccionado', disabled: true, variant: 'selected', action: null, tooltip: 'Ya estás inscrito en este taller' }
      }
      return { showButton: false, text: '', disabled: true, variant: 'locked-by-other', action: null, tooltip: 'Ya tienes un taller' }
    }

    switch (workshop.enrollment_status) {
      case 'already_enrolled':
        return { showButton: true, text: 'Seleccionado', disabled: true, variant: 'selected', action: null, tooltip: 'Ya estás inscrito' }

      case 'can_enroll': {
        const hasCupo = workshop.spots_max === 0 || workshop.available_spots > 0 || workshop.available_spots === Number.MAX_SAFE_INTEGER
        if (!hasCupo) return { showButton: true, text: 'Cupo lleno', disabled: true, variant: 'disabled', action: null, tooltip: 'Sin cupos' }
        return {
          showButton: true,
          text: 'Inscribirme',
          disabled: false,
          variant: 'enroll',
          action: () => openConfirm(workshop.id, workshop.name),
          tooltip: 'Confirmar inscripción'
        }
      }

      case 'needs_payment':
        return {
          showButton: true,
          text: 'Completar pago',
          disabled: false,
          variant: 'needs-payment',
          action: () => { showPaymentModal.value = true },
          tooltip: 'Requiere pago verificado'
        }

      case 'no_spots':
        return { showButton: true, text: 'Cupo lleno', disabled: true, variant: 'disabled', action: null, tooltip: 'Sin cupos' }

      default:
        return { showButton: false, text: '', disabled: true, variant: 'hidden', action: null, tooltip: '' }
    }
  }

  function openConfirm(id, name) {
    confirmModal.value = { open: true, loading: false, workshopId: id, workshopName: name || '' }
  }
  function closeConfirm() {
    confirmModal.value = { open: false, loading: false, workshopId: null, workshopName: '' }
  }

  async function confirmEnroll() {
    if (!confirmModal.value.workshopId) return
    try {
      confirmModal.value.loading = true
      await UsersApi.enrollMyWorkshop(confirmModal.value.workshopId)
      showToast('Inscripción realizada correctamente', 'success')
      closeConfirm()
      await loadWorkshops()
    } catch (err) {
      showToast(parseAxiosError(err), 'error')
    } finally {
      confirmModal.value.loading = false
    }
  }

  async function enrollInWorkshop(workshopId) {
    openConfirm(workshopId)
  }

  async function loadWorkshops() {
    loading.value = true
    error.value = ''
    try {
      const resp = isAuthenticated.value ? await WorkshopsApi.getAll() : await WorkshopsApi.getPublic()
      workshops.value = processApiResponse(resp)
    } catch (err) {
      const msg = parseAxiosError(err)
      error.value = msg
      workshops.value = []
      showToast(msg, 'error')
    } finally {
      loading.value = false
    }
  }

  function showToast(message, type = 'success') {
    toast.value = { show: true, type, message }
    window.setTimeout(() => { toast.value = { ...toast.value, show: false } }, 4000)
  }

  onMounted(() => { loadWorkshops() })

  return {
    workshops, loading, error, toast, showPaymentModal,
    hasWorkshops, isAuthenticated, userWorkshop,
    loadWorkshops, getEnrollmentButton, enrollInWorkshop,
    confirmModal, openConfirm, closeConfirm, confirmEnroll,
    showToast,
  }
}
