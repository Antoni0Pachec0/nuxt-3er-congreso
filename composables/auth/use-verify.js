// composables/auth/use-verify.js
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VerifyApi } from '@/backend/auth/verify-api'
import { parseAxiosError } from '@/backend/http/error'

// 👇 Adaptador para notificaciones (igual que en los otros composables)
import { createNotifyAdapter } from '@/utils/notify/adapter'

export function useVerify () {
  const router = useRouter()
  const route  = useRoute()

  // ---------------------------------
  // Notificaciones (mismo patrón que use-register, use-reset, use-forgot)
  // ---------------------------------
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

  const otpRefs = ref([])             // refs de inputs
  const digits  = ref(Array(DIGITS).fill(''))  // valores por dígito

  // ===== Estado general =====
  const loading  = ref(false)
  const error    = ref('')
  const cooldown = ref(0)
  const canUseClipboard = ref(false)

  // Email y propósito (verificación o reset)
  const email = ref(import.meta.client
    ? (sessionStorage.getItem('verify_email') || localStorage.getItem('verify_email') || '')
    : ''
  )
  const verificationPurpose = ref(import.meta.client
    ? (localStorage.getItem('verification_purpose') || 'email_verification')
    : 'email_verification'
  )

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

    // Si pegaron varios de golpe en un input
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
  async function onVerify () {
    if (!email.value) {
      notifyWarning('Falta email', 'Debes iniciar el flujo desde registro o recuperación.')
      router.push('/register')
      return
    }
    if (!isComplete.value) {
      error.value = 'Completa los 6 dígitos antes de verificar.'
      return
    }

    loading.value = true
    error.value   = ''
    const toast = notifyLoading('Verificando código', 'Estamos validando tu código…')

    try {
      const payload = {
        email: String(email.value).toLowerCase().trim(),
        code:  code.value,
        token_type: verificationPurpose.value === 'reset_password'
          ? 'reset_password'
          : 'email_verification'
      }

      await VerifyApi.verifyCode(payload)

      // Limpieza
      sessionStorage.removeItem('verify_email')
      localStorage.removeItem('verify_email')

      if (verificationPurpose.value === 'reset_password') {
        localStorage.removeItem('verification_purpose')

        const resetToken = generateResetToken()
        sessionStorage.setItem('reset_token', resetToken)
        sessionStorage.setItem('reset_email', email.value)
        sessionStorage.setItem('reset_code', code.value)
        sessionStorage.setItem('reset_token_expiry', (Date.now() + 15 * 60 * 1000).toString())

        toast?.resolve({ title: '¡Código verificado!', message: 'Ahora puedes establecer tu nueva contraseña.' })
        setTimeout(() => router.push('/reset'), 1500)
      } else {
        localStorage.removeItem('verification_purpose')
        toast?.resolve({ title: '¡Listo!', message: 'Cuenta verificada exitosamente. Ahora inicia sesión.' })
        setTimeout(() => router.push('/login'), 1500)
      }
    } catch (err) {
      const msg = parseAxiosError(err) || 'Código inválido o expirado. Intenta de nuevo.'
      error.value = msg
      toast?.reject({ title: 'Verificación fallida', message: msg })
      digits.value = Array(DIGITS).fill('')
      await nextTick()
      focusIndex(0)
    } finally {
      loading.value = false
    }
  }

  // Token temporal (para reset)
  function generateResetToken () {
    return 'reset_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36)
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
    const toast = notifyLoading('Reenviando código', 'Generando un nuevo código de verificación…')
    try {
      await VerifyApi.resend({
        email: email.value.toLowerCase().trim(),
        purpose: verificationPurpose.value // 'email_verification' | 'reset_password'
      })

      toast?.resolve({
        title: 'Código reenviado',
        message: 'Revisa tu correo. Puede tardar unos segundos.',
        duration: 4000
      })
      startCooldown()
    } catch (err) {
      const status = err?.response?.status
      const msg = parseAxiosError(err) || 'No se pudo reenviar el código.'
      if (status === 429) {
        toast?.reject({ title: 'Espera un momento', message: msg })
        startCooldown()
        return
      }
      toast?.reject({ title: 'No se pudo reenviar', message: msg })
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
    // constantes/listas
    DIGITS_ARR,

    // estado
    otpRefs,
    digits,
    safeEmail,
    loading,
    error,
    cooldown,
    isComplete,
    canUseClipboard,

    // eventos/acciones
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