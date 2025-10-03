<template>
  <main id="login" class="login-screen auth" role="main">
    <div class="login-bg" aria-hidden="true">
      <span class="blob blob--tl"></span>
      <span class="blob blob--br"></span>
      <span class="ring ring--1"></span>
      <span class="ring ring--2"></span>
      <span class="shape shape--sq"></span>
      <span class="shape shape--dot"></span>
    </div>

    <div class="login-container">
      <button
        type="button"
        class="btn-back"
        @click="goHome"
        aria-label="Regresar"
      >
        <SvgIcon :path="mdiArrowLeft" type="mdi" />
      </button>

      <header class="login-hero" aria-label="Identidad del evento">
        <h1 class="hero-title">
          <span class="kicker">3er</span>
          <span class="line1">Congreso</span>
          <span class="line2">Internacional</span>
        </h1>
      </header>

      <section class="cardLogin" aria-label="Formulario de inicio de sesión">
        <h2 class="card-title card-title--center">
          <span class="arrow" aria-hidden="true">
            <SvgIcon :path="mdiAccountCircleOutline" type="mdi" />
          </span>
          <span class="card-title__text">Iniciar Sesión</span>
        </h2>

        <form class="form" @submit.prevent="onSubmit" novalidate>
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

          <div class="row">
            <label class="label" for="password">Contraseña</label>
            <button class="link" type="button" @click="onForgot">
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

          <p v-if="apiError" class="help error">{{ apiError }}</p>

          <button class="btn" type="submit" :disabled="loading">
            {{ loading ? 'Ingresando…' : 'Iniciar Sesión' }}
          </button>

          <div class="divider">
            <span class="line"></span>
            <span class="muted">¿No tienes cuenta?</span>
            <span class="line"></span>
          </div>

          <button type="button" class="btn ghost" @click="onRegister">
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
import { definePageMeta } from '#imports'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiAccountCircleOutline,
  mdiEmailOutline,
  mdiLockOutline,
  mdiEyeOutline,
  mdiEyeOffOutline,
  mdiArrowLeft
} from '@mdi/js'

import api from '~/plugins/http/api'
import { ROUTES } from '~/plugins/http/routes'
import { parseAxiosError } from '~/plugins/http/error'
import { R } from '~/utils/app-routes'
import '@/assets/css/styles/Login.css'

// ⚠️ Importar el store de autenticación (Pinia)
import { useAuthStore } from '~/stores/auth'

// Mock de notificaciones (cámbialo por tu sistema de toasts)
function notifyError(title, message) {
  console.error(`[Error ${title}]: ${message}`)
}
function notifyLoading(title, message) {
  console.log(`[Loading ${title}]: ${message}`)
  return {
    resolve: ({ title: t, message: m }) => console.log(`[Toast Closed]: ${t} - ${m}`)
  }
}

// -------------------------------------------------------------------------

definePageMeta({
  name: 'login',
  path: '/login',
  guestOnly: true, // si ya está logueado, middleware lo manda a user-home
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

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
  router.push(R.to('forgot'))
}

async function onSubmit() {
  apiError.value = ''

  if (!email.value || !password.value) {
    notifyError('Campos incompletos', 'Por favor, llena todos los campos.')
    return
  }

  loading.value = true
  const toast = notifyLoading('Ingresando…', 'Estamos validando tus credenciales.')

  try {
    const payload = {
      email: email.value.toLowerCase().trim(),
      password: password.value,
    }

    const { data } = await api.post(ROUTES.AUTH.LOGIN, payload, { withCredentials: true })

    // 1) Verificación pendiente
    if (data?.require_verification) {
      const pendingEmail = data?.user?.email || payload.email
      sessionStorage.setItem('verify_email', pendingEmail)
      localStorage.setItem('verification_purpose', 'email_verification')

      toast?.resolve?.({
        title: 'Verificación requerida',
        message: 'Tu cuenta aún no está activa. Revisa tu correo.',
      })

      return router.push(R.to('verify'))
    }

    // 2) Login exitoso
    if (Number.isFinite(data?.user_id)) {
      const userId = data.user_id

      // Actualizar el store de autenticación
      authStore.setUser({ id: userId, email: payload.email })
      authStore.setAuthenticated(true)

      toast?.resolve?.({
        title: '¡Bienvenido!',
        message: data?.message || 'Inicio de sesión exitoso.',
      })

      // Redirección: respeta ?redirect=... si existe
      const redirectParam = route.query?.redirect
      if (redirectParam) {
        return router.push(decodeURIComponent(String(redirectParam)))
      }

      return router.push(R.to('userHome')) // user-home
    }

    // 3) Respuesta inesperada
    const fallbackMsg = data?.message || 'Respuesta inesperada del servidor.'
    notifyError('Error', fallbackMsg)
    apiError.value = fallbackMsg
  } catch (e) {
    const msg = parseAxiosError(e) || 'Error al iniciar sesión.'
    notifyError('No se pudo iniciar sesión', msg)
    apiError.value = msg
    toast?.resolve?.({ title: 'Error', message: msg })
  } finally {
    loading.value = false
  }
}
</script>
