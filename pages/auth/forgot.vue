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
            <input
              id="email"
              v-model.trim="email"
              type="email"
              required
              maxlength="100"
              placeholder="tu@email.com"
              class="input"
            />
          </div>

          <button class="btn" type="submit" :disabled="loading">
            {{ loading ? 'Enviando…' : 'Enviar código' }}
          </button>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { definePageMeta } from '#imports'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft, mdiEmailOutline } from '@mdi/js'
import { useForgot } from '@/composables/auth/use-forgot'
import '@/assets/css/styles/auth/forgot.css'

definePageMeta({
  name: 'forgot',
  path: '/forgot',
  alias: ['/forgot'],
  guestOnly: true,
})

const { email, loading, onSubmit, goLogin } = useForgot()
</script>
