<template>
  <main id="login" class="login-screen auth" role="main">
    <Transition name="fade">
      <div
        v-if="notification.visible"
        :class="['app-alert', `app-alert--${notification.type}`]"
        role="alert"
      >
        <div class="alert-icon" aria-hidden="true">
          <SvgIcon :path="notification.icon" type="mdi" />
        </div>
        <div class="alert-content">
          <p class="alert-title">{{ notification.title }}</p>
          <p class="alert-message">{{ notification.message }}</p>
        </div>
        <button v-if="notification.type !== 'loading'" @click="notification.visible = false" class="alert-close" aria-label="Cerrar notificación">
          <SvgIcon :path="mdiClose" type="mdi" />
        </button>
      </div>
    </Transition>

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
import { definePageMeta, useRuntimeConfig } from '#imports'
import { ref } from 'vue'
<<<<<<< HEAD
import { useRouter, useRoute } from 'vue-router'
=======
import { useRoute } from '#app'
>>>>>>> fa1e64715c961dab029550c878acce2248c59faa
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiAccountCircleOutline,
  mdiEmailOutline,
  mdiLockOutline,
  mdiEyeOutline,
  mdiEyeOffOutline,
  mdiArrowLeft,
  mdiAlertCircleOutline, // Icono para Error
  mdiCheckCircleOutline, // Icono para Éxito
  mdiClockOutline,       // Icono para Carga
  mdiClose               // Icono para cerrar
} from '@mdi/js'

import { R } from '~/utils/app-routes'
import { ROUTES } from '~/plugins/http/routes'
import { parseAxiosError } from '~/plugins/http/error'
<<<<<<< HEAD
import { R } from '~/utils/app-routes'
// Nota: Deberás actualizar este archivo de CSS con los nuevos estilos para la alerta.
import '@/assets/css/styles/Login.css' 
=======
import { useAuthStore } from '~/stores/auth'
import '@/assets/css/styles/Login.css'
>>>>>>> fa1e64715c961dab029550c878acce2248c59faa

// Notificaciones básicas (puedes reemplazar con tu sistema de toasts)
function notifyError(title, message) {
  console.error(`[Error ${title}]: ${message}`)
}
function notifyLoading(title, message) {
  return {
    resolve: ({ title: t, message: m }) => console.log(`[Toast Closed]: ${t} - ${m}`)
  }
}

// -------------------------------------------------------------------------

definePageMeta({
  name: 'login',
  path: '/login',
  guestOnly: true,
})

const route = useRoute()
<<<<<<< HEAD
=======
const authStore = useAuthStore()
const config = useRuntimeConfig()
>>>>>>> fa1e64715c961dab029550c878acce2248c59faa

const email = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)
const apiError = ref('')

<<<<<<< HEAD
// NUEVO ESTADO PARA LA ALERTA INTEGRADA
const notification = ref({
  visible: false,
  title: '',
  message: '',
  type: 'error', // 'error', 'success', 'loading'
  icon: mdiAlertCircleOutline,
})

// Función para mostrar la alerta
function showNotification(title, message, type = 'error', autoHide = true) {
  notification.value = {
    visible: true,
    title,
    message,
    type,
    icon:
      type === 'success'
        ? mdiCheckCircleOutline
        : type === 'loading'
        ? mdiClockOutline
        : mdiAlertCircleOutline,
  }
  
  // Oculta automáticamente después de 5 segundos, a menos que sea tipo 'loading'
  if (autoHide && type !== 'loading') {
    setTimeout(() => {
      notification.value.visible = false
    }, 5000) 
  }
}

// Función para ocultar el estado de carga
function hideLoading() {
    if (notification.value.type === 'loading') {
        notification.value.visible = false
    }
}

=======
// -------------------------------
// 🔹 Funciones de navegación
// -------------------------------
>>>>>>> fa1e64715c961dab029550c878acce2248c59faa
function goHome() {
  return navigateTo(R.to('home'))
}

function onRegister() {
  return navigateTo(R.to('register'))
}

function onForgot() {
  return navigateTo(R.to('forgot'))
}

// -------------------------------
// 🔹 Envío de formulario (login)
// -------------------------------
async function onSubmit() {
  apiError.value = ''
  
  // Limpiar cualquier notificación previa
  notification.value.visible = false

  if (!email.value || !password.value) {
    // Reemplazo de notifyError
    showNotification(
      'Campos incompletos',
      'Por favor, llena todos los campos.',
      'error'
    )
    return
  }

  loading.value = true
  // Reemplazo de notifyLoading
  showNotification('Ingresando…', 'Estamos validando tus credenciales.', 'loading', false)

  try {
    const payload = {
      email: email.value.toLowerCase().trim(),
      password: password.value,
    }

<<<<<<< HEAD
    // 👇 Esencial: enviar cookies
    const { data } = await api.post(ROUTES.AUTH.LOGIN, payload, { withCredentials: true })
=======
    // Petición al backend
    const response = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: payload,
      credentials: 'include',
    })
