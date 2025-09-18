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
      <section class="card" aria-label="Verificación de código">
        <h2 class="card-title card-title--center">
          <span class="arrow" aria-hidden="true">
            <SvgIcon :path="mdiShieldCheckOutline" type="mdi" />
          </span>
          <span class="card-title__text">Ingresa el código</span>
        </h2>

        <form class="form" @submit.prevent="onVerify" novalidate>
          <p class="muted center">Hemos enviado un código de 6 dígitos a tu correo.</p>

          <!-- OTP grid -->
          <div
            class="otp-grid"
            role="group"
            aria-label="Código de verificación de seis dígitos"
            @paste="onPaste"
          >
            <input
              v-for="(d, i) in digits"
              :key="i"
              ref="otpRefs"
              class="otp-input"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="1"
              autocomplete="one-time-code"
              :aria-label="`Dígito ${i+1}`"
              :value="digits[i]"
              @input="onInput($event, i)"
              @keydown="onKeydown($event, i)"
              @focus="onFocus($event)"
            />
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
              :disabled="cooldown>0 || loading"
              @click="resend"
            >
              {{ cooldown>0 ? `Reenviar en ${cooldown}s` : 'Reenviar código' }}
            </button>
          </div>

          <!-- Nota -->
          <p class="card-note">Tecnologías de la Información · Innovación Digital</p>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiShieldCheckOutline } from '@mdi/js'
import '@/assets/css/styles/Verify.css'

const DIGITS = 6
const digits = ref(Array(DIGITS).fill(''))
const otpRefs = ref([])
const loading = ref(false)
const error = ref('')
const cooldown = ref(30) // s para reenviar
let timer = null

const code = computed(() => digits.value.join(''))
const isComplete = computed(() => code.value.length === DIGITS && /^\d{6}$/.test(code.value))

function clampToDigit(val){
  const m = (val || '').match(/\d/)
  return m ? m[0] : ''
}

function focusIndex(i){
  const el = otpRefs.value[i]
  if (el) el.focus()
}

function onInput(e, i){
  error.value = ''
  const val = e.target.value
  // si pegó más de 1 char aquí, delega al onPaste (algunos navegadores lo pasan por input)
  if (val && val.length > 1){
    distribute(val)
    return
  }
  const d = clampToDigit(val)
  digits.value[i] = d
  if (d && i < DIGITS-1) focusIndex(i+1)
}

function onKeydown(e, i){
  const key = e.key
  // navegar con flechas
  if (key === 'ArrowLeft' && i>0) { e.preventDefault(); focusIndex(i-1) }
  if (key === 'ArrowRight' && i<DIGITS-1) { e.preventDefault(); focusIndex(i+1) }

  // backspace inteligente
  if (key === 'Backspace'){
    if (digits.value[i]){
      digits.value[i] = ''
      return
    }
    if (i>0){
      e.preventDefault()
      digits.value[i-1] = ''
      focusIndex(i-1)
    }
  }

  // bloquear letras/símbolos (permitir navegación/tab)
  const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End']
  if (!allowed.includes(key) && !/^\d$/.test(key)){
    // evita que se escriba algo no numérico
    e.preventDefault()
  }
}

function onFocus(e){
  // selecciona si hay un dígito
  e.target.select?.()
}

function onPaste(e){
  const text = (e.clipboardData || window.clipboardData)?.getData('text') || ''
  if (!text) return
  e.preventDefault()
  distribute(text)
}

function distribute(text){
  const onlyDigits = (text.match(/\d/g) || []).slice(0, DIGITS)
  if (!onlyDigits.length) return
  // rellena secuencialmente desde el primer vacío
  let start = digits.value.findIndex(d => d === '')
  if (start === -1) start = 0
  for (let j=0; j<onlyDigits.length && start+j < DIGITS; j++){
    digits.value[start+j] = onlyDigits[j]
  }
  // si ya está completo, focusea último; si no, el siguiente vacío
  const nextEmpty = digits.value.findIndex(d => d === '')
  focusIndex(nextEmpty === -1 ? DIGITS-1 : nextEmpty)
}

async function onVerify(){
  if (!isComplete.value) return
  loading.value = true
  error.value = ''
  try{
    // TODO: llamar a tu endpoint /verify-token con { code: code.value }
    await new Promise(r => setTimeout(r, 700))
    // Simulación ok -> redirige o emite evento
    console.log('Código verificado:', code.value)
    // window.location.href = '/dashboard'
  }catch(e){
    error.value = 'Código inválido o expirado. Intenta de nuevo.'
  }finally{
    loading.value = false
  }
}

function startCooldown(){
  clearInterval(timer)
  cooldown.value = 30
  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

function resend(){
  if (cooldown.value > 0) return
  // TODO: llamar a endpoint para reenviar
  console.log('Reenviando código…')
  startCooldown()
}

onMounted(async () => {
  startCooldown()
  await nextTick()
  focusIndex(0)
})

onBeforeUnmount(() => clearInterval(timer))
</script>
