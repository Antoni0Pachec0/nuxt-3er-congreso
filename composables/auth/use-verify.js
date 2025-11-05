// composables/auth/use-verify.js
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VerifyApi } from '@/backend/auth/verify-api'
import { parseAxiosError } from '@/backend/http/error'

// 👇 Adaptador para notificaciones
import { createNotifyAdapter } from '@/utils/notify/adapter'

export function useVerify () {
  const router = useRouter()
  const route  = useRoute()

  // Notificaciones
  const notify = typeof createNotifyAdapter === 'function'
    ? createNotifyAdapter()
    : null

  const notifyError   = (t, m) => notify?.('error',   t, m)
  const notifyWarning = (t, m) => notify?.('warning', t, m)
  const notifySuccess = (t, m) => notify?.('success', t, m)
  const notifyLoading = (t, m) => notify?.('loading', t, m)

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

  // ✅ CORREGIDO: Cargar email y propósito en mounted
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
      notifyError('Error', 'No se pudo pegar desde el portapapeles')
    }
  }

  // ===== Verificar código =====
  async function onVerify() {
    if (!email.value) {
      notifyWarning('Falta email', 'Vuelve al registro para obtener tu código.')
      router.push({ name: 'register' })
      return
    }
    if (!isComplete.value) {
      error.value = 'Completa los 6 dígitos antes de verificar.'
      return
    }

    loading.value = true
    error.value = ''

    try {
      const payload = { 
        email: email.value.toLowerCase().trim(), 
        code: code.value,
        token_type: verificationPurpose.value
      }

      console.log('Enviando verificación:', payload) // Debug

      // ✅ CORREGIDO: Usar VerifyApi correctamente
      const response = await VerifyApi.verifyCode(payload)

      console.log('Respuesta de verificación:', response) // Debug

      // Éxito - manejar según el propósito
      if (verificationPurpose.value === 'email_verification') {
        // Verificación de email exitosa
        sessionStorage.removeItem('verify_email')
        localStorage.removeItem('verify_email')
        localStorage.removeItem('verification_purpose')
        
        notifySuccess('¡Cuenta verificada!', 'Tu cuenta ha sido verificada exitosamente. Ahora puedes iniciar sesión.')
        setTimeout(() => {
          router.push({ name: 'login' })
        }, 1500)
      } else if (verificationPurpose.value === 'reset_password') {
        // Verificación de reset password exitosa
        notifySuccess('¡Código válido!', 'Ahora puedes establecer tu nueva contraseña.')
        setTimeout(() => {
          router.push({ 
            name: 'reset',
            query: { 
              email: email.value,
              code: code.value
            }
          })
        }, 1500)
      }

    } catch (err) {
      console.error('Error en verificación:', err) // Debug
      
      const msg = parseAxiosError(err) || 'Código inválido o expirado. Intenta de nuevo.'
      error.value = msg
      notifyError('Verificación fallida', msg)
      
      // Limpiar campos en caso de error
      digits.value = Array(DIGITS).fill('')
      await nextTick()
      focusIndex(0)
    } finally {
      loading.value = false
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
    
    // ✅ CORREGIDO: Usar notifyLoading en lugar de toast
    const loadingNotification = notifyLoading('Reenviando código', 'Generando un nuevo código de verificación…')
    
    try {
      await VerifyApi.resend({
        email: email.value.toLowerCase().trim(),
        purpose: verificationPurpose.value
      })

      // ✅ CORREGIDO: Usar resolve directamente
      if (loadingNotification?.resolve) {
        loadingNotification.resolve({
          title: 'Código reenviado',
          message: 'Revisa tu correo. Puede tardar unos segundos.',
          duration: 4000
        })
      } else {
        notifySuccess('Código reenviado', 'Revisa tu correo. Puede tardar unos segundos.')
      }
      
      startCooldown()
    } catch (err) {
      const status = err?.response?.status
      const msg = parseAxiosError(err) || 'No se pudo reenviar el código.'
      
      if (status === 429) {
        if (loadingNotification?.reject) {
          loadingNotification.reject({ title: 'Espera un momento', message: msg })
        } else {
          notifyWarning('Espera un momento', msg)
        }
        startCooldown()
        return
      }
      
      if (loadingNotification?.reject) {
        loadingNotification.reject({ title: 'No se pudo reenviar', message: msg })
      } else {
        notifyError('No se pudo reenviar', msg)
      }
    }
  }

  // ===== Lifecycle =====
  onMounted(async () => {
    // Si entró sin contexto, redirige al flujo correcto
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

    // Prefill por query ?code=XXXXXX
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