// composables/auth/use-forgot.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ForgotApi } from '@/backend/auth/forgot-api'
import { parseAxiosError } from '@/backend/http/error'
import { R } from '@/utils/app-routes'

// 👇 Adaptador para notificaciones (igual que en use-register y use-reset)
import { createNotifyAdapter } from '@/utils/notify/adapter'

export function useForgot () {
  const router  = useRouter()
  
  // ---------------------------------
  // Notificaciones (mismo patrón que use-register)
  // ---------------------------------
  const notify = typeof createNotifyAdapter === 'function'
    ? createNotifyAdapter()
    : null

  const notifyError   = (t, m) => notify?.('error',   t, m)
  const notifyWarning = (t, m) => notify?.('warning', t, m)
  const notifySuccess = (t, m) => notify?.('success', t, m)
  const notifyLoading = (t, m) => notify?.('loading', t, m)

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

      toast?.resolve({
        title: 'Código enviado',
        message: 'Revisa tu correo electrónico',
      })

      setTimeout(() => router.push(R.to('verify')), 1500)
    } catch (err) {
      const msg = parseAxiosError(err) || 'No se pudo procesar tu solicitud'
      toast?.reject({ title: 'Error', message: msg })
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