// composables/auth/use-verify.js
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VerifyApi } from '@/backend/auth/verify-api'
import { parseAxiosError } from '@/backend/http/error'
import { createNotifyAdapter } from '@/utils/notify/adapter'

export function useVerify () {
  const router = useRouter()
  const route  = useRoute()
  const notify = createNotifyAdapter() // ✅ Agregar el adapter

  // ===== Constantes / helpers de OTP =====
  const DIGITS = 6
  const DIGITS_ARR = Array.from({ length: DIGITS }, (_, i) => i)

  const otpRefs = ref([])
  const digits  = ref(Array(DIGITS).fill(''))

  // ===== Estado general =====
  const loading  = ref(false)
  const error    = ref('')
  const cooldown = ref(0)
  const canUseClipboard = ref(false)

  // Email y propósito
  const email = ref('')
  const verificationPurpose = ref('email_verification')

  onMounted(() => {
    email.value = sessionStorage.getItem('verify_email') || 
                  localStorage.getItem('verify_email') || ''
    verificationPurpose.value = localStorage.getItem('verification_purpose') || 'email_verification'
  })

  const safeEmail = computed(() =>
    email.value
      ? email.value.replace(/(.{2}).+(@.+)/, (_, a, b) => a + '•••••' + b)
      : 'tu correo'
  )

  const code       = computed(() => digits.value.join(''))
  const isComplete = computed(() => /^\d{6}$/.test(code.value))

  // ===== OTP: helpers de UI =====
  function clampToDigit (val) {
    const m = (val || '').match(/\d/)
    return m ? m[0] : ''
  }

  function firstEmptyIndex () {
    const idx = digits.value.findIndex((d) => d === '')
    return idx === -1 ? DIGITS - 1 : idx
  }

  function focusIndex (i) {
    const el = otpRefs.value[i]
    if (el) el.focus()
  }

  function distribute (text) {
    const onlyDigits = (text.match(/\d/g) || []).slice(0, DIGITS)
    if (!onlyDigits.length) return

    let start = digits.value.findIndex((d) => d === '')
    if (start === -1) start = 0

    for (let j = 0; j < onlyDigits.length && start + j < DIGITS; j++) {
      digits.value[start + j] = onlyDigits[j]
    }

    const nextEmpty = firstEmptyIndex()
    focusIndex(nextEmpty)
  }

  // ===== OTP: handlers =====
  function onInput (e, i) {
    error.value = ''
    const v = e.target.value

    if (v && v.length > 1) {
      distribute(v)
      return
    }

    const d = clampToDigit(v)
    digits.value[i] = d
    if (d && i < DIGITS - 1) focusIndex(i + 1)
  }

  function onKeydown (e, i) {
    const key = e.key
    if (key === 'ArrowLeft' && i > 0) {
      e.preventDefault(); focusIndex(i - 1)
    }
    if (key === 'ArrowRight' && i < DIGITS - 1) {
      e.preventDefault(); focusIndex(i + 1)
    }

    if (key === 'Backspace') {
      if (digits.value[i]) {
        digits.value[i] = ''
        return
      }
      if (i > 0) {
        e.preventDefault()
        digits.value[i - 1] = ''
        focusIndex(i - 1)
      }
    }

    const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End']
    if (!allowed.includes(key) && !/^\d$/.test(key)) e.preventDefault()
  }

  function onFocus (e) {
    e.target.select?.()
  }

  function onBeforeInput (e) {
    if (e?.inputType === 'insertFromPaste' && e?.data) {
      e.preventDefault(); distribute(e.data)
    }
  }

  function onPaste (e) {
    const text = (e.clipboardData || window.clipboardData)?.getData('text') || ''
    if (!text) return
    e.preventDefault()
    distribute(text)
  }

  async function pasteFromClipboard () {
    try {
      const text = await navigator.clipboard.readText()
      if (text) distribute(text)
    } catch {
      error.value = 'No se pudo pegar desde el portapapeles'
    }
  }

  // ===== Verificar código =====
  async function onVerify() {
    if (!email.value) {
      error.value = 'Falta email. Vuelve al registro para obtener tu código.';
      return;
    }
    if (!isComplete.value) {
      error.value = 'Completa los 6 dígitos antes de verificar.';
      return;
    }

    loading.value = true;
    error.value = '';

    try {
      const payload = { 
        email: email.value.toLowerCase().trim(), 
        code: code.value,
        token_type: verificationPurpose.value === 'reset_password' 
          ? 'reset_password' 
          : 'email_verification'
      };

      console.log('📤 [FRONTEND] Enviando verificación:', payload);

      const response = await VerifyApi.verifyCode(payload);
      console.log('✅ [FRONTEND] Respuesta de verificación:', response);

      // ✅ MOSTRAR NOTIFICACIÓN DE ÉXITO
      notify('success', '¡Código verificado!', 'Tu código ha sido verificado correctamente.');

      // ✅ CORREGIDO: Para reset_password, guardar el código en sessionStorage
      if (verificationPurpose.value === 'reset_password') {
        sessionStorage.setItem('reset_code', code.value);
        sessionStorage.setItem('reset_email', email.value);
        sessionStorage.setItem('reset_token_expiry', String(Date.now() + 15 * 60 * 1000)); // 15 min
      }

      // Limpiar almacenamiento
      sessionStorage.removeItem('verify_email');
      localStorage.removeItem('verify_email');
      localStorage.removeItem('verification_purpose');
      
      console.log('🎉 [FRONTEND] Verificación exitosa');

      // ✅ ESPERAR ANTES DE REDIRIGIR
      setTimeout(() => {
        if (verificationPurpose.value === 'email_verification') {
          router.push({ name: 'login' });
        } else if (verificationPurpose.value === 'reset_password') {
          router.push({ 
            name: 'reset',
            query: { 
              email: encodeURIComponent(email.value),
              // No necesitamos pasar el código en query params si lo guardamos en sessionStorage
            }
          });
        }
      }, 2000);

    } catch (err) {
      console.error('❌ [FRONTEND] Error en verificación:', err);
      
      const msg = parseAxiosError(err) || 'Código inválido o expirado. Intenta de nuevo.';
      error.value = msg;
      
      notify('error', 'Error de verificación', msg);
      
      digits.value = Array(DIGITS).fill('');
      await nextTick();
      focusIndex(0);
    } finally {
      loading.value = false;
    }
  }

  // ===== Cooldown (reenviar) =====
  const COOLDOWN_SECONDS = 30
  const COOLDOWN_KEY = 'verify_cooldown_until'
  let timer = null

  function readCooldown () {
    const until = Number(localStorage.getItem(COOLDOWN_KEY) || 0)
    const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000))
    cooldown.value = remaining
    if (remaining > 0) runCooldown()
  }

  function runCooldown () {
    clearInterval(timer)
    timer = setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0) {
        clearInterval(timer)
        localStorage.removeItem(COOLDOWN_KEY)
      }
    }, 1000)
  }

  function startCooldown () {
    const until = Date.now() + COOLDOWN_SECONDS * 1000
    localStorage.setItem(COOLDOWN_KEY, String(until))
    cooldown.value = COOLDOWN_SECONDS
    runCooldown()
  }

  async function resend () {
    if (!email.value || cooldown.value > 0 || loading.value) return
    
    loading.value = true;
    error.value = '';
    
    try {
      // ✅ MOSTRAR NOTIFICACIÓN DE CARGA
      const notification = notify('loading', 'Reenviando código', 'Por favor espera...');

      await VerifyApi.resend({
        email: email.value.toLowerCase().trim(),
        purpose: verificationPurpose.value
      });

      // ✅ RESOLVER NOTIFICACIÓN CON ÉXITO
      notification.resolve({
        title: 'Código reenviado',
        message: 'Revisa tu correo. Puede tardar unos segundos.'
      });

      console.log('✅ Código reenviado');
      
      startCooldown();
    } catch (err) {
      const status = err?.response?.status;
      const msg = parseAxiosError(err) || 'No se pudo reenviar el código.';
      
      if (status === 429) {
        console.warn('⚠️ Espera un momento:', msg);
        startCooldown();
        return;
      }
      
      console.error('❌ No se pudo reenviar:', msg);
      error.value = msg;
      
      // ✅ MOSTRAR NOTIFICACIÓN DE ERROR
      notify('error', 'Error al reenviar', msg);
    } finally {
      loading.value = false;
    }
  }

  // ===== Lifecycle =====
  onMounted(async () => {
    if (!email.value) {
      const purpose = localStorage.getItem('verification_purpose')
      if (purpose === 'reset_password') {
        router.replace('/forgot')
      } else {
        router.replace('/register')
      }
      return
    }

    canUseClipboard.value = typeof navigator !== 'undefined' && !!navigator.clipboard
    readCooldown()

    const qCode = String(route.query.code || '').trim()
    if (/^\d{6}$/.test(qCode)) distribute(qCode)

    await nextTick()
    focusIndex(firstEmptyIndex())
  })

  onBeforeUnmount(() => clearInterval(timer))

  // Exponer a la vista
  return {
    DIGITS_ARR,
    otpRefs,
    digits,
    safeEmail,
    loading,
    error,
    cooldown,
    isComplete,
    canUseClipboard,
    verificationPurpose,
    onVerify,
    onInput,
    onKeydown,
    onFocus,
    onBeforeInput,
    onPaste,
    pasteFromClipboard,
    resend,
  }
}