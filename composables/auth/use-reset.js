// composables/auth/use-reset.js
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ResetApi } from '@/backend/auth/reset-api'
import { parseAxiosError } from '@/backend/http/error'
import { R } from '@/utils/app-routes'

// 👇 Adaptador para notificaciones (igual que en use-register)
import { createNotifyAdapter } from '@/utils/notify/adapter'

export function useReset () {
  const router = useRouter()

  // ---------------------------------
  // Notificaciones (igual que en use-register)
  // ---------------------------------
  const notify = typeof createNotifyAdapter === 'function'
    ? createNotifyAdapter()
    : null

  const notifyError   = (t, m) => notify?.('error',   t, m)
  const notifyWarning = (t, m) => notify?.('warning', t, m)
  const notifySuccess = (t, m) => notify?.('success', t, m)
  const notifyLoading = (t, m) => notify?.('loading', t, m)

  // estado UI
  const password   = ref('')
  const password2  = ref('')
  const showPassword  = ref(false)
  const showPassword2 = ref(false)
  const loading    = ref(false)

  // contexto de sesión (email + código + token)
  const userEmail = ref('')
  const resetCode = ref('')

  // composables/auth/use-reset.js
  onMounted(() => {
    console.log('🚀 [RESET] Composable montado - verificando sessionStorage');
    
    // Verificar TODOS los items en sessionStorage para debug
    const allSessionItems = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      allSessionItems[key] = sessionStorage.getItem(key);
    }
    
    console.log('📋 [RESET] Todo el sessionStorage:', allSessionItems);

    const resetEmail  = sessionStorage.getItem('reset_email');
    const resetCode   = sessionStorage.getItem('reset_code');
    const tokenExpiry = sessionStorage.getItem('reset_token_expiry');

    console.log('🔍 [RESET] Datos específicos buscados:', { 
      resetEmail, 
      resetCode, 
      tokenExpiry
    });

    if (!resetEmail || !resetCode) {
      console.error('❌ [RESET] Faltan datos en sessionStorage');
      console.error('❌ [RESET] reset_email:', resetEmail);
      console.error('❌ [RESET] reset_code:', resetCode);
      
      notifyError('Error', 'Sesión expirada. Solicita un nuevo código.');
      
      // Redirigir a forgot pero manteniendo el email si está disponible
      const verifyEmail = sessionStorage.getItem('verify_email') || localStorage.getItem('verify_email');
      if (verifyEmail) {
        router.push(`/forgot?email=${encodeURIComponent(verifyEmail)}`);
      } else {
        router.push('/forgot');
      }
      return;
    }

    if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
      console.warn('⚠️ [RESET] Token expirado');
      sessionStorage.removeItem('reset_email');
      sessionStorage.removeItem('reset_code');
      sessionStorage.removeItem('reset_token_expiry');
      notifyError('Error', 'Sesión expirada. Solicita un nuevo código.');
      router.push('/forgot');
      return;
    }

    userEmail.value = resetEmail;
    resetCode.value = resetCode;
    
    console.log('✅ [RESET] Datos configurados correctamente:', {
      userEmail: userEmail.value,
      resetCode: resetCode.value
    });
  });

  // computed
  const pwdMatch   = computed(() => password.value && password.value === password2.value)
  const canSubmit  = computed(() =>
    !loading.value && pwdMatch.value && password.value.length >= 8 && password.value.length <= 50
  )

  // acciones
  async function onSubmit () {
    if (!pwdMatch.value) {
      notifyError('Error', 'Las contraseñas no coinciden.');
      return;
    }
    
    console.log('🔍 [RESET SUBMIT] Verificando datos:', {
      userEmail: userEmail.value,
      resetCode: resetCode.value,
      sessionStorage: {
        reset_email: sessionStorage.getItem('reset_email'),
        reset_code: sessionStorage.getItem('reset_code')
      }
    });

    if (!userEmail.value || !resetCode.value) {
      console.error('❌ [RESET SUBMIT] Datos faltantes');
      notifyError('Error', 'No se pudo identificar tu cuenta.');
      router.push('/forgot')
      return
    }

    loading.value = true
    const loadingToast = notifyLoading('Guardando contraseña', 'Procesando...')

    try {
      await ResetApi.resetPassword({
        email: userEmail.value,
        password: password.value,
        code: resetCode.value,
      })

      loadingToast?.resolve({
        title: 'Contraseña actualizada',
        message: 'Tu contraseña ha sido restablecida.',
      })

      // ✅ CORREGIDO: Limpiar solo los datos de reset, no todo
      sessionStorage.removeItem('reset_email')
      sessionStorage.removeItem('reset_code')
      sessionStorage.removeItem('reset_token_expiry')
      localStorage.removeItem('verify_email')
      localStorage.removeItem('verification_purpose')

      console.log('✅ [RESET SUBMIT] Contraseña actualizada exitosamente');

      setTimeout(() => router.push(R.to('login')), 1500)
    } catch (err) {
      const errorMsg = parseAxiosError(err) || 'No se pudo restablecer la contraseña'
      console.error('❌ [RESET SUBMIT] Error:', err);
      loadingToast?.reject({ title: 'Error', message: errorMsg })
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