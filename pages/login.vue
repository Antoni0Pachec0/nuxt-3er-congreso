<template>
  <main id="login" class="login-screen" role="main">
    <!-- Fondo decorativo -->
    <div class="login-bg" aria-hidden="true">
      <span class="blob blob--tl"></span>
      <span class="blob blob--br"></span>
      <span class="ring ring--1"></span>
      <span class="ring ring--2"></span>
      <span class="shape shape--sq"></span>
      <span class="shape shape--dot"></span>
    </div>

    <div class="login-container">
      <!-- Columna izquierda / título -->
      <header class="login-hero" aria-label="Identidad del evento">
        <h1 class="hero-title">
          <span class="kicker">3er</span>
          <span class="line1">Congreso</span>
          <span class="line2">Internacional</span>
        </h1>
      </header>

      <!-- Columna derecha / Card -->
      <section class="card" aria-label="Formulario de inicio de sesión">
        <!-- Título centrado -->
        <h2 class="card-title card-title--center">
          <span class="arrow" aria-hidden="true">
            <SvgIcon :path="mdiArrowRight" type="mdi" />
          </span>
          <span class="card-title__text">Iniciar Sesión</span>
        </h2>

        <form class="form" @submit.prevent="onSubmit" novalidate>
          <!-- Email -->
          <label class="label" for="email">Email</label>
          <div class="input-wrap">
            <span class="input-icon"><SvgIcon :path="mdiEmailOutline" type="mdi" /></span>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              required
              autocomplete="email"
              placeholder="tu@email.com"
              class="input"
            />
          </div>

          <!-- Password -->
          <div class="row">
            <label class="label" for="password">Contraseña</label>
            <button class="link" type="button" @click="onForgot">¿Olvidaste tu contraseña?</button>
          </div>

          <div class="input-wrap">
            <span class="input-icon"><SvgIcon :path="mdiLockOutline" type="mdi" /></span>
            <input
              id="password"
              :type="show ? 'text' : 'password'"
              v-model.trim="password"
              required
              minlength="6"
              autocomplete="current-password"
              placeholder="••••••••"
              class="input input--pass"
            />
            <button
              type="button"
              class="eye"
              :aria-pressed="show ? 'true' : 'false'"
              :title="show ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="show = !show"
            >
              <SvgIcon v-if="show" :path="mdiEyeOffOutline" type="mdi" />
              <SvgIcon v-else :path="mdiEyeOutline" type="mdi" />
            </button>
          </div>

          <!-- CTA -->
          <button class="btn" type="submit" :disabled="loading">
            {{ loading ? 'Ingresando…' : 'Iniciar Sesión' }}
          </button>

          <!-- Divider + Register -->
          <div class="divider">
            <span class="line"></span>
            <span class="muted">¿No tienes cuenta?</span>
            <span class="line"></span>
          </div>

          <button type="button" class="btn ghost" @click="onRegister">Regístrate aquí</button>

          <!-- Frase bajo el formulario -->
          <p class="card-note">Tecnologías de la Información · Innovación Digital</p>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiArrowRight, mdiEmailOutline, mdiLockOutline, mdiEyeOutline, mdiEyeOffOutline
} from '@mdi/js'
import '@/assets/css/styles/Login.css'

const email = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)

function onForgot () { console.log('forgot') }
async function onSubmit () {
  if (!email.value || !password.value) return
  loading.value = true
  try { await new Promise(r => setTimeout(r, 600)) } finally { loading.value = false }
}
function onRegister () { console.log('register') }
</script>
