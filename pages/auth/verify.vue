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
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useVerify } from '@/composables/auth/use-verify'
import '@/assets/css/styles/auth/verify.css'

definePageMeta({
  name: 'verify',
  path: '/verify',
  guestOnly: true,
})

// ✅ USAR EL COMPOSABLE CORREGIDO
const {
  DIGITS_ARR: DIGITS,
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
} = useVerify()

// ✅ AGREGAR DEBUG PARA VERIFICAR DATOS
onMounted(() => {
  console.log('🔍 [VISTA VERIFY] Datos cargados:', {
    email: sessionStorage.getItem('verify_email') || localStorage.getItem('verify_email'),
    purpose: localStorage.getItem('verification_purpose'),
    verificationPurpose: verificationPurpose.value,
    safeEmail: safeEmail.value
  })
})
</script>