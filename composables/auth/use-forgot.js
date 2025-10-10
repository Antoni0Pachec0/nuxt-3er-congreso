// composables/auth/use-forgot.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ForgotApi } from '@/backend/auth/forgot-api'
import { notifyLoading, notifyError } from '@/utils/notifications'
import { parseAxiosError } from '@/plugins/http/error'
import { R } from '@/utils/app-routes'

export function useForgot () {
  const router  = useRouter()
  const email   = ref('')
  const loading = ref(false)

  function isValidEmail (value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '')
  }

  async function onSubmit () {
    if (!isValidEmail(email.value)) {
      notifyError('Error', 'Por favor ingresa un correo válido')
      return
    }

    loading.value = true
    const toast = notifyLoading('Enviando código', 'Procesando tu solicitud...')

    try {
      const cleanEmail = email.value.toLowerCase().trim()

      await ForgotApi.sendResetCode({ email: cleanEmail })

      // contexto para la pantalla de verificación
      localStorage.setItem('verify_email', cleanEmail)
      localStorage.setItem('verification_purpose', 'reset_password')

      toast.resolve({
        title: 'Código enviado',
        message: 'Revisa tu correo electrónico',
      })

      setTimeout(() => router.push(R.to('verify')), 1500)
    } catch (err) {
      const msg = parseAxiosError(err) || 'No se pudo procesar tu solicitud'
      toast.reject({ title: 'Error', message: msg })
    } finally {
      loading.value = false
    }
  }

  function goLogin () {
    router.push(R.to('login'))
  }

  return {
    email,
    loading,
    onSubmit,
    goLogin,
  }
}
