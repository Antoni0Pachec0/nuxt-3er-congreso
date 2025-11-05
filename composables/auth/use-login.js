// composables/auth/use-login.js
import { ref, computed } from 'vue'
import { useAuthStore } from '@/security/stores/auth'
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
      const errorMessage = parseAxiosError(error)
      
      // Manejar específicamente error 400 (credenciales incorrectas)
      if (error.response?.status === 400) {
        apiError.value = 'Correo o contraseña incorrectos'
      } else {
        apiError.value = errorMessage
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