// composables/auth/use-reset.js
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ResetApi } from '@/backend/auth/reset-api'
import { parseAxiosError } from '@/backend/http/error'
import { R } from '@/utils/app-routes'
import { createNotifyAdapter } from '@/utils/notify/adapter'

export function useReset() {
  const router = useRouter()

  // Notificaciones
  const notify = createNotifyAdapter()
  const notifyError = (t, m) => notify?.('error', t, m)
  const notifyWarning = (t, m) => notify?.('warning', t, m)
  const notifySuccess = (t, m) => notify?.('success', t, m)
  const notifyLoading = (t, m) => notify?.('loading', t, m)

  // Estado UI
  const password = ref('')
  const password2 = ref('')
  const showPassword = ref(false)
  const showPassword2 = ref(false)
  const loading = ref(false)

  // Contexto de sesión
  const userEmail = ref('')
  const resetCode = ref('')

  onMounted(() => {
    // Debug completo del sessionStorage
    const sessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      sessionData[key] = sessionStorage.getItem(key);
    }
    

    // Obtener datos específicos
    const storedEmail = sessionStorage.getItem('reset_email');
    const storedCode = sessionStorage.getItem('reset_code');
    const tokenExpiry = sessionStorage.getItem('reset_token_expiry');

    // Verificar si tenemos los datos necesarios
    if (!storedEmail || !storedCode) {
      console.error('❌ [RESET] Datos incompletos en sessionStorage');
      console.error('❌ [RESET] - reset_email:', storedEmail);
      console.error('❌ [RESET] - reset_code:', storedCode);
      
      // Intentar recuperar de localStorage como fallback
      const fallbackEmail = localStorage.getItem('verify_email');
      
      if (fallbackEmail) {
        notifyWarning('Sesión incompleta', 'Redirigiendo para solicitar nuevo código.');
        router.push(`/forgot?email=${encodeURIComponent(fallbackEmail)}`);
      } else {
        notifyError('Error', 'Sesión expirada. Solicita un nuevo código.');
        router.push('/forgot');
      }
      return;
    }

    // Verificar expiración
    if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
      console.warn('⚠️ [RESET] Token expirado');
      sessionStorage.removeItem('reset_email');
      sessionStorage.removeItem('reset_code');
      sessionStorage.removeItem('reset_token_expiry');
      notifyError('Error', 'Sesión expirada. Solicita un nuevo código.');
      router.push('/forgot');
      return;
    }

    // Asignar datos a las refs
    userEmail.value = storedEmail;
    resetCode.value = storedCode;
  });

  // Computed
  const pwdMatch = computed(() => password.value && password.value === password2.value)
  const canSubmit = computed(() =>
    !loading.value && pwdMatch.value && password.value.length >= 8 && password.value.length <= 50
  )

  // Acciones
  async function onSubmit() {
    if (!pwdMatch.value) {
      console.warn('⚠️ [RESET-SUBMIT] Contraseñas no coinciden');
      notifyError('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (!userEmail.value || !resetCode.value) {
      console.error('❌ [RESET-SUBMIT] Datos faltantes para enviar');
      console.error('❌ [RESET-SUBMIT] - userEmail:', userEmail.value);
      console.error('❌ [RESET-SUBMIT] - resetCode:', resetCode.value);
      notifyError('Error', 'No se pudo identificar tu cuenta.');
      router.push('/forgot')
      return
    }

    loading.value = true
    const loadingToast = notifyLoading('Guardando contraseña', 'Procesando...')

    try {
      const result = await ResetApi.resetPassword({
        email: userEmail.value,
        password: password.value,
        code: resetCode.value,
      })

      loadingToast?.resolve({
        title: 'Contraseña actualizada',
        message: 'Tu contraseña ha sido restablecida.',
      })

      // Limpiar datos de sesión
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_code')
      sessionStorage.removeItem('reset_token_expiry')
      localStorage.removeItem('verify_email')
      localStorage.removeItem('verification_purpose')


      setTimeout(() => {
        router.push(R.to('login'))
      }, 1500)

    } catch (err) {
      console.error('❌ [RESET-SUBMIT] Error completo:', err);
      
      const errorMsg = parseAxiosError(err) || 'No se pudo restablecer la contraseña'
      console.error('❌ [RESET-SUBMIT] Mensaje de error:', errorMsg);
      
      loadingToast?.reject({ 
        title: 'Error', 
        message: errorMsg 
      })
    } finally {
      loading.value = false
    }
  }

  function goLogin() {
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