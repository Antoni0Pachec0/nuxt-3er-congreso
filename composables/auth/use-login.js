// features/auth/use-login.js
import { ref, computed } from 'vue'
import { useAuthStore } from '@/security/stores/auth' // Ruta corregida
import { R } from '@/utils/app-routes'
import { AuthApi } from '@/backend/auth/login-api'
import { parseAxiosError } from '@/backend/http/error'

export function useLogin() {
  const email = ref('')
  const password = ref('')
  const show = ref(false)
  const loading = ref(false)
  const apiError = ref('')
  const authStore = useAuthStore()

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
  function handleSuccessResponse(response) {
    // Verificación pendiente
    if (response.require_verification) {
      sessionStorage.setItem('verify_email', response.user?.email)
      localStorage.setItem('verification_purpose', 'email_verification')
      return navigateTo(R.to('verify'))
    }

    // Login exitoso
    if (Number.isFinite(response.user_id)) {
      // Guardar en el store de Pinia
      authStore.setUser({ 
        id: response.user_id, 
        email: email.value,
        ...response.user // Incluir cualquier dato adicional del usuario
      })
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('userId', response.user_id)
      localStorage.setItem('userEmail', email.value)
      if (response.access_token) localStorage.setItem('access_token', response.access_token)
      if (response.refresh_token) localStorage.setItem('refresh_token', response.refresh_token)
      
      // Persistir el store completo
      localStorage.setItem('auth_store', JSON.stringify({
        user: { 
          id: response.user_id, 
          email: email.value,
          ...response.user 
        },
        isAuthenticated: true
      }))
      
      return navigateTo('/user-home')
    }

    apiError.value = response.message || 'Error desconocido en la respuesta'
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

      await handleSuccessResponse(response)
    } catch (error) {
      apiError.value = parseAxiosError(error)
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