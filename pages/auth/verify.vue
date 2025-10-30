<template>
  <main id="verify" class="verify-screen" role="main">
    <!-- Fondo -->
    <div class="verify-bg" aria-hidden="true">
      <span class="blob blob--tl"></span>
      <span class="blob blob--br"></span>
      <span class="ring ring--1"></span>
      <span class="ring ring--2"></span>
      <span class="shape shape--sq"></span>
      <span class="shape shape--dot"></span>
    </div>

    <div class="verify-container">
      <!-- Hero / título -->
      <header class="verify-hero" aria-label="Identidad del evento">
        <h1 class="hero-title">
          <span class="kicker">3er</span>
          <span class="line1">Congreso</span>
          <span class="line2">Internacional</span>
        </h1>
        <p class="subtitle">Verifica tu código de seguridad</p>
      </header>

      <!-- Card -->
      <section class="cardVerify" aria-label="Verificación de código">
        <h2 class="card-title card-title--center">
          <span class="arrow" aria-hidden="true">
            <!-- SVG inline para evitar dependencias -->
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="w-6 h-6">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8Z"/>
            </svg>
          </span>
          <span class="card-title__text">Ingresa el código</span>
        </h2>

        <form class="form" @submit.prevent="onVerify" novalidate>
          <p class="muted center">
            Te enviamos un código de <strong>6 dígitos</strong> a
            <strong>{{ safeEmail }}</strong>.
          </p>

          <!-- OTP grid -->
          <div
            class="otp-grid"
            role="group"
            aria-label="Código de verificación de seis dígitos"
            @paste.stop.prevent="onPaste"
          >
            <input
              v-for="(_, i) in DIGITS"
              :key="i"
              :ref="(el) => (otpRefs[i] = el)"
              class="otp-input"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="1"
              autocomplete="one-time-code"
              :aria-label="`Dígito ${i + 1}`"
              :value="digits[i]"
              @input="onInput($event, i)"
              @keydown="onKeydown($event, i)"
              @focus="onFocus($event)"
              @paste.stop.prevent="onPaste"
              @beforeinput="onBeforeInput($event)"
            />
          </div>

          <!-- Botón 'Pegar' cuando hay permiso -->
          <div class="otp-actions">
            <button
              v-if="canUseClipboard"
              type="button"
              class="link"
              @click="pasteFromClipboard"
            >
              Pegar código desde portapapeles
            </button>
          </div>

          <!-- Error opcional -->
          <p v-if="error" class="help error">{{ error }}</p>

          <!-- CTA principal -->
          <button class="btn" type="submit" :disabled="loading || !isComplete">
            {{ loading ? 'Verificando…' : 'Verificar código' }}
          </button>

          <!-- Reenviar -->
          <div class="resend">
            <span class="muted">¿No recibiste el código?</span>
            <button
              type="button"
              class="link"
              :disabled="cooldown > 0 || loading"
              @click="resend"
            >
              {{ cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar código' }}
            </button>
          </div>

          <!-- Nota -->
          <p class="card-note">
            Tecnologías de la Información · Innovación Digital
          </p>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { definePageMeta } from '#imports'
import { useRouter, useRoute } from 'vue-router' // auto-import desactivado => importar explícitamente
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

import api from '~/backend/http/api'
import { ROUTES } from '~/backend/http/routes'
import { parseAxiosError } from '~/backend/http/error'
//import { notifyError, notifyWarning } from '~/utils/notify/adapter'
import { R } from '~/utils/app-routes'
import '@/assets/css/styles/auth/verify.css'

definePageMeta({
  name: 'verify',
  path: '/verify',
  guestOnly: true, // si hay token válido, el middleware te puede mandar al home
})

/* =========================
 * Estado
 * ========================= */
const router = useRouter()
const route  = useRoute()

const DIGITS = 6
const otpRefs = ref([]) 
const digits  = ref(Array(DIGITS).fill(''))
const loading = ref(false)
const error   = ref('')
const cooldown = ref(0)

const email = ref(import.meta.client ? (sessionStorage.getItem('verify_email') || '') : '')
const safeEmail = computed(() =>
  email.value
    ? email.value.replace(/(.{2}).+(@.+)/, (_, a, b) => a + '•••••' + b)
    : 'tu correo'
)

const code = computed(() => digits.value.join(''))
const isComplete = computed(() => /^\d{6}$/.test(code.value))
const canUseClipboard = ref(false)
let timer = null

/* =========================
 * Helpers OTP
 * ========================= */
function clampToDigit(val) {
  const m = (val || '').match(/\d/)
  return m ? m[0] : ''
}

function firstEmptyIndex() {
  const idx = digits.value.findIndex((d) => d === '')
  return idx === -1 ? DIGITS - 1 : idx
}

function focusIndex(i) {
  const el = otpRefs.value[i]
  if (el) el.focus()
}

function onInput(e, i) {
  error.value = ''
  const v = e.target.value

  // Si pega 2+ chars en un campo (iOS/Android) lo distribuimos
  if (v && v.length > 1) {
    distribute(v)
    return
  }

  const d = clampToDigit(v)
  digits.value[i] = d
  if (d && i < DIGITS - 1) focusIndex(i + 1)
}

function onKeydown(e, i) {
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

function onFocus(e) { e.target.select?.() }

function onBeforeInput(e) {
  if (e?.inputType === 'insertFromPaste' && e?.data) {
    e.preventDefault(); distribute(e.data)
  }
}

function onPaste(e) {
  const text = (e.clipboardData || window.clipboardData)?.getData('text') || ''
  if (!text) return
  e.preventDefault()
  distribute(text)
}

function distribute(text) {
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

/* =========================
 * Acciones
 * ========================= */
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
  //const toast = notifyLoading('Verificando código', 'Estamos validando tu código…')

  try {
    const payload = { email: email.value.toLowerCase().trim(), code: code.value }
    await api.post(ROUTES.AUTH.VERIFY, payload, { withCredentials: true })

    // Éxito
    sessionStorage.removeItem('verify_email')
    toast.resolve({ title: '¡Listo!', message: 'Código verificado. Ahora inicia sesión.' })
    router.push({ name: 'login' })
  } catch (err) {
    const msg = parseAxiosError(err) || 'Código inválido o expirado. Intenta de nuevo.'
    error.value = msg
    toast.reject({ title: 'Verificación fallida', message: msg })
    digits.value = Array(DIGITS).fill('')
    await nextTick()
    focusIndex(0)
  } finally {
    loading.value = false
  }
}

/* ======= Cooldown ======= */
const COOLDOWN_SECONDS = 30
const COOLDOWN_KEY = 'verify_cooldown_until'

function readCooldown() {
  const until = Number(localStorage.getItem(COOLDOWN_KEY) || 0)
  const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000))
  cooldown.value = remaining
  if (remaining > 0) runCooldown()
}

function runCooldown() {
  clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      clearInterval(timer)
      localStorage.removeItem(COOLDOWN_KEY)
    }
  }, 1000)
}

function startCooldown() {
  const until = Date.now() + COOLDOWN_SECONDS * 1000
  localStorage.setItem(COOLDOWN_KEY, String(until))
  cooldown.value = COOLDOWN_SECONDS
  runCooldown()
}

async function resend() {
  if (!email.value || cooldown.value > 0 || loading.value) return
  const toast = notifyLoading('Reenviando código', 'Generando un nuevo código de verificación…')
  try {
    await api.post(
      ROUTES.AUTH.RESEND,
      { email: email.value.toLowerCase().trim() },
      { withCredentials: true }
    )
    // Solo mostrar notificación desde el toast, no una adicional
    toast.resolve({ 
      title: 'Código reenviado', 
      message: 'Revisa tu correo. Puede tardar unos segundos.',
      duration: 4000 // Asegurar que tenga suficiente tiempo para ser leída
    })
    startCooldown()
  } catch (err) {
    const status = err?.response?.status
    const msg = parseAxiosError(err) || 'No se pudo reenviar el código.'
    if (status === 429) {
      // Respeta el cooldown del servidor también en el cliente
      toast.reject({ title: 'Espera un momento', message: msg })
      startCooldown()
      return
    }
    toast.reject({ title: 'No se pudo reenviar', message: msg })
  }
}

/* =========================
 * Lifecycle
 * ========================= */
onMounted(async () => {
  // Si entró sin contexto (por si el middleware no corrió)
  if (!email.value) {
    router.replace({ name: 'register' })
    return
  }

  canUseClipboard.value = typeof navigator !== 'undefined' && !!navigator.clipboard
  readCooldown()

  // Pre-rellenar si viene ?code=XXXXXX
  const qCode = String(route.query.code || '').trim()
  if (/^\d{6}$/.test(qCode)) distribute(qCode)

  await nextTick()
  focusIndex(firstEmptyIndex())
})

onBeforeUnmount(() => clearInterval(timer))
</script>
