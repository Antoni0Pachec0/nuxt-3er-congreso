<template>
  <main id="reset" class="auth-screen">
    <button type="button" class="btn-back" @click="goLogin" aria-label="Regresar">
      <SvgIcon :path="mdiArrowLeft" type="mdi" />
    </button>

    <div class="auth-bg" aria-hidden="true">
      <span class="blob blob--tl"></span>
      <span class="blob blob--br"></span>
    </div>

    <div class="auth-container">
      <header class="auth-hero">
        <h1 class="hero-title">
          <span class="kicker">3er</span>
          <span class="line1">Congreso</span>
          <span class="line2">Internacional</span>
        </h1>
        <p class="subtitle">Restablecer contraseña</p>
      </header>

      <section class="cardLogin">
        <h2 class="card-title card-title--center">Nueva contraseña</h2>

        <form class="form" @submit.prevent="onSubmit">
          <label class="label" for="password">Contraseña</label>
          <div class="input-wrap">
            <span class="input-icon">
              <SvgIcon :path="mdiLockOutline" type="mdi" />
            </span>
            <input
              id="password"
              v-model.trim="password"
              :type="showPassword ? 'text' : 'password'"
              minlength="8"
              maxlength="50"
              required
              class="input"
              placeholder="••••••••"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <SvgIcon :path="showPassword ? mdiEyeOff : mdiEye" type="mdi" />
            </button>
          </div>

          <label class="label" for="password2">Confirmar contraseña</label>
          <div class="input-wrap">
            <span class="input-icon">
              <SvgIcon :path="mdiLockCheckOutline" type="mdi" />
            </span>
            <input
              id="password2"
              v-model.trim="password2"
              :type="showPassword2 ? 'text' : 'password'"
              minlength="8"
              maxlength="50"
              required
              class="input"
              placeholder="••••••••"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword2 = !showPassword2"
              :aria-label="showPassword2 ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <SvgIcon :path="showPassword2 ? mdiEyeOff : mdiEye" type="mdi" />
            </button>
          </div>

          <small v-if="password2 && !pwdMatch" class="help error">
            Las contraseñas no coinciden.
          </small>

          <button class="btn" type="submit" :disabled="!canSubmit || loading">
            {{ loading ? 'Guardando…' : 'Guardar nueva contraseña' }}
          </button>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { definePageMeta } from '#imports'
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiArrowLeft,
  mdiLockOutline,
  mdiLockCheckOutline,
  mdiEye,
  mdiEyeOff
} from '@mdi/js'
import { useReset } from '@/composables/auth/use-reset'
import '@/assets/css/styles/auth/reset.css'

definePageMeta({
  name: 'reset',
  path: '/reset',
  alias: ['/reset'],
  guestOnly: true,
})

const {
  // estado
  password, password2,
  showPassword, showPassword2,
  loading, pwdMatch, canSubmit,

  // acciones
  onSubmit, goLogin
} = useReset()
</script>