>>>>>>> fa1e64715c961dab029550c878acce2248c59faa

    // 🔥 NUEVO: GUARDAR TOKENS EN LOCALSTORAGE SI VIENEN EN LA RESPUESTA
    if (response?.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }
    if (response?.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }

    // 🔹 Caso 1: verificación pendiente
    if (response?.require_verification) {
      const pendingEmail = response?.user?.email || payload.email
      sessionStorage.setItem('verify_email', pendingEmail)
      localStorage.setItem('verification_purpose', 'email_verification')

      // Reemplazo de toast.resolve (Verificación)
      showNotification(
        'Verificación requerida',
        'Tu cuenta aún no está activa. Revisa tu correo.',
        'error' // Se usa error para que el usuario tome acción inmediata
      )
      
      return router.push(R.to('verify'))
    }

<<<<<<< HEAD
    // 2. Manejo de Login Exitoso
    if (data?.message?.toLowerCase().includes('exitoso')) {
      const userId = data.user_id 
      
      console.log('Login exitoso. ID de usuario:', userId) 
      
      // Reemplazo de toast.resolve (Éxito)
      showNotification('¡Bienvenido!', data.message, 'success')

      // Redireccionar con un pequeño retraso para que se vea el mensaje
      const redirect = route.query?.redirect || R.path('userHome')
      setTimeout(() => {
        router.push(redirect)
      }, 1000)
      return
    }

    // 3. Respuesta inesperada (si el servidor no dio éxito ni verificación)
    const msg = data?.message || 'Respuesta inesperada del servidor.'
    showNotification('Error', msg, 'error')
    apiError.value = msg
=======
    // 🔹 Caso 2: login exitoso
    if (Number.isFinite(response?.user_id)) {
      const userId = response.user_id
      authStore.setUser({ id: userId, email: payload.email })
      authStore.setAuthenticated(true)

      // 🔥 GUARDAR USER ID
      localStorage.setItem('userId', userId.toString());

      toast?.resolve?.({
        title: '¡Bienvenido!',
        message: response?.message || 'Inicio de sesión exitoso.',
      })

      // Redirección
      const redirectParam = route.query?.redirect
      if (redirectParam) {
        return navigateTo(decodeURIComponent(String(redirectParam)))
      }

      return navigateTo('/user-home')
    }

    // 🔹 Caso 3: respuesta inesperada
    const fallbackMsg = response?.message || 'Respuesta inesperada del servidor.'
    notifyError('Error', fallbackMsg)
    apiError.value = fallbackMsg
>>>>>>> fa1e64715c961dab029550c878acce2248c59faa

  } catch (e) {
    const msg = parseAxiosError(e) || 'Error al iniciar sesión.'
    // Reemplazo de notifyError (Catch)
    showNotification('No se pudo iniciar sesión', msg, 'error')
    apiError.value = msg
    toast?.resolve?.({ title: 'Error', message: msg })
  } finally {
    loading.value = false
    hideLoading() // Ocultar el estado de carga
  }
}
<<<<<<< HEAD

</script>
<style>
/* ========================= */
/* ESTILOS PARA LA NUEVA ALERTA FLOTANTE */
/* ========================= */

.app-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 350px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  z-index: 1000; /* Asegura que esté por encima de todo */
}

/* Estilo para Errores */
.app-alert--error {
  background-color: #fef2f2; /* Rojo muy claro */
  border: 1px solid #fecaca; 
  color: #b91c1c; /* Texto rojo oscuro */
}

.app-alert--error .alert-icon svg {
  fill: #ef4444; /* Icono rojo */
}

/* Estilo para Éxito */
.app-alert--success {
  background-color: #f0fdf4; /* Verde muy claro */
  border: 1px solid #dcfce7;
  color: #15803d; /* Texto verde oscuro */
}

.app-alert--success .alert-icon svg {
  fill: #22c55e; /* Icono verde */
}

/* Estilo para Carga/Proceso */
.app-alert--loading {
  background-color: #eff6ff; /* Azul muy claro */
  border: 1px solid #dbeafe;
  color: #1e40af; /* Texto azul oscuro */
}

.app-alert--loading .alert-icon svg {
  fill: #3b82f6; /* Icono azul */
}

.alert-icon {
  margin-right: 10px;
  line-height: 0;
}

.alert-content {
  flex-grow: 1;
}

.alert-title {
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.alert-message {
  font-size: 0.9em;
  margin: 0;
}

.alert-close {
  background: none;
  border: none;
  padding: 0;
  margin-left: 15px;
  cursor: pointer;
  color: inherit; 
  line-height: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

.alert-close svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Transición de entrada/salida (Vue Transition) */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(100%); /* Desliza desde la derecha */
}
</style>
=======
</script>
>>>>>>> fa1e64715c961dab029550c878acce2248c59faa
