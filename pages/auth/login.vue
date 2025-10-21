<template>
  <main id="login" class="login-screen auth" role="main">
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
<<<<<<< HEAD
      <button
        type="button"
=======
      <NuxtLink
        to="/"
>>>>>>> origin/deploy
        class="btn-back"
        aria-label="Regresar"
<<<<<<< HEAD
=======
        :class="{ 'disabled-link': loading }"
>>>>>>> origin/deploy
      >
        <SvgIcon :path="mdiArrowLeft" type="mdi" />
      </NuxtLink>

      <!-- Columna izquierda / título -->
      <header class="login-hero" aria-label="Identidad del evento">
        <h1 class="hero-title">
          <span class="kicker">3er</span>
          <span class="line1">Congreso</span>
          <span class="line2">Internacional</span>
        </h1>
      </header>

      <!-- Columna derecha / Card -->
      <section class="cardLogin" aria-label="Formulario de inicio de sesión">
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
            <span class="input-icon">
              <SvgIcon :path="mdiEmailOutline" type="mdi" />
            </span>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              required
              maxlength="100"
              autocomplete="email"
              placeholder="tu@email.com"
              class="input"
            />
          </div>

<<<<<<< HEAD
          <!-- Password -->
          <div class="row">
            <label class="label" for="password">Contraseña</label>
            <button class="link" type="button" @click="onForgot">
              ¿Olvidaste tu contraseña?
            </button>
=======
          <!-- Contraseña -->
          <div class="form-group">
            <div class="row">
              <label class="label" for="password">Contraseña</label>
              <button
                class="link"
                type="button"
                @click="onForgot"
                :disabled="loading"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div class="input-wrap">
              <span class="input-icon">
                <SvgIcon :path="mdiLockOutline" type="mdi" />
              </span>
              <input
                id="password"
                :type="show ? 'text' : 'password'"
                v-model.trim="password"
                required
                minlength="8"
                maxlength="50"
                autocomplete="current-password"
                placeholder="••••••••"
                class="input input--pass"
                :class="{ 'input--error': apiError }"
                :disabled="loading"
                @input="apiError = ''"
              />
              <button
                type="button"
                class="eye"
                :aria-pressed="show ? 'true' : 'false'"
                :title="show ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="show = !show"
                :disabled="loading"
              >
                <SvgIcon v-if="show" :path="mdiEyeOffOutline" type="mdi" />
                <SvgIcon v-else :path="mdiEyeOutline" type="mdi" />
              </button>
            </div>
>>>>>>> origin/deploy
          </div>

          <div class="input-wrap">
            <span class="input-icon">
              <SvgIcon :path="mdiLockOutline" type="mdi" />
            </span>
            <input
              id="password"
              :type="show ? 'text' : 'password'"
              v-model.trim="password"
              required
              minlength="8"
              maxlength="50"
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

<<<<<<< HEAD
          <!-- Error -->
          <p v-if="apiError" class="help error">{{ apiError }}</p>

          <!-- CTA -->
          <button class="btn" type="submit" :disabled="loading">
            {{ loading ? 'Ingresando…' : 'Iniciar Sesión' }}
=======
          <!-- Botón de submit -->
          <button
            class="btn"
            type="submit"
            :disabled="isSubmitDisabled"
            :aria-busy="loading"
          >
            <span v-if="loading">Ingresando…</span>
            <span v-else>Iniciar Sesión</span>
>>>>>>> origin/deploy
          </button>

          <!-- Divider + Register -->
          <div class="divider">
            <span class="line"></span>
            <span class="muted">¿No tienes cuenta?</span>
            <span class="line"></span>
          </div>

<<<<<<< HEAD
          <button type="button" class="btn ghost" @click="onRegister">
=======
          <!-- Registro -->
          <button
            type="button"
            class="btn ghost"
            @click="onRegister"
            :disabled="loading"
          >
>>>>>>> origin/deploy
            Regístrate aquí
          </button>

          <p class="card-note">
            Tecnologías de la Información · Innovación Digital
          </p>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
<<<<<<< HEAD
import { definePageMeta } from '#imports'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'          // 👈 auto-imports off
import SvgIcon from '@jamescoyle/vue-icon'
=======
import "@/assets/css/styles/auth/login.css";
import { useLogin } from "@/composables/auth/use-login";

import SvgIcon from "@jamescoyle/vue-icon";
>>>>>>> origin/deploy
import {
  mdiArrowRight,
  mdiEmailOutline,
  mdiLockOutline,
  mdiEyeOutline,
  mdiEyeOffOutline,
  mdiArrowLeft,
} from "@mdi/js";

<<<<<<< HEAD
import api from '~/backend/http/api'
import { ROUTES } from '~/backend/http/routes'
import { parseAxiosError } from '~/backend/http/error'
import { R } from '~/utils/app-routes'
import '@/assets/css/styles/auth/login.css'

definePageMeta({
  name: 'login',
  path: '/login',
  guestOnly: true, // si ya está logueado, middleware lo manda a '/'
})

const router = useRouter()
const route  = useRoute()

const email = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)
const apiError = ref('')

function goHome() {
  router.push(R.to('home'))
}

function onRegister() {
  router.push(R.to('register'))
}

function onForgot() {
  router.push(R.to('verify'))
}

async function onSubmit() {
  apiError.value = ''
  if (!email.value || !password.value) {
    apiError.value = 'Por favor, llena todos los campos.'
    return
  }

  loading.value = true
  try {
    const payload = { email: email.value.toLowerCase().trim(), password: password.value }
    const { data } = await api.post(ROUTES.AUTH.LOGIN, payload, { withCredentials: true })

    // Caso: cuenta inactiva -> requiere verificación
    if (data?.require_verification) {
      // El backend te devuelve user: { email, user_id, name_user }
      const pendingEmail = data?.user?.email || payload.email
      sessionStorage.setItem('verify_email', pendingEmail)
      // Redirige a verificar
      router.push(R.to('verify'))
      return
    }

    // Caso: login exitoso
    // Tu backend devuelve: { message, accessToken, refreshToken, user_id }
    if (data?.accessToken) {
      // IMPORTANTE: la clave que lee tu middleware es 'accessToken'
      localStorage.setItem('accessToken', data.accessToken)
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
    }

    // Redirige a la vista home.vue en la carpeta user
    router.push(R.to('userHome'))
  } catch (e) {
    console.error('[Login] Error:', e)
    apiError.value = parseAxiosError(e) || 'Error al iniciar sesión.'
  } finally {
    loading.value = false
  }
}
=======
definePageMeta({
  name: "login",
  path: "/login",
  alias: ["/login"],
  guestOnly: true,
});

const {
  email,
  password,
  show,
  loading,
  apiError,
  isSubmitDisabled,
  onSubmit,
  goHome,
  onRegister,
  onForgot,
} = useLogin();
>>>>>>> origin/deploy
</script>
