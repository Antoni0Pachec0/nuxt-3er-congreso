// composables/workshops/use-workshops.js - Versión sin datos de prueba
import { ref, computed, onMounted } from 'vue'
import { WorkshopsApi } from '@/backend/workshop/workshops-api'
import { parseAxiosError } from '@/backend/http/error'
import { useAuthStore } from '@/security/stores/auth'

export function useWorkshops() {
  // State
  const workshops = ref([])
  const loading = ref(false)
  const error = ref('')
  const toast = ref({ show: false, type: 'success', message: '' })
  const showPaymentModal = ref(false)
  const authStore = useAuthStore()

  // Computed
  const hasWorkshops = computed(() => workshops.value.length > 0)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  
  // Buscar el taller en el que el usuario está inscrito
  const userWorkshop = computed(() => {
    return workshops.value.find(w => w.is_user_enrolled) || null
  })
  
  // Verificar si el usuario tiene pago aprobado
  const hasPayment = computed(() => {
    const workshopWithPaymentStatus = workshops.value.find(w => 
      w.enrollment_status === 'can_enroll' || w.enrollment_status === 'already_enrolled'
    )
    return !!workshopWithPaymentStatus
  })
  
  const availableWorkshops = computed(() => 
    workshops.value.filter(w => {
      const spotsMax = w.spots_max || 0
      const spotsOccupied = w.spots_occupied || 0
      return spotsMax === 0 || spotsOccupied < spotsMax
    })
  )

  // Mapear datos del backend al formato del frontend
  function mapWorkshopFromBackend(workshop) {
    if (!workshop) return null;

    console.log('🗺️ [useWorkshops] Mapeando taller:', workshop);

    // Mapeo de niveles basado en el nombre o descripción
    const getLevel = (name, description) => {
      const text = ((name || '') + ' ' + (description || '')).toLowerCase()
      if (text.includes('avanzado') || text.includes('avanzada') || text.includes('experto')) 
        return 'Avanzado'
      if (text.includes('intermedio') || text.includes('intermedia')) 
        return 'Intermedio'
      return 'Principiante'
    }

    // Mapeo de categorías basado en la descripción
    const getCategory = (description) => {
      const desc = (description || '').toLowerCase()
      if (desc.includes('ia') || desc.includes('inteligencia artificial') || desc.includes('modelo')) 
        return 'Inteligencia Artificial'
      if (desc.includes('web') || desc.includes('pwa') || desc.includes('vue')) 
        return 'Desarrollo Web'
      if (desc.includes('móvil') || desc.includes('mobile') || desc.includes('app')) 
        return 'Desarrollo Móvil'
      if (desc.includes('seguridad') || desc.includes('hacking') || desc.includes('forense')) 
        return 'Ciberseguridad'
      if (desc.includes('red') || desc.includes('vrf') || desc.includes('fibra')) 
        return 'Redes'
      if (desc.includes('base de datos') || desc.includes('mongodb') || desc.includes('nosql')) 
        return 'Bases de Datos'
      if (desc.includes('hardware') || desc.includes('pc') || desc.includes('laptop')) 
        return 'Hardware y Soporte'
      if (desc.includes('blockchain') || desc.includes('contrato inteligente')) 
        return 'Blockchain'
      if (desc.includes('calidad') || desc.includes('prueba') || desc.includes('test')) 
        return 'Calidad de Software'
      return 'Desarrollo Backend'
    }

    // Gradientes por nivel
    const getGradient = (level) => {
      switch (level) {
        case 'Avanzado': return 'linear-gradient(135deg, #EF4444, #2563EB, #111827)'
        case 'Intermedio': return 'linear-gradient(135deg, #EAB308, #2563EB, #111827)'
        default: return 'linear-gradient(135deg, #22C55E, #2563EB, #111827)'
      }
    }

    // Iconos por categoría
    const getIcon = (category) => {
      const icons = {
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
      return icons[category] || 'Code2'
    }

    // Formatear fecha y hora desde el backend si está disponible
    const getFormattedDate = () => {
      // Por ahora usamos fechas estáticas, pero puedes adaptar esto
      // para usar datos reales del schedule si están disponibles
      return '12 y 13 de noviembre · 14:00 - 18:00'
    }

    const level = getLevel(workshop.name_workshop, workshop.descript)
    const category = getCategory(workshop.descript)

    const mappedWorkshop = {
      id: Number(workshop.workshop_id),
      name: workshop.name_workshop || 'Taller sin nombre',
      instructor: workshop.instructor_name || 'Instructor por confirmar',
      category: category,
      description: workshop.descript || 'Descripción no disponible',
      duration: '4 horas', // Puedes obtener esto del schedule si está disponible
      date: getFormattedDate(),
      location: (workshop.building && workshop.classroom) 
        ? `${workshop.building} - ${workshop.classroom}`
        : 'Ubicación por confirmar',
      level: level,
      gradient: getGradient(level),
      icon: getIcon(category),
      spots_max: workshop.spots_max || 0,
      spots_occupied: workshop.spots_occupied || 0,
      available_spots: workshop.available_spots || 0,
      status: workshop.status || 'active',
      // Campos de estado de inscripción del backend
      is_user_enrolled: workshop.is_user_enrolled || false,
      can_enroll: workshop.can_enroll || false,
      enrollment_status: workshop.enrollment_status || 'not_authenticated',
      button_text: workshop.button_text || 'Inscribirse',
      button_disabled: workshop.button_disabled || true,
      button_type: workshop.button_type || 'default',
      // Campos originales del backend
      _raw: workshop
    }

    console.log('✅ [useWorkshops] Taller mapeado:', mappedWorkshop);
    return mappedWorkshop;
  }

  // Procesar respuesta del backend
  function processApiResponse(response) {
    console.log('📨 [useWorkshops] Procesando respuesta del API:', response);
    
    // Si la respuesta es directamente un array
    if (Array.isArray(response)) {
      console.log('📊 [useWorkshops] Respuesta es array directo, procesando...');
      const processed = response.map(mapWorkshopFromBackend).filter(Boolean);
      console.log(`✅ [useWorkshops] Procesados ${processed.length} talleres`);
      return processed;
    }
    
    // Si es un objeto con alguna propiedad que sea array
    if (response && typeof response === 'object') {
      // Buscar cualquier propiedad que sea array
      const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));
      
      if (arrayKeys.length > 0) {
        console.log(`📊 [useWorkshops] Encontrada propiedad array: ${arrayKeys[0]}`);
        const arrayData = response[arrayKeys[0]];
        const processed = arrayData.map(mapWorkshopFromBackend).filter(Boolean);
        console.log(`✅ [useWorkshops] Procesados ${processed.length} talleres desde ${arrayKeys[0]}`);
        return processed;
      }
    }
    
    console.warn('⚠️ [useWorkshops] No se pudo procesar la respuesta, retornando array vacío');
    return [];
  }

  // Determinar el texto y estado del botón según el estado de inscripción
  function getEnrollmentButton(workshop) {
    if (!workshop) {
      return {
        text: 'Error',
        disabled: true,
        variant: 'disabled',
        action: null,
        tooltip: 'Error cargando taller'
      }
    }

    console.log(`🎯 [useWorkshops] Estado de inscripción para taller ${workshop.id}:`, workshop.enrollment_status);

    // Usar los estados del backend directamente
    switch (workshop.enrollment_status) {
      case 'already_enrolled':
        return {
          text: workshop.button_text || '✅ Seleccionado',
          disabled: workshop.button_disabled !== false,
          variant: 'selected',
          action: null,
          tooltip: 'Ya estás inscrito en este taller'
        }
      case 'can_enroll':
        const isAvailable = workshop.available_spots > 0 || workshop.spots_max === 0
        return {
          text: workshop.button_text || (isAvailable ? 'Inscribirse' : 'Cupo lleno'),
          disabled: workshop.button_disabled !== false || !isAvailable,
          variant: isAvailable ? 'enroll' : 'disabled',
          action: isAvailable ? () => enrollInWorkshop(workshop.id) : null,
          tooltip: isAvailable ? 'Haz clic para inscribirte' : 'Este taller ya no tiene cupos disponibles'
        }
      case 'needs_payment':
        return {
          text: workshop.button_text || 'Completar Pago',
          disabled: workshop.button_disabled !== false,
          variant: 'needs-payment',
          action: () => showPaymentModal.value = true,
          tooltip: 'Requiere pago del congreso para inscribirse'
        }
      case 'not_authenticated':
      default:
        return {
          text: workshop.button_text || 'Inscribirse',
          disabled: workshop.button_disabled !== false,
          variant: 'login-required',
          action: null,
          tooltip: 'Inicia sesión para inscribirte'
        }
    }
  }

  // Inscribirse en taller
  async function enrollInWorkshop(workshopId) {
    if (!isAuthenticated.value) {
      showToast('Debes iniciar sesión para inscribirte', 'error')
      return
    }

    try {
      // TODO: Conectar con el endpoint del módulo de usuarios
      // await UsersApi.enrollInWorkshop(workshopId)
      
      // Por ahora solo mostramos un mensaje
      showToast('Función de inscripción en desarrollo. Pronto podrás inscribirte en talleres.', 'info')
      console.log(`📝 [useWorkshops] Intentando inscribirse en taller ${workshopId}`);
      
      // Recargar los talleres para actualizar el estado
      await loadWorkshops()
      
    } catch (err) {
      const errorMessage = parseAxiosError(err)
      showToast(errorMessage, 'error')
      console.error('❌ [useWorkshops] Error inscribiéndose en taller:', err)
    }
  }

  // Cargar talleres (con autenticación si existe)
  async function loadWorkshops() {
    loading.value = true
    error.value = ''
    console.log('🔄 [useWorkshops] Iniciando carga de talleres...');

    try {
      console.log('🔐 [useWorkshops] Estado autenticación:', isAuthenticated.value);
      
      let response
      if (isAuthenticated.value) {
        console.log('👤 [useWorkshops] Cargando talleres autenticados...');
        response = await WorkshopsApi.getAll()
      } else {
        console.log('👥 [useWorkshops] Cargando talleres públicos...');
        response = await WorkshopsApi.getPublic()
      }
      
      console.log('📦 [useWorkshops] Respuesta cruda recibida:', response);
      
      // Procesar la respuesta
      const processedWorkshops = processApiResponse(response)
      
      if (processedWorkshops.length > 0) {
        workshops.value = processedWorkshops
        console.log(`🎉 [useWorkshops] ${workshops.value.length} talleres cargados exitosamente`);
        showToast(`${workshops.value.length} talleres cargados`, 'success')
      } else {
        workshops.value = []
        console.log('ℹ️ [useWorkshops] No se encontraron talleres activos');
        showToast('No se encontraron talleres activos', 'info')
      }
      
    } catch (err) {
      const errorMessage = parseAxiosError(err)
      error.value = errorMessage
      console.error('❌ [useWorkshops] Error completo cargando talleres:', err)
      showToast(errorMessage, 'error')
      workshops.value = []
    } finally {
      loading.value = false
      console.log('🏁 [useWorkshops] Carga de talleres completada');
    }
  }

  // Cargar talleres disponibles
  async function loadAvailableWorkshops() {
    loading.value = true
    error.value = ''

    try {
      let response
      if (isAuthenticated.value) {
        response = await WorkshopsApi.getAvailable()
      } else {
        response = await WorkshopsApi.getPublicAvailable()
      }
      
      // Procesar la respuesta
      const processedWorkshops = processApiResponse(response)
      
      if (processedWorkshops.length > 0) {
        workshops.value = processedWorkshops
        showToast(`${workshops.value.length} talleres disponibles cargados`, 'success')
      } else {
        workshops.value = []
        showToast('No se encontraron talleres disponibles', 'info')
      }
    } catch (err) {
      const errorMessage = parseAxiosError(err)
      error.value = errorMessage
      showToast(errorMessage, 'error')
      console.error('Error cargando talleres disponibles:', err)
      workshops.value = []
    } finally {
      loading.value = false
    }
  }

  // Mostrar toast
  function showToast(message, type = 'success') {
    toast.value = { show: true, type, message }
    setTimeout(() => {
      toast.value.show = false
    }, 5000)
  }

  // Cargar datos al montar el componente
  onMounted(() => {
    console.log('🚀 [useWorkshops] Composable montado, cargando talleres...');
    loadWorkshops()
  })

  return {
    // State
    workshops,
    loading,
    error,
    toast,
    showPaymentModal,
    
    // Computed
    hasWorkshops,
    availableWorkshops,
    isAuthenticated,
    userWorkshop,
    hasPayment,
    
    // Methods
    loadWorkshops,
    loadAvailableWorkshops,
    getEnrollmentButton,
    enrollInWorkshop,
    showToast
  }
}