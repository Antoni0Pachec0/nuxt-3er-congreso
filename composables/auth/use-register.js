// composables/auth/use-register.js
import { ref, reactive, computed, watch, watchEffect, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { R } from '@/utils/app-routes'
import { AuthApi } from '@/backend/auth/register-api'
import { parseAxiosError } from '@/backend/http/error'

// 👇 Adaptador muy simple hacia Notivue (global)
import { createNotifyAdapter } from '@/utils/notify/adapter'

export function useRegister () {
  const router = useRouter()
  const STORAGE_KEY = 'register_form_v7'

  // ---------------------------------
  // Notificaciones (solo globales)
  // ---------------------------------
  const notify = typeof createNotifyAdapter === 'function'
    ? createNotifyAdapter()
    : null

  const notifyError   = (t, m) => notify?.('error',   t, m)
  const notifyWarning = (t, m) => notify?.('warning', t, m)
  const notifySuccess = (t, m) => notify?.('success', t, m)
  const notifyLoading = (t, m) => notify?.('loading', t, m)

  // ---------------------------------
  // Estado base
  // ---------------------------------
  const step = ref(0)
  const steps = ref([])

  const showPass = ref(false)
  const showPass2 = ref(false)
  const showSecretPass = ref(false)
  const password2 = ref('')

  const loading = ref(false)
  const accepted = ref(false)
  const showTermsModal = ref(false)

  // Touch para mostrar el medidor apenas se escribe
  const passwordTouched = ref(false)
  function touchPwd () { passwordTouched.value = true }

  // Ponente
  const secretValidated = ref(false)
  const secretValidating = ref(false)

  // Stepper scroll
  const stepperRef = ref(null)

  // Teléfonos
  const isOpen = ref({ main: false, emergency: false })
  const selectedCountryCode = ref('mx')
  const emergencyCountryCode = ref('mx')
  const countries = ref([
    { code: 'mx', name: 'México',           phoneCode: '+52' },
    { code: 'us', name: 'Estados Unidos',   phoneCode: '+1'  },
    { code: 'ca', name: 'Canadá',           phoneCode: '+1'  },
    { code: 'es', name: 'España',           phoneCode: '+34' },
    { code: 'ar', name: 'Argentina',        phoneCode: '+54' },
    { code: 'co', name: 'Colombia',         phoneCode: '+57' },
    { code: 'cl', name: 'Chile',            phoneCode: '+56' }
  ])
  const getPhoneCode = (code) =>
    countries.value.find(c => c.code === code)?.phoneCode || '+52'

  const toggleDropdown = (type) => {
    const other = type === 'main' ? 'emergency' : 'main'
    if (isOpen.value[other]) isOpen.value[other] = false
    isOpen.value[type] = !isOpen.value[type]
  }
  const selectCountry = (country, type) => {
    if (type === 'main') {
      selectedCountryCode.value = country.code
      form.phone_country = country.phoneCode
      isOpen.value.main = false
    } else {
      emergencyCountryCode.value = country.code
      form.emergency_phone_country = country.phoneCode
      isOpen.value.emergency = false
    }
  }

  // ---------------------------------
  // Form (reactive para v-model anidado)
  // ---------------------------------
  const form = reactive({
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
    // Ponente
    secret_password: '',
    empresa_procedencia: '',
    rol_dentro_empresa: '',
    descripcion_biografia: '',
    tipo_presentacion: '',
    titulo_conferencia: '',
    descripcion_conferencia: '',
    titulo_taller: '',
    descripcion_taller: '',
    // Redes
    facebook_link: '',
    instagram_link: '',
    x_link: '',
    linkedin_link: '',
    // Final
    size_user: ''
  })

  // ---------------------------------
  // Stepper sets
  // ---------------------------------
  const baseSteps = [
    { key: 'account',     label: 'Cuenta' },
    { key: 'personal',    label: 'Datos personales' },
    { key: 'user_type',   label: 'Tipo de usuario' },
    { key: 'final',       label: 'Finalizar' }
  ]
  const speakerSteps = [
    { key: 'account',       label: 'Cuenta' },
    { key: 'personal',      label: 'Datos personales' },
    { key: 'user_type',     label: 'Tipo de usuario' },
    { key: 'speaker_data',  label: 'Datos Ponente' },
    { key: 'social_media',  label: 'Redes Sociales' },
    { key: 'final',         label: 'Finalizar' }
  ]

  // ---------------------------------
  // Password meter (ref + watchEffect)
  // ---------------------------------
  const reqs = ref({ len: false, upper: false, lower: false, num: false, sym: false })
  watchEffect(() => {
    const p = form.password_user || ''
    reqs.value = {
      len:   p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      num:   /\d/.test(p),
      sym:   /[^\w\s]/.test(p)
    }
  })

  const strengthScore = computed(() => Object.values(reqs.value).filter(Boolean).length)
  const strengthPercent = computed(() => `${(strengthScore.value / 5) * 100}%`)
  const strengthLabel = computed(() => {
    const s = strengthScore.value
    if (s <= 2) return 'Muy débil'
    if (s === 3) return 'Media'
    if (s === 4) return 'Fuerte'
    return 'Excelente'
  })

  // ---------------------------------
  // Otros computed
  // ---------------------------------
  const isSpeaker = computed(() => form.type_user_id === 4)
  const isStudentOrTeacher = computed(() => [1, 2].includes(Number(form.type_user_id)))
  const isSecretPasswordValid = computed(() => (form.secret_password || '').trim().length > 0)
  const pwdMatch = computed(() => password2.value === form.password_user && password2.value.length > 0)

  const isLastStep = computed(() => step.value === steps.value.length - 1)
  const canSubmit = computed(() => isLastStep.value && !!form.size_user && accepted.value)

  // ---------------------------------
  // Validaciones auxiliares
  // ---------------------------------
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPhone = (phone) => /^\d{10}$/.test(phone)

  // Gate de avance
  const canProceed = computed(() => {
    switch (step.value) {
      case 0:
        return (
          !!form.email &&
          isValidEmail(form.email) &&
          form.password_user.length >= 8 &&
          strengthScore.value === 5 &&
          pwdMatch.value
        )
      case 1:
        return (
          !!form.name_user &&
          !!form.paternal_surname &&
          !!form.maternal_surname &&
          !!form.phone &&
          isValidPhone(form.phone)
        )
      case 2: {
        if (!form.type_user_id) return false
        if (isSpeaker.value) return secretValidated.value || isSecretPasswordValid.value

        const t = Number(form.type_user_id)
        if (t === 3) return true

        const prov = (form.provenance || '').toLowerCase()
        const isStudent = t === 1
        const isTeacher = t === 2

        if ((isStudent || isTeacher) && prov === 'uttecam') {
          const hasMat  = !!form.matricula
          const hasProg = !!form.educational_program
          if (isStudent) {
            const validGrade = typeof form.grade === 'string' && form.grade.length >= 1 && form.grade.length <= 2
            const validGroup = typeof form.group_user === 'string' && form.group_user.length === 1
            return hasMat && hasProg && validGrade && validGroup
          }
          return hasMat && hasProg
        }
        if ((isStudent || isTeacher) && prov === 'otra') {
          return !!form.universidad_procedencia
        }
        return true
      }
      case 3:
        if (isSpeaker.value) {
          const hasBio = !!form.empresa_procedencia &&
                         !!form.rol_dentro_empresa &&
                         !!form.descripcion_biografia
          const tp = form.tipo_presentacion
          const confOk = tp === 'conferencia' &&
                         !!form.titulo_conferencia &&
                         !!form.descripcion_conferencia
          const tallOk = tp === 'taller' &&
                         !!form.titulo_taller &&
                         !!form.descripcion_taller
          const ambasOk = tp === 'ambas' &&
                          !!form.titulo_conferencia &&
                          !!form.descripcion_conferencia &&
                          !!form.titulo_taller &&
                          !!form.descripcion_taller
          return hasBio && (confOk || tallOk || ambasOk)
        }
        return true
      case 4:
        return true
      case 5:
        return isSpeaker.value && !!form.size_user && accepted.value
      default:
        return true
    }
  })

  // ---------------------------------
  // UI helpers
  // ---------------------------------
  function centerActiveStep () {
    nextTick(() => {
      const el = stepperRef.value?.querySelectorAll('.step')[step.value]
      el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    })
  }
  const prevStep = () => { if (step.value > 0) step.value-- }
  const goLogin = () => { router.push(R.to('login')) }

  // ---------------------------------
  // Persistencia
  // ---------------------------------
  const PERSIST_KEYS = [
    'email', 'password_user', 'secret_password',
    'name_user', 'paternal_surname', 'maternal_surname',
    'phone', 'phone_country', 'emergency_phone', 'emergency_phone_country',
    'type_user_id', 'provenance', 'matricula', 'educational_program',
    'grade', 'group_user', 'universidad_procedencia',
    'empresa_procedencia', 'rol_dentro_empresa', 'descripcion_biografia', 'tipo_presentacion',
    'titulo_conferencia', 'descripcion_conferencia', 'titulo_taller', 'descripcion_taller',
    'facebook_link', 'instagram_link', 'x_link', 'linkedin_link',
    'size_user'
  ]
  const persistable = computed(() => {
    const out = {}
    for (const k of PERSIST_KEYS) out[k] = form[k] ?? ''
    return out
  })

  // ---------------------------------
  // Validación remota de ponente
  // ---------------------------------
  async function validateSpeakerSecret () {
    if (!isSpeaker.value) return true
    const secret = (form.secret_password || '').trim()
    if (!secret) { notifyWarning?.('Contraseña requerida', 'Ingresa la contraseña de ponente.'); return false }

    try {
      secretValidating.value = true
      await AuthApi.validateSpeakerSecret({ secret_password: secret })
      secretValidated.value = true
      notifySuccess?.('Validada', 'La contraseña de ponente es correcta.')
      return true
    } catch (err) {
      secretValidated.value = false
      const msg = err?.response?.data?.message || 'Contraseña de ponente inválida'
      notifyError?.('Contraseña inválida', msg)
      return false
    } finally {
      secretValidating.value = false
    }
  }

  // ---------------------------------
  // Se agrega una función para manejar errores y mostrar alertas
  // ---------------------------------
  function handleFormError(error) {
    if (notifyError) {
      notifyError('Error en el formulario', error.message || 'Ocurrió un error inesperado.')
    } else {
      console.error('Error en el formulario:', error)
    }
  }

  // ---------------------------------
  // Avance / Submit
  // ---------------------------------
  const nextOrSubmit = async () => {
    try {
      if (step.value === 0) {
        const isValid = reqs.len && reqs.upper && reqs.lower && reqs.num && reqs.sym
        if (!isValid) {
          throw new Error('La contraseña no cumple con los requisitos mínimos.')
        }
      }

      if (!isLastStep.value) {
        step.value++
        centerActiveStep()
      } else {
        await submitForm()
        notifySuccess('Registro exitoso', 'Tu cuenta ha sido creada correctamente.')
      }
    } catch (error) {
      handleFormError(error)
    }
  }

  async function submitForm() {
    try {
      loading.value = true
      // Simulación de envío del formulario
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Aquí iría la lógica real del envío del formulario
    } catch (error) {
      throw new Error('No se pudo enviar el formulario. Por favor, intenta de nuevo.')
    } finally {
      loading.value = false
    }
  }

  function resetFields (keys) { for (const k of keys) form[k] = '' }

  function toE164 (code, local) {
    const pref = code?.startsWith('+') ? code : `+${code || ''}`
    const digits = (local || '').replace(/\D/g, '')
    return `${pref}${digits}`
  }

  function normalizePayload (payload) {
    const finalPayload = {
      email: (payload.email || '').trim().toLowerCase(),
      password_user: payload.password_user,
      name_user: (payload.name_user || '').trim(),
      paternal_surname: (payload.paternal_surname || '').trim(),
      maternal_surname: (payload.maternal_surname || '').trim(),
      type_user_id: Number(payload.type_user_id),
      size_user: String(payload.size_user || '').toUpperCase()
    }

    if (payload.phone_country && payload.phone) finalPayload.phone = toE164(payload.phone_country, payload.phone)
    if ((payload.emergency_phone || '').trim()) finalPayload.emergency_phone = toE164(payload.emergency_phone_country, payload.emergency_phone)

    const userType = Number(payload.type_user_id)
    const provOpt = (payload.provenance || '').toLowerCase()

    if ([1, 2].includes(userType)) {
      if (provOpt === 'uttecam') {
        finalPayload.provenance = 'uttecam'
        finalPayload.matricula = (payload.matricula || '').trim()
        finalPayload.educational_program = (payload.educational_program || '').trim()
        if (userType === 1) {
          finalPayload.grade = (payload.grade || '').trim()
          finalPayload.group_user = (payload.group_user || '').trim().toUpperCase()
        }
      } else if (provOpt === 'otra') {
        finalPayload.provenance = 'otra'
        finalPayload.universidad_procedencia = (payload.universidad_procedencia || '').trim()
      } else {
        finalPayload.provenance = (payload.provenance || '').trim()
      }
    }

    if (userType === 3) {
      finalPayload.provenance = 'externo'
    }

    if (userType === 4) {
      finalPayload.secret_password = (payload.secret_password || '').trim()
      finalPayload.empresa_procedencia = (payload.empresa_procedencia || '').trim()
      finalPayload.rol_dentro_empresa = (payload.rol_dentro_empresa || '').trim()
      finalPayload.descripcion_biografia = (payload.descripcion_biografia || '').trim()
      finalPayload.tipo_presentacion = payload.tipo_presentacion || ''
      if (['conferencia', 'ambas'].includes(payload.tipo_presentacion)) {
        finalPayload.titulo_conferencia = (payload.titulo_conferencia || '').trim()
        finalPayload.descripcion_conferencia = (payload.descripcion_conferencia || '').trim()
      }
      if (['taller', 'ambas'].includes(payload.tipo_presentacion)) {
        finalPayload.titulo_taller = (payload.titulo_taller || '').trim()
        finalPayload.descripcion_taller = (payload.descripcion_taller || '').trim()
      }
      if ((payload.facebook_link || '').trim())  finalPayload.facebook_link  = payload.facebook_link.trim()
      if ((payload.instagram_link || '').trim()) finalPayload.instagram_link = payload.instagram_link.trim()
      if ((payload.x_link || '').trim())         finalPayload.x_link         = payload.x_link.trim()
      if ((payload.linkedin_link || '').trim())  finalPayload.linkedin_link  = payload.linkedin_link.trim()
    }

    return finalPayload
  }

  async function submitRegister () {
    if (loading.value) return
    if (!canSubmit.value) {
      notifyWarning?.('Formulario incompleto', 'Debes aceptar los términos y elegir tu talla.')
      return
    }

    loading.value = true
    const loadingToast = notifyLoading?.('Procesando', 'Creando tu cuenta...')

    try {
      const payload = normalizePayload(form)
      const response = await AuthApi.register(payload)

      if (response?.email_sent && response?.user) {
        sessionStorage.setItem('verify_email', payload.email)
        localStorage.setItem('verify_email', payload.email)
        localStorage.setItem('verification_purpose', 'email_verification')
        localStorage.removeItem(STORAGE_KEY)

        loadingToast?.resolve({
          title: '¡Registro exitoso!',
          message: response.message || 'Cuenta creada correctamente. Revisa tu correo para el código de verificación.'
        })
        setTimeout(() => { router.push(R.to('verify')) }, 1500)
        return
      }

      if (response?.already_exists && response?.email_sent) {
        sessionStorage.setItem('verify_email', payload.email)
        loadingToast?.resolve({
          title: 'Registro pendiente',
          message: response.message || 'Este correo ya tenía un registro pendiente. Te reenviamos el código de verificación.'
        })
        setTimeout(() => { router.push(R.to('verify')) }, 1500)
        return
      }

      throw new Error('El servidor respondió con un formato inesperado')
    } catch (err) {
      handleRegistrationError(err, loadingToast)
    } finally {
      loading.value = false
    }
  }

  function handleRegistrationError (err, loadingToast) {
    const status = err?.response?.status
    const serverData = err?.response?.data

    if (status === 409) {
      const message = Array.isArray(serverData?.message)
        ? serverData.message.join('\n')
        : (serverData?.message || 'El correo ya está registrado.')
      loadingToast?.reject({ title: 'Correo ya registrado', message })
      return
    }

    if (status === 400) {
      const picked = guessFieldFromServerError(serverData?.errors || serverData?.message || serverData)
      if (picked?.message) {
        notifyError?.('Datos incorrectos', picked.message)
        loadingToast?.reject({ title: 'Datos incorrectos', message: picked.message })
      } else {
        const message = serverData?.message || 'Datos del formulario inválidos'
        loadingToast?.reject({ title: 'Datos incorrectos', message })
      }
      return
    }

    if (status === 401) {
      const message = serverData?.message || 'Credenciales inválidas'
      loadingToast?.reject({ title: 'Acceso denegado', message })
      return
    }

    const fallMsg = parseAxiosError(err) || 'No pudimos completar el registro. Intenta nuevamente.'
    loadingToast?.reject({ title: 'Error en registro', message: fallMsg })
  }

  function guessFieldFromServerError (payload) {
    if (Array.isArray(payload)) {
      const first = payload[0]
      if (first?.property) {
        const msg = first?.constraints ? (Object.values(first.constraints)[0]) : undefined
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
          const msg = first?.constraints ? (Object.values(first.constraints)[0]) : undefined
          return { field: first.property, message: msg }
        }
      } else if (typeof payload.message === 'string') {
        return guessFieldFromMessage(payload.message)
      }
    }
    return {}
  }

  function guessFieldFromMessage (msg) {
    const pairs = [
      { re: /email/i,                             field: 'email' },
      { re: /(password|contrase[ñn]a)/i,          field: 'password_user' },
      { re: /(nombre|name)/i,                     field: 'name_user' },
      { re: /(paterno)/i,                         field: 'paternal_surname' },
      { re: /(materno)/i,                         field: 'maternal_surname' },
      { re: /(tel[eé]fono|phone)/i,               field: 'phone' },
      { re: /(tipo.*usuario|type_user)/i,         field: 'type_user_id' },
      { re: /(provenien|proceden)/i,              field: 'provenance' },
      { re: /(matr[ií]cula)/i,                    field: 'matricula' },
      { re: /(programa)/i,                        field: 'educational_program' },
      { re: /(grado)/i,                           field: 'grade' },
      { re: /(grupo)/i,                           field: 'group_user' },
      { re: /(universidad)/i,                     field: 'universidad_procedencia' },
      { re: /(secreta|secret)/i,                  field: 'secret_password' },
      { re: /(empresa)/i,                         field: 'empresa_procedencia' },
      { re: /(rol)/i,                             field: 'rol_dentro_empresa' },
      { re: /(biograf[ií]a)/i,                    field: 'descripcion_biografia' },
      { re: /(presentaci[oó]n|tipo_presentaci[oó]n)/i, field: 'tipo_presentacion' },
      { re: /(conferencia)/i,                     field: 'titulo_conferencia' },
      { re: /(taller)/i,                          field: 'titulo_taller' },
      { re: /(talla)/i,                           field: 'size_user' }
    ]
    for (const { re, field } of pairs) {
      if (re.test(msg)) return { field, message: msg }
    }
    return { message: msg }
  }

  // ---------------------------------
  // Lifecycle
  // ---------------------------------
  onMounted(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (saved?.form) {
        Object.assign(form, saved.form)
        step.value = saved.step ?? 0
        accepted.value = !!saved.accepted
        password2.value = saved.form.password_user || ''

        if (form.secret_password && isSpeaker.value) {
          secretValidated.value = true
        }

        const mainCountry = countries.value.find(c => c.phoneCode === saved.form?.phone_country)
        if (mainCountry) selectedCountryCode.value = mainCountry.code

        const emerCountry = countries.value.find(c => c.phoneCode === saved.form?.emergency_phone_country)
        if (emerCountry) emergencyCountryCode.value = emerCountry.code
      }
    } catch { /* noop */ }

    if (!form.phone_country) form.phone_country = getPhoneCode(selectedCountryCode.value)
    if (!form.emergency_phone_country) form.emergency_phone_country = getPhoneCode(emergencyCountryCode.value)
    steps.value = isSpeaker.value ? [...speakerSteps] : [...baseSteps]
    centerActiveStep()
  })

  // Cambios de tipo de usuario → actualizar pasos y limpiar campos
  watch(isSpeaker, (now) => {
    steps.value = now ? [...speakerSteps] : [...baseSteps]
    if (!now) {
      const fields = [
        'secret_password', 'empresa_procedencia', 'rol_dentro_empresa', 'descripcion_biografia',
        'tipo_presentacion', 'titulo_conferencia', 'descripcion_conferencia', 'titulo_taller',
        'descripcion_taller', 'facebook_link', 'instagram_link', 'x_link', 'linkedin_link'
      ]
      fields.forEach(k => { form[k] = '' })
      secretValidated.value = false
    }
  })

  // Cambios de tipo de usuario (limpiezas adicionales)
  watch(() => form.type_user_id, (now) => {
    const t = Number(now)

    if (t === 3) {
      resetFields([
        'provenance', 'matricula', 'educational_program', 'grade', 'group_user',
        'universidad_procedencia'
      ])
    }

    if (t === 1 || t === 2) {
      resetFields(['universidad_procedencia'])
      if ((form.provenance || '').toLowerCase() !== 'uttecam') {
        resetFields(['matricula', 'educational_program', 'grade', 'group_user'])
      }
    }

    if (step.value >= 2) {
      step.value = 2
      centerActiveStep()
    }
  })

  // Cambios de procedencia
  watch(() => (form.provenance || '').toLowerCase(), (prov) => {
    if (['otra', ''].includes(prov)) {
      resetFields(['matricula', 'educational_program', 'grade', 'group_user'])
    }
    if (prov === 'uttecam') {
      resetFields(['universidad_procedencia'])
    }
  })

  // Si cambia tipo o clave secreta → invalidar validación remota
  watch([() => form.type_user_id, () => form.secret_password], () => {
    secretValidated.value = false
  })

  // Persistencia
  watch([persistable, step, accepted], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      form: persistable.value,
      step: step.value,
      accepted: accepted.value
    }))
  }, { deep: true })

  // ---------------------------------
  // Expuestos a la vista
  // ---------------------------------
  return {
    // Estados
    step,
    steps,
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

    // Teléfonos
    isOpen,
    selectedCountryCode,
    emergencyCountryCode,
    countries,

    // Computed / meter
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
