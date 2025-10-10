// features/auth/use-register.js
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { R } from '@/utils/app-routes'
import { AuthApi } from '@/backend/auth/register-api'
import { parseAxiosError } from '@/backend/http/error'
//import { notifyError, notifyWarning, notifyLoading } from '@/utils/notifications'

export function useRegister() {
  const router = useRouter()
  const STORAGE_KEY = "register_form_v7"

  // Estados reactivos
  const step = ref(0)
  const showPass = ref(false)
  const showPass2 = ref(false)
  const showSecretPass = ref(false)
  const password2 = ref('')
  const loading = ref(false)
  const accepted = ref(false)
  const showTermsModal = ref(false)
  const passwordTouched = ref(false)
  const secretValidated = ref(false)
  const secretValidating = ref(false)
  const stepperRef = ref(null)

  // Estados para países/teléfonos
  const isOpen = ref({ main: false, emergency: false })
  const selectedCountryCode = ref('mx')
  const emergencyCountryCode = ref('mx')

  // Formulario
  const form = ref({
    email: '',
    password_user: '',
    name_user: '',
    paternal_surname: '',
    maternal_surname: '',
    phone: '',
    phone_country: '',
    emergency_phone: '',
    emergency_phone_country: '',
    type_user_id: null,
    provenance: '',
    matricula: '',
    educational_program: '',
    grade: '',
    group_user: '',
    universidad_procedencia: '',
    secret_password: '',
    empresa_procedencia: '',
    rol_dentro_empresa: '',
    descripcion_biografia: '',
    tipo_presentacion: '',
    titulo_conferencia: '',
    descripcion_conferencia: '',
    titulo_taller: '',
    descripcion_taller: '',
    facebook_link: '',
    instagram_link: '',
    x_link: '',
    linkedin_link: '',
    size_user: ''
  })

  // Stepper configuration
  const baseSteps = [
    { key: 'account', label: 'Cuenta' },
    { key: 'personal', label: 'Datos personales' },
    { key: 'user_type', label: 'Tipo de usuario' },
    { key: 'final', label: 'Finalizar' }
  ]

  const speakerSteps = [
    { key: 'account', label: 'Cuenta' },
    { key: 'personal', label: 'Datos personales' },
    { key: 'user_type', label: 'Tipo de usuario' },
    { key: 'speaker_data', label: 'Datos Ponente' },
    { key: 'social_media', label: 'Redes Sociales' },
    { key: 'final', label: 'Finalizar' }
  ]

  const steps = ref([...baseSteps])

  // Computed properties
  const isSpeaker = computed(() => form.value.type_user_id === 4)
  const isStudentOrTeacher = computed(() => [1, 2].includes(Number(form.value.type_user_id)))
  const isSecretPasswordValid = computed(() => (form.value.secret_password || '').trim().length > 0)
  
  // Password strength
  const reqs = ref({ len: false, upper: false, lower: false, num: false, sym: false })
  const pwdMatch = computed(() => password2.value === form.value.password_user && password2.value.length > 0)
  const strengthScore = computed(() => {
    const validCount = Object.values(reqs.value).filter(Boolean).length
    return validCount
  })
  const strengthPercent = computed(() => `${(strengthScore.value / 5) * 100}%`)
  const strengthLabel = computed(() => {
    const score = strengthScore.value
    if (score <= 2) return 'Muy débil'
    if (score === 3) return 'Media'
    if (score === 4) return 'Fuerte'
    return 'Excelente'
  })

  // Stepper navigation
  const isLastStep = computed(() => step.value === steps.value.length - 1)
  const canSubmit = computed(() => isLastStep.value && !!form.value.size_user && accepted.value)

  // Validaciones
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  function isValidPhone(phone) {
    return /^\d{10}$/.test(phone)
  }

  const canProceed = computed(() => {
    switch (step.value) {
      case 0:
        return (
          !!form.value.email &&
          isValidEmail(form.value.email) &&
          form.value.password_user.length >= 8 &&
          strengthScore.value >= 3 &&
          pwdMatch.value
        )
      case 1:
        return (
          !!form.value.name_user &&
          !!form.value.paternal_surname &&
          !!form.value.maternal_surname &&
          !!form.value.phone &&
          isValidPhone(form.value.phone)
        )
      case 2: {
        if (!form.value.type_user_id) return false
        if (isSpeaker.value) return secretValidated.value
        
        const t = Number(form.value.type_user_id)
        if (t === 3) return true
        
        const prov = (form.value.provenance || '').toLowerCase()
        const isStudent = t === 1, isTeacher = t === 2

        if ((isStudent || isTeacher) && prov === 'uttecam') {
          const hasMat = !!form.value.matricula
          const hasProg = !!form.value.educational_program
          if (isStudent) {
            const validGrade = typeof form.value.grade === 'string' && form.value.grade.length >= 1 && form.value.grade.length <= 2
            const validGroup = typeof form.value.group_user === 'string' && form.value.group_user.length === 1
            return hasMat && hasProg && validGrade && validGroup
          }
          return hasMat && hasProg
        }
        if ((isStudent || isTeacher) && prov === 'otra') {
          return !!form.value.universidad_procedencia
        }
        return true
      }
      case 3:
        if (isSpeaker.value) {
          const hasBio = !!form.value.empresa_procedencia && !!form.value.rol_dentro_empresa && !!form.value.descripcion_biografia
          const tp = form.value.tipo_presentacion
          const confOk = tp === 'conferencia' && !!form.value.titulo_conferencia && !!form.value.descripcion_conferencia
          const tallOk = tp === 'taller' && !!form.value.titulo_taller && !!form.value.descripcion_taller
          const ambasOk = tp === 'ambas' && !!form.value.titulo_conferencia && !!form.value.descripcion_conferencia && !!form.value.titulo_taller && !!form.value.descripcion_taller
          return hasBio && (confOk || tallOk || ambasOk)
        }
        return true
      case 4:
        return true
      case 5:
        return isSpeaker.value && !!form.value.size_user && accepted.value
      default:
        return true
    }
  })

  // Métodos de UI
  function touchPwd() { passwordTouched.value = true }

  function centerActiveStep() {
    nextTick(() => {
      const el = stepperRef.value?.querySelectorAll('.step')[step.value]
      el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    })
  }

  function prevStep() { 
    if (step.value > 0) step.value-- 
  }

  function goLogin() {
    router.push(R.to('login'))
  }

  // Persistencia
  const PERSIST_KEYS = [
    'email', 'password_user', 'secret_password', 'name_user', 'paternal_surname', 'maternal_surname',
    'phone', 'phone_country', 'emergency_phone', 'emergency_phone_country', 'type_user_id', 'provenance',
    'matricula', 'educational_program', 'grade', 'group_user', 'universidad_procedencia', 'empresa_procedencia',
    'rol_dentro_empresa', 'descripcion_biografia', 'tipo_presentacion', 'titulo_conferencia', 'descripcion_conferencia',
    'titulo_taller', 'descripcion_taller', 'facebook_link', 'instagram_link', 'x_link', 'linkedin_link', 'size_user'
  ]

  const persistable = computed(() => {
    const out = {}
    for (const k of PERSIST_KEYS) out[k] = form.value[k] ?? ''
    return out
  })

  // Países y Teléfonos
  const countries = ref([
    { code: 'mx', name: 'México', phoneCode: '+52' },
    { code: 'us', name: 'Estados Unidos', phoneCode: '+1' },
    { code: 'ca', name: 'Canadá', phoneCode: '+1' },
    { code: 'es', name: 'España', phoneCode: '+34' },
    { code: 'ar', name: 'Argentina', phoneCode: '+54' },
    { code: 'co', name: 'Colombia', phoneCode: '+57' },
    { code: 'cl', name: 'Chile', phoneCode: '+56' },
  ])

  const getPhoneCode = (code) => countries.value.find(c => c.code === code)?.phoneCode || '+52'

  const toggleDropdown = (type) => {
    const other = type === 'main' ? 'emergency' : 'main'
    if (isOpen.value[other]) isOpen.value[other] = false
    isOpen.value[type] = !isOpen.value[type]
  }

  const selectCountry = (country, type) => {
    if (type === 'main') {
      selectedCountryCode.value = country.code
      form.value.phone_country = country.phoneCode
      isOpen.value.main = false
    } else {
      emergencyCountryCode.value = country.code
      form.value.emergency_phone_country = country.phoneCode
      isOpen.value.emergency = false
    }
  }

  // Validación de Ponente
  async function validateSpeakerSecret() {
    if (!isSpeaker.value) return true
    const secret = (form.value.secret_password || '').trim()
    if (!secret) {
      notifyWarning('Contraseña requerida', 'Ingresa la contraseña de ponente.')
      return false
    }

    try {
      secretValidating.value = true
      await AuthApi.validateSpeakerSecret({ secret_password: secret })
      secretValidated.value = true
      return true
    } catch (err) {
      secretValidated.value = false
      const msg = err?.response?.data?.message || 'Contraseña de ponente inválida'
      notifyError('Contraseña inválida', msg)
      return false
    } finally {
      secretValidating.value = false
    }
  }

  // Navegación y Submit
  async function nextOrSubmit() {
    if (!canProceed.value) {
      notifyWarning('Campos incompletos', 'Revisa los campos requeridos antes de continuar.')
      return
    }

    if (step.value === 2 && isSpeaker.value && !secretValidated.value) {
      const ok = await validateSpeakerSecret()
      if (!ok) return
    }

    if (isLastStep.value) {
      await submitRegister()
    } else {
      step.value++
    }
  }

  function resetFields(keys) {
    for (const k of keys) form.value[k] = ''
  }

  function toE164(code, local) {
    const pref = code?.startsWith('+') ? code : `+${code || ''}`
    const digits = (local || '').replace(/\D/g, '')
    return `${pref}${digits}`
  }

  function normalizePayload(payload) {
    const finalPayload = {
      email: payload.email?.trim().toLowerCase(),
      password_user: payload.password_user,
      name_user: payload.name_user?.trim(),
      paternal_surname: payload.paternal_surname?.trim(),
      maternal_surname: payload.maternal_surname?.trim(),
      type_user_id: Number(payload.type_user_id),
      size_user: String(payload.size_user || '').toUpperCase(),
    }

    // Teléfonos
    if (payload.phone_country && payload.phone) {
      finalPayload.phone = toE164(payload.phone_country, payload.phone)
    }
    if ((payload.emergency_phone || '').trim()) {
      finalPayload.emergency_phone = toE164(
        payload.emergency_phone_country,
        payload.emergency_phone
      )
    }

    const userType = Number(payload.type_user_id)
    const provOpt = (payload.provenance || '').toLowerCase()

    // Estudiante / Docente
    if ([1, 2].includes(userType)) {
      if (provOpt === 'uttecam') {
        finalPayload.provenance = 'uttecam'
        finalPayload.matricula = payload.matricula?.trim() || ''
        finalPayload.educational_program = payload.educational_program?.trim() || ''
        if (userType === 1) {
          finalPayload.grade = payload.grade?.trim() || ''
          finalPayload.group_user = payload.group_user?.trim().toUpperCase() || ''
        }
      } else if (provOpt === 'otra') {
        finalPayload.provenance = 'otra'
        finalPayload.universidad_procedencia = payload.universidad_procedencia?.trim() || ''
      }
    }

    // Externo
    if (userType === 3) {
      finalPayload.provenance = 'externo'
    }

    // Ponente
    if (userType === 4) {
      finalPayload.secret_password = payload.secret_password?.trim() || ''
      finalPayload.empresa_procedencia = payload.empresa_procedencia?.trim() || ''
      finalPayload.rol_dentro_empresa = payload.rol_dentro_empresa?.trim() || ''
      finalPayload.descripcion_biografia = payload.descripcion_biografia?.trim() || ''
      finalPayload.tipo_presentacion = payload.tipo_presentacion || ''

      if (['conferencia', 'ambas'].includes(payload.tipo_presentacion)) {
        finalPayload.titulo_conferencia = payload.titulo_conferencia?.trim() || ''
        finalPayload.descripcion_conferencia = payload.descripcion_conferencia?.trim() || ''
      }
      if (['taller', 'ambas'].includes(payload.tipo_presentacion)) {
        finalPayload.titulo_taller = payload.titulo_taller?.trim() || ''
        finalPayload.descripcion_taller = payload.descripcion_taller?.trim() || ''
      }

      if ((payload.facebook_link || '').trim()) finalPayload.facebook_link = payload.facebook_link.trim()
      if ((payload.instagram_link || '').trim()) finalPayload.instagram_link = payload.instagram_link.trim()
      if ((payload.x_link || '').trim()) finalPayload.x_link = payload.x_link.trim()
      if ((payload.linkedin_link || '').trim()) finalPayload.linkedin_link = payload.linkedin_link.trim()
    }

    return finalPayload
  }

  async function submitRegister() {
    if (loading.value) return
    if (!canSubmit.value) {
      notifyWarning('Formulario incompleto', 'Debes aceptar los términos y elegir tu talla.')
      return
    }

    loading.value = true
    const loadingToast = notifyLoading('Procesando', 'Creando tu cuenta...')

    try {
      const payload = normalizePayload(form.value)
      const response = await AuthApi.register(payload)

      if (response?.email_sent && response?.user) {
        sessionStorage.setItem('verify_email', payload.email)
        localStorage.setItem('verify_email', payload.email)
        localStorage.setItem('verification_purpose', 'email_verification')
        localStorage.removeItem(STORAGE_KEY)

        loadingToast.resolve({
          title: '¡Registro exitoso!',
          message: response.message || 'Cuenta creada correctamente. Revisa tu correo para el código de verificación.'
        })

        setTimeout(() => {
          router.push(R.to('verify'))
        }, 1500)
        return
      }

      if (response?.already_exists && response?.email_sent) {
        sessionStorage.setItem('verify_email', payload.email)
        loadingToast.resolve({
          title: 'Registro pendiente',
          message: response.message || 'Este correo ya tenía un registro pendiente. Te reenviamos el código de verificación.'
        })

        setTimeout(() => {
          router.push(R.to('verify'))
        }, 1500)
        return
      }

      throw new Error('El servidor respondió con un formato inesperado')
    } catch (err) {
      handleRegistrationError(err, loadingToast)
    } finally {
      loading.value = false
    }
  }

  function handleRegistrationError(err, loadingToast) {
    const status = err?.response?.status
    const serverData = err?.response?.data

    if (status === 409) {
      const message = Array.isArray(serverData?.message)
        ? serverData.message.join('\n')
        : (serverData?.message || 'El correo ya está registrado.')
      loadingToast.reject({ title: 'Correo ya registrado', message })
      return
    }

    if (status === 400) {
      const picked = guessFieldFromServerError(serverData?.errors || serverData?.message || serverData)
      if (picked?.field) {
        notifyError('Campo inválido', picked.message || 'Por favor corrige este campo')
        loadingToast.reject({ title: 'Datos incorrectos', message: picked.message || 'Revisa los datos del formulario' })
      } else {
        const message = serverData?.message || 'Datos del formulario inválidos'
        loadingToast.reject({ title: 'Datos incorrectos', message })
      }
      return
    }

    if (status === 401) {
      const message = serverData?.message || 'Credenciales inválidas'
      loadingToast.reject({ title: 'Acceso denegado', message })
      return
    }

    const fallMsg = parseAxiosError(err) || 'No pudimos completar el registro. Intenta nuevamente.'
    loadingToast.reject({ title: 'Error en registro', message: fallMsg })
  }

  function guessFieldFromServerError(payload) {
    if (Array.isArray(payload)) {
      const first = payload[0]
      if (first?.property) {
        const msg = first?.constraints
          ? (Object.values(first.constraints)[0])
          : undefined
        return { field: first.property, message: msg }
      }
      if (typeof first === 'string') return guessFieldFromMessage(first)
    }
    if (typeof payload === 'string') return guessFieldFromMessage(payload)
    if (payload?.message) {
      if (Array.isArray(payload.message)) {
        const first = payload.message[0]
        if (typeof first === 'string') return guessFieldFromMessage(first)
        if (first?.property) {
          const msg = first?.constraints
            ? (Object.values(first.constraints)[0])
            : undefined
          return { field: first.property, message: msg }
        }
      } else if (typeof payload.message === 'string') {
        return guessFieldFromMessage(payload.message)
      }
    }
    return {}
  }

  function guessFieldFromMessage(msg) {
    const pairs = [
      { re: /email/i, field: 'email' },
      { re: /(password|contrase[ñn]a)/i, field: 'password_user' },
      { re: /(nombre|name)/i, field: 'name_user' },
      { re: /(paterno)/i, field: 'paternal_surname' },
      { re: /(materno)/i, field: 'maternal_surname' },
      { re: /(tel[eé]fono|phone)/i, field: 'phone' },
      { re: /(tipo.*usuario|type_user)/i, field: 'type_user_id' },
      { re: /(provenien|proceden)/i, field: 'provenance' },
      { re: /(matr[ií]cula)/i, field: 'matricula' },
      { re: /(programa)/i, field: 'educational_program' },
      { re: /(grado)/i, field: 'grade' },
      { re: /(grupo)/i, field: 'group_user' },
      { re: /(universidad)/i, field: 'universidad_procedencia' },
      { re: /(secreta|secret)/i, field: 'secret_password' },
      { re: /(empresa)/i, field: 'empresa_procedencia' },
      { re: /(rol)/i, field: 'rol_dentro_empresa' },
      { re: /(biograf[ií]a)/i, field: 'descripcion_biografia' },
      { re: /(presentaci[oó]n|tipo_presentaci[oó]n)/i, field: 'tipo_presentacion' },
      { re: /(conferencia)/i, field: 'titulo_conferencia' },
      { re: /(taller)/i, field: 'titulo_taller' },
      { re: /(talla)/i, field: 'size_user' },
    ]
    for (const { re, field } of pairs) {
      if (re.test(msg)) return { field, message: msg }
    }
    return { message: msg }
  }

  // Lifecycle
  onMounted(() => {
    // Cargar datos guardados
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (saved?.form) {
        Object.assign(form.value, saved.form)
        step.value = saved.step ?? 0
        accepted.value = !!saved.accepted
        password2.value = saved.form.password_user || ''

        if (form.value.secret_password && isSpeaker.value) {
          secretValidated.value = true
        }

        const mainCountry = countries.value.find(c => c.phoneCode === saved.form?.phone_country)
        if (mainCountry) selectedCountryCode.value = mainCountry.code

        const emerCountry = countries.value.find(c => c.phoneCode === saved.form?.emergency_phone_country)
        if (emerCountry) emergencyCountryCode.value = emerCountry.code
      }
    } catch {}

    if (!form.value.phone_country) form.value.phone_country = getPhoneCode(selectedCountryCode.value)
    if (!form.value.emergency_phone_country) form.value.emergency_phone_country = getPhoneCode(emergencyCountryCode.value)
    steps.value = isSpeaker.value ? [...speakerSteps] : [...baseSteps]
  })

  // Watchers
  watch(() => form.value.password_user, (p = '') => {
    reqs.value = {
      len: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      num: /\d/.test(p),
      sym: /[^\w\s]/.test(p),
    }
  })

  watch(isSpeaker, (now) => {
    steps.value = now ? [...speakerSteps] : [...baseSteps]
    if (!now) {
      const fields = [
        'secret_password', 'empresa_procedencia', 'rol_dentro_empresa', 'descripcion_biografia',
        'tipo_presentacion', 'titulo_conferencia', 'descripcion_conferencia', 'titulo_taller',
        'descripcion_taller', 'facebook_link', 'instagram_link', 'x_link', 'linkedin_link'
      ]
      fields.forEach(k => form.value[k] = '')
    }
  })

  watch(() => form.value.type_user_id, (now) => {
    const t = Number(now)

    if (t === 3) {
      resetFields([
        'provenance', 'matricula', 'educational_program', 'grade', 'group_user',
        'universidad_procedencia'
      ])
    }

    if (t === 1 || t === 2) {
      resetFields(['universidad_procedencia'])
      if ((form.value.provenance || '').toLowerCase() !== 'uttecam') {
        resetFields(['matricula', 'educational_program', 'grade', 'group_user'])
      }
    }

    if (step.value < 2) return
    step.value = 2
    centerActiveStep()
  })

  watch(() => (form.value.provenance || '').toLowerCase(), (prov) => {
    if (['otra', ''].includes(prov)) {
      resetFields(['matricula', 'educational_program', 'grade', 'group_user'])
    }
    if (prov === 'uttecam') {
      resetFields(['universidad_procedencia'])
    }
  })

  watch([() => form.value.type_user_id, () => form.value.secret_password], () => {
    secretValidated.value = false
  })

  watch([persistable, step, accepted], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      form: persistable.value,
      step: step.value,
      accepted: accepted.value
    }))
  }, { deep: true })

  return {
    // Estados
    step,
    showPass,
    showPass2,
    showSecretPass,
    password2,
    loading,
    accepted,
    showTermsModal,
    passwordTouched,
    secretValidated,
    secretValidating,
    stepperRef,
    form,
    steps,
    isOpen,
    selectedCountryCode,
    emergencyCountryCode,
    countries,
    
    // Computed
    isSpeaker,
    isStudentOrTeacher,
    isSecretPasswordValid,
    reqs,
    pwdMatch,
    strengthScore,
    strengthPercent,
    strengthLabel,
    isLastStep,
    canSubmit,
    canProceed,
    
    // Métodos
    touchPwd,
    centerActiveStep,
    prevStep,
    goLogin,
    toggleDropdown,
    selectCountry,
    getPhoneCode,
    nextOrSubmit
  }
}