// composables/auth/use-login.js
import { ref, computed } from 'vue'
import { useAuthStore } from '@/security/stores/auth'
import { R } from '@/utils/app-routes'
import { AuthApi } from '@/backend/auth/login-api'
import { parseAxiosError } from '@/backend/http/error'

// 👇 Adaptador para notificaciones
import { createNotifyAdapter } from '@/utils/notify/adapter'

export function useLogin() {
  const email = ref('')
  const password = ref('')
  const show = ref(false)
  const loading = ref(false)
  const apiError = ref('')
  const authStore = useAuthStore()

  // Notificaciones
  const notify = typeof createNotifyAdapter === 'function'
    ? createNotifyAdapter()
    : null

  const notifyError = (t, m) => notify?.('error', t, m)
  const notifySuccess = (t, m) => notify?.('success', t, m)
  const notifyWarning = (t, m) => notify?.('warning', t, m)

  // Computed para validación en tiempo real
  const isFormValid = computed(() => {
    return email.value && password.value && password.value.length >= 8
  })

  const isSubmitDisabled = computed(() => {
    return loading.value || !isFormValid.value
  })

  // Navegación
  function goHome() { return navigateTo(R.to('home')) }
  function onRegister() { return navigateTo(R.to('register')) }
  function onForgot() { return navigateTo(R.to('forgot')) }

  // Validación del formulario
  function validateForm() {
    if (!email.value || !password.value) {
      apiError.value = 'Por favor llena todos los campos.'
      return false
    }

    if (password.value.length < 8) {
      apiError.value = 'La contraseña debe tener al menos 8 caracteres.'
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      apiError.value = 'Por favor ingresa un email válido.'
      return false
    }

    apiError.value = ''
    return true
  }

  // Manejo de respuesta exitosa
  async function handleSuccessResponse(response) {
    if (!Number.isFinite(response?.user_id)) {
      apiError.value = response?.message || 'Error desconocido en la respuesta'
      return
    }

    const roleId = Number(response?.user?.type_user_id ?? 0)
    const roleName = response?.user?.type_user_name || null

    // Guarda en store
    authStore.setUser({
      id: response.user_id,
      email: email.value || response?.user?.email || '',
      roleId,
      roleName,
      ...(response?.user || {})
    })

    // Persistencia y fijar Bearer
    try {
      localStorage.setItem('userId', String(response.user_id))
      localStorage.setItem('userEmail', email.value || response?.user?.email || '')

      if (response?.access_token) {
        authStore.setAccessToken(response.access_token)
        localStorage.setItem('access_token', response.access_token)
        
        try {
          const { default: api } = await import('@/backend/http/api')
          api.defaults.headers.Authorization = `Bearer ${response.access_token}`
        } catch (error) {
          console.warn('Error setting API authorization:', error)
        }
      }

      if (response?.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token)
      }

      localStorage.setItem('auth_store', JSON.stringify({
        user: {
          id: response.user_id,
          email: email.value || response?.user?.email || '',
          roleId,
          roleName
        },
        isAuthenticated: true
      }))
    } catch (error) {
      console.warn('Error saving auth data:', error)
    }

    // Redirección por rol
    if (roleId === 5) {
      return navigateTo(R.to('adminUsers'))
    } else {
      return navigateTo(R.to('workshops'))
    }
  }

  // Manejo de usuario no verificado
  async function handleUnverifiedUser(response) {
    // Guardar email para la verificación
    sessionStorage.setItem('verify_email', email.value)
    localStorage.setItem('verify_email', email.value)
    localStorage.setItem('verification_purpose', 'email_verification')

    // Mostrar notificación
    notifyWarning(
      'Cuenta no verificada', 
      'Tu cuenta requiere verificación. Te hemos enviado un nuevo código al correo.'
    )

    // Redirigir a verificación
    setTimeout(() => {
      navigateTo(R.to('verify'))
    }, 2000)
  }

  // Submit principal
  async function onSubmit() {
    if (!validateForm()) return

    loading.value = true
    apiError.value = ''

    try {
      const response = await AuthApi.login({
        email: email.value.toLowerCase().trim(),
        password: password.value
      })

      // ✅ CORREGIDO: Manejar caso de verificación requerida
      if (response?.require_verification) {
        await handleUnverifiedUser(response)
        return
      }

      // Login exitoso
      await handleSuccessResponse(response)
      
    } catch (error) {
      // ✅ CORREGIDO: Mejor manejo de errores específicos
      const status = error.response?.status
      const serverMessage = error.response?.data?.message
      
      switch (status) {
        case 400:
          apiError.value = serverMessage || 'Credenciales incorrectas'
          notifyError('Error de inicio de sesión', apiError.value)
          break
          
        case 401:
          apiError.value = serverMessage || 'No autorizado'
          notifyError('Acceso denegado', apiError.value)
          break
          
        case 404:
          apiError.value = 'Usuario no encontrado'
          notifyError('Cuenta no existe', 'Verifica tu correo electrónico')
          break
          
        case 422:
          apiError.value = serverMessage || 'Datos de entrada inválidos'
          notifyError('Datos incorrectos', apiError.value)
          break
          
        case 429:
          apiError.value = 'Demasiados intentos. Intenta más tarde.'
          notifyWarning('Demasiados intentos', apiError.value)
          break
          
        case 500:
          apiError.value = 'Error del servidor. Intenta más tarde.'
          notifyError('Error del servidor', apiError.value)
          break
          
        default:
          const errorMessage = parseAxiosError(error)
          apiError.value = errorMessage || 'Error desconocido al iniciar sesión'
          notifyError('Error', apiError.value)
      }
      
      console.error('Login error:', error)
    } finally {
      loading.value = false
    }
  }

  // Limpiar formulario
  function resetForm() {
    email.value = ''
    password.value = ''
    show.value = false
    apiError.value = ''
  }

  return {
    email,
    password,
    show,
    loading,
    apiError,
    isFormValid,
    isSubmitDisabled,
    onSubmit,
    goHome,
    onRegister,
    onForgot,
    resetForm
  }
}