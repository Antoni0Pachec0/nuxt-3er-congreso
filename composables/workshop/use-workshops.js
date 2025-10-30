// composables/workshop/use-workshops.js
import { ref, computed, onMounted } from 'vue'
import { WorkshopsApi } from '@/backend/workshop/workshops-api'
import { parseAxiosError } from '@/backend/http/error'
import { useAuthStore } from '@/security/stores/auth'

export function useWorkshops() {
  // ── state
  const workshops = ref([])
  const loading = ref(false)
  const error = ref('')
  const toast = ref({ show: false, type: 'success', message: '' })
  const showPaymentModal = ref(false)

  // ── auth
  const authStore = useAuthStore()
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  // ── derived
  const hasWorkshops = computed(() => workshops.value.length > 0)

  // “mi taller” (si back marca alguno como already_enrolled / is_user_enrolled)
  const userWorkshop = computed(() =>
    workshops.value.find(w => w.is_user_enrolled || w.enrollment_status === 'already_enrolled') || null
  )

  // ── helpers de presentación
  const getLevel = (name, description) => {
    const text = ((name || '') + ' ' + (description || '')).toLowerCase()
    if (text.includes('avanzad') || text.includes('experto')) return 'Avanzado'
    if (text.includes('intermed')) return 'Intermedio'
    return 'Principiante'
  }

  const getCategory = (description) => {
    const d = (description || '').toLowerCase()
    if (d.includes('ia') || d.includes('inteligencia artificial') || d.includes('modelo')) return 'Inteligencia Artificial'
    if (d.includes('web') || d.includes('pwa') || d.includes('vue')) return 'Desarrollo Web'
    if (d.includes('móvil') || d.includes('mobile') || d.includes('app')) return 'Desarrollo Móvil'
    if (d.includes('seguridad') || d.includes('hacking') || d.includes('forense')) return 'Ciberseguridad'
    if (d.includes('red') || d.includes('vrf') || d.includes('fibra')) return 'Redes'
    if (d.includes('base de datos') || d.includes('mongodb') || d.includes('nosql')) return 'Bases de Datos'
    if (d.includes('hardware') || d.includes('pc') || d.includes('laptop')) return 'Hardware y Soporte'
    if (d.includes('blockchain') || d.includes('contrato inteligente')) return 'Blockchain'
    if (d.includes('calidad') || d.includes('prueba') || d.includes('test')) return 'Calidad de Software'
    return 'Desarrollo Backend'
  }

  const getGradient = (level) => {
    switch (level) {
      case 'Avanzado': return 'linear-gradient(135deg, #EF4444, #2563EB, #111827)'
      case 'Intermedio': return 'linear-gradient(135deg, #EAB308, #2563EB, #111827)'
      default: return 'linear-gradient(135deg, #22C55E, #2563EB, #111827)'
    }
  }

  const getIconKey = (category) => {
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

  const getFormattedDate = () => '12 y 13 de noviembre · 14:00 - 18:00'

  // ── mapping sólido (no asume que vengan todos los campos)
  function mapWorkshopFromBackend(w) {
    if (!w) return null

    const level = getLevel(w.name_workshop, w.descript)
    const category = getCategory(w.descript)

    const spotsMax = Number.isFinite(w.spots_max) ? w.spots_max : 0
    const spotsOcc = Number.isFinite(w.spots_occupied) ? w.spots_occupied : 0

    // disponible: si spots_max==0/NULL => ilimitado
    const available = Number.isFinite(w.available_spots)
      ? Math.max(w.available_spots, 0)
      : (spotsMax > 0 ? Math.max(spotsMax - spotsOcc, 0) : Number.MAX_SAFE_INTEGER)

    return {
      id: Number(w.workshop_id),
      name: w.name_workshop || 'Taller sin nombre',
      instructor: w.instructor_name || 'Instructor por confirmar',
      category,
      description: w.descript || 'Descripción no disponible',
      duration: '4 horas',
      date: getFormattedDate(),
      location: (w.building && w.classroom) ? `${w.building} - ${w.classroom}` : 'Ubicación por confirmar',
      level,
      gradient: getGradient(level),
      icon: getIconKey(category),

      spots_max: spotsMax, // 0 => ilimitado
      spots_occupied: spotsOcc,
      available_spots: available,
      status: w.status || 'active',

      // estados backend
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
    // si llega string u otra cosa => vacío
    return []
  }

  // ── botón por estado
  function getEnrollmentButton(workshop) {
    const alreadyInOne = Boolean(userWorkshop.value)
    const isThisUserWorkshop = alreadyInOne && userWorkshop.value?.id === workshop.id

    if (!isAuthenticated.value) {
      return { showButton: true, text: 'Inicia sesión', disabled: true, variant: 'login-required', action: null, tooltip: 'Inicia sesión para inscribirte' }
    }

    if (alreadyInOne) {
      if (isThisUserWorkshop) {
        return { showButton: true, text: '✅ Seleccionado', disabled: true, variant: 'selected', action: null, tooltip: 'Ya estás inscrito en este taller' }
      }
      // Ya tiene otro taller => ocultamos botón para evitar confusión
      return { showButton: false, text: '', disabled: true, variant: 'locked-by-other', action: null, tooltip: 'Ya tienes un taller asignado' }
    }

    switch (workshop.enrollment_status) {
      case 'already_enrolled':
        return { showButton: true, text: '✅ Seleccionado', disabled: true, variant: 'selected', action: null, tooltip: 'Ya estás inscrito en este taller' }

      case 'can_enroll': {
        const hasCupo = workshop.spots_max === 0 || workshop.available_spots > 0 || workshop.available_spots === Number.MAX_SAFE_INTEGER
        if (!hasCupo) {
          return { showButton: true, text: 'Cupo lleno', disabled: true, variant: 'disabled', action: null, tooltip: 'Este taller ya no tiene cupos' }
        }
        return { showButton: true, text: 'Inscribirse', disabled: false, variant: 'enroll', action: () => enrollInWorkshop(workshop.id), tooltip: 'Haz clic para inscribirte' }
      }

      case 'needs_payment':
        return { showButton: true, text: 'Completar Pago', disabled: false, variant: 'needs-payment', action: () => { showPaymentModal.value = true }, tooltip: 'Requiere pago del congreso' }

      case 'no_spots':
        return { showButton: true, text: 'Cupo lleno', disabled: true, variant: 'disabled', action: null, tooltip: 'Este taller ya no tiene cupos' }

      case 'not_authenticated':
      default:
        return { showButton: true, text: 'Inicia sesión', disabled: true, variant: 'login-required', action: null, tooltip: 'Inicia sesión para inscribirte' }
    }
  }

  async function enrollInWorkshop(workshopId) {
    if (!isAuthenticated.value) {
      showToast('Debes iniciar sesión para inscribirte', 'error')
      return
    }
    // TODO: conectar a endpoint real de inscripción
    showToast('Función de inscripción en desarrollo.', 'info')
    await loadWorkshops()
  }

  // ── cargar SIEMPRE TODOS (auth => /workshops, guest => /workshops/public)
  async function loadWorkshops() {
    loading.value = true
    error.value = ''
    try {
      const resp = isAuthenticated.value ? await WorkshopsApi.getAll() : await WorkshopsApi.getPublic()
      const processed = processApiResponse(resp)
      workshops.value = processed
      if (processed.length === 0) {
        // En vez de “No se encontraron”, muestra algo amigable y sin bloquear
        showToast('No se encontraron talleres activos', 'info')
      }
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
    workshops,
    loading,
    error,
    toast,
    showPaymentModal,

    hasWorkshops,
    isAuthenticated,
    userWorkshop,

    loadWorkshops,
    getEnrollmentButton,
    enrollInWorkshop,
    showToast,
  }
}
