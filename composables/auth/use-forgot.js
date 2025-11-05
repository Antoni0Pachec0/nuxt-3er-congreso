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

  async function onSubmit() {
    if (!isValidEmail(email.value)) {
      notifyError('Error', 'Por favor ingresa un correo válido')
      return
    }

    loading.value = true

    try {
      const cleanEmail = email.value.toLowerCase().trim()
      await ForgotApi.sendResetCode({ email: cleanEmail })

      // Guardar en sessionStorage para verify
      sessionStorage.setItem('verify_email', cleanEmail)
      sessionStorage.setItem('verification_purpose', 'reset_password')
      
      // También en localStorage como backup
      localStorage.setItem('verify_email', cleanEmail)
      localStorage.setItem('verification_purpose', 'reset_password')

      notifySuccess('Código enviado', 'Revisa tu correo electrónico para el código de verificación')
      
      // Redirección inmediata
      await router.push(R.to('verify'))
    } catch (err) {
      const msg = parseAxiosError(err) || 'No se pudo procesar tu solicitud'
      notifyError('Error', msg)
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