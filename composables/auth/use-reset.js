// composables/auth/use-reset.js
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ResetApi } from '@/backend/auth/reset-api'
//import { notifyLoading, notifyError } from '@/utils/notifications'
import { parseAxiosError } from '@/plugins/http/error'
import { R } from '@/utils/app-routes'

export function useReset () {
  const router = useRouter()

  // estado UI
  const password   = ref('')
  const password2  = ref('')
  const showPassword  = ref(false)
  const showPassword2 = ref(false)
  const loading    = ref(false)

  // contexto de sesión (email + código + token)
  const userEmail = ref('')
  const resetCode = ref('')

  onMounted(() => {
    const resetToken  = sessionStorage.getItem('reset_token')
    const resetEmail  = sessionStorage.getItem('reset_email')
    const tokenExpiry = sessionStorage.getItem('reset_token_expiry')
    const code        = sessionStorage.getItem('reset_code')

    if (!resetToken || !resetEmail || !code) {
      notifyError('Error', 'Sesión expirada. Solicita un nuevo código.')
      router.push('/forgot')
      return
    }

    if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
      sessionStorage.clear()
      notifyError('Error', 'Sesión expirada. Solicita un nuevo código.')
      router.push('/forgot')
      return
    }

    userEmail.value = resetEmail
    resetCode.value = code
  })

  // computed
  const pwdMatch   = computed(() => password.value && password.value === password2.value)
  const canSubmit  = computed(() =>
    !loading.value && pwdMatch.value && password.value.length >= 8 && password.value.length <= 50
  )

  // acciones
  async function onSubmit () {
    if (!pwdMatch.value) {
      notifyError('Error', 'Las contraseñas no coinciden.')
      return
    }
    if (!userEmail.value || !resetCode.value) {
      notifyError('Error', 'No se pudo identificar tu cuenta.')
      router.push('/forgot')
      return
    }

    loading.value = true
    const toast = notifyLoading('Guardando contraseña', 'Procesando...')

    try {
      await ResetApi.resetPassword({
        email: userEmail.value,
        password: password.value,
        code: resetCode.value, // código de 6 dígitos
      })

      toast.resolve({
        title: 'Contraseña actualizada',
        message: 'Tu contraseña ha sido restablecida.',
      })

      // limpiar contexto
      sessionStorage.clear()
      localStorage.removeItem('verify_email')
      localStorage.removeItem('verification_purpose')

      setTimeout(() => router.push(R.to('login')), 1500)
    } catch (err) {
      const errorMsg = parseAxiosError(err) || 'No se pudo restablecer la contraseña'
      toast.reject({ title: 'Error', message: errorMsg })
    } finally {
      loading.value = false
    }
  }

  function goLogin () {
    router.push(R.to('login'))
  }

  return {
    // estado
    password, password2,
    showPassword, showPassword2,
    loading, pwdMatch, canSubmit,

    // acciones
    onSubmit, goLogin,
  }
}
