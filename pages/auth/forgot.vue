<template>
  <main id="forgot" class="auth-screen">

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
        <p class="subtitle">Recuperar contraseña</p>
      </header>

      <section class="cardLogin">
        <h2 class="card-title card-title--center">Ingresa tu correo</h2>
        <form class="form" @submit.prevent="onSubmit">
          <label class="label" for="email">Email</label>
          <div class="input-wrap">
            <span class="input-icon">
              <SvgIcon :path="mdiEmailOutline" type="mdi" />
            </span>
            <input id="email" v-model.trim="email" type="email" required maxlength="100" placeholder="tu@email.com"
              class="input" />
          </div>

          <button class="btn" type="submit" :disabled="loading">
            {{ loading ? "Enviando…" : "Enviar código" }}
          </button>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  name: 'forgot',
  path: '/forgot',
  guestOnly: true,
})

import { ref } from "vue"
import { useRouter } from "vue-router"
import api from "~/plugins/http/api"
import { ROUTES } from "~/plugins/http/routes"
import { parseAxiosError } from '~/plugins/http/error'
import { notifyLoading, notifyError } from '~/utils/notifications'
import { R } from '~/utils/app-routes'
import '@/assets/css/styles/Forgot.css'
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft, mdiEmailOutline } from '@mdi/js';

const router = useRouter()
const email = ref("")
const loading = ref(false)

async function onSubmit() {
  if (!email.value || !email.value.includes('@')) {
    notifyError('Error', 'Por favor ingresa un correo válido')
    return
  }

  loading.value = true
  const toast = notifyLoading('Enviando código', 'Procesando tu solicitud...')

  try {
    await api.post(ROUTES.AUTH.FORGOT_PASSWORD, { email: email.value.toLowerCase().trim() })

    localStorage.setItem("verify_email", email.value.toLowerCase().trim())
    localStorage.setItem("verification_purpose", "reset_password") // 👈 IMPORTANTE

    toast.resolve({
      title: 'Código enviado',
      message: 'Revisa tu correo electrónico'
    })

    setTimeout(() => {
      router.push(R.to('verify'))
    }, 1500)
  } catch (error) {
    const errorMsg = parseAxiosError(error) || 'No se pudo procesar tu solicitud'
    toast.reject({ title: 'Error', message: errorMsg })
    loading.value = false
  }
}


function goLogin() {
  router.push(R.to('login'));
}
</script>
