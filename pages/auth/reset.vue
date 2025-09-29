<template>
  <main id="reset" class="auth-screen">
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
          <input id="password" v-model="password" type="password" minlength="8" required class="input" placeholder="••••••••" />

          <label class="label" for="password2">Confirmar contraseña</label>
          <input id="password2" v-model="password2" type="password" minlength="8" required class="input" placeholder="••••••••" />

          <small v-if="password2 && password2 !== password" class="help error">
            Las contraseñas no coinciden.
          </small>

          <button class="btn" type="submit" :disabled="loading || password !== password2">
            {{ loading ? "Guardando…" : "Guardar nueva contraseña" }}
          </button>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "~/plugins/http/api";
import { ROUTES } from "~/plugins/http/routes";
import '@/assets/css/styles/Register.css';
import '@/assets/css/styles/Reset.css';

const route = useRoute();
const router = useRouter();
const password = ref("");
const password2 = ref("");
const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  try {
    await api.post(ROUTES.AUTH.RESET_PASSWORD, {
      email: route.query.email,
      password: password.value,
    });
    router.push("/login");
  } finally {
    loading.value = false;
  }
}
</script>
