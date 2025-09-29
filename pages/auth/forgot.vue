<template>
  <main id="forgot" class="auth-screen">
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
            <span class="input-icon"><SvgIcon :path="mdiEmailOutline" type="mdi" /></span>
            <input id="email" v-model.trim="email" type="email" required placeholder="tu@email.com" class="input" />
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
import { ref } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiEmailOutline } from "@mdi/js";
import api from "~/plugins/http/api";
import { ROUTES } from "~/plugins/http/routes";
import '@/assets/css/styles/Register.css';
import '@/assets/css/styles/Forgot.css';

const email = ref("");
const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  try {
    await api.post(ROUTES.AUTH.FORGOT_PASSWORD, { email: email.value });
    localStorage.setItem("verify_email", email.value);
    window.location.href = "/verify"; // ir al mismo verify
  } finally {
    loading.value = false;
  }
}
</script>
