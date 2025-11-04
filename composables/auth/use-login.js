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
    // 1) Verificación pendiente
    if (Number.isFinite(response?.user_id)) {
      const roleId = Number(response?.user?.type_user_id ?? 0)
      const roleName = response?.user?.type_user_name || null

      authStore.setUser({
        id: response.user_id,
        email: email.value || response?.user?.email || '',
        roleId,
        roleName,
        ...(response?.user || {})
      })

      // ✅ fija Authorization y persiste token
      if (response?.access_token) authStore.setAccessToken(response.access_token)

      // (opcional) guarda refresh_token si lo ocupas para otros flujos
      if (response?.refresh_token) try { localStorage.setItem('refresh_token', response.refresh_token) } catch {}

      // ✅ Redirección por rol
      return roleId === 5 ? navigateTo('/admin/users') : navigateTo('/workshops')
    }


    // 2) Login exitoso
    if (Number.isFinite(response?.user_id)) {
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
          localStorage.setItem('access_token', response.access_token)
          try {
            const { default: api } = await import('@/backend/http/api')
            api.defaults.headers.Authorization = `Bearer ${response.access_token}`
          } catch (error) {
            console.warn('Error setting API authorization:', error)
          }
        }

        if (response?.refresh_token) localStorage.setItem('refresh_token', response.refresh_token)

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

      // 3) Redirección por rol - ✅ CORREGIDO: usuarios normales van a workshops
      if (roleId === 5) {
        return navigateTo(R.to('adminUsers'))
      } else {
        return navigateTo(R.to('workshops')) // ✅ Cambiado de 'userHome' a 'workshops'
      }
    }

    // 4) Fallback de error
    apiError.value = response?.message || 'Error desconocido en la respuesta'
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