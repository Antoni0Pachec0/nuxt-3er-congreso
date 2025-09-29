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
          <div class="input-wrap">
            <span class="input-icon">
              <SvgIcon :path="mdiLockOutline" type="mdi" />
            </span>
            <input id="password" v-model="password" type="password" minlength="8" maxlength="50" required class="input" placeholder="••••••••" />
          </div>

          <label class="label" for="password2">Confirmar contraseña</label>
          <div class="input-wrap">
            <span class="input-icon">
              <SvgIcon :path="mdiLockCheckOutline" type="mdi" />
            </span>
            <input id="password2" v-model="password2" type="password" minlength="8" maxlength="50" required class="input" placeholder="••••••••" />
          </div>

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
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLockOutline, mdiLockCheckOutline } from '@mdi/js';
import api from "~/plugins/http/api";
import { ROUTES } from "~/plugins/http/routes";
import { parseAxiosError } from '~/plugins/http/error';
import { notifyLoading, notifyError } from '~/utils/notifications';
import { R } from '~/utils/app-routes';
import '@/assets/css/styles/Register.css';
import '@/assets/css/styles/Reset.css';

const route = useRoute();
const router = useRouter();
const password = ref("");
const password2 = ref("");
const loading = ref(false);

async function onSubmit() {
  if (password.value !== password2.value) {
    return; // Form validation should prevent this anyway
  }

  loading.value = true;
  const toast = notifyLoading('Guardando contraseña', 'Procesando tu solicitud...');

  try {
    await api.post(ROUTES.AUTH.RESET_PASSWORD, {
      email: route.query.email,
      password: password.value,
    });

    toast.resolve({
      title: 'Contraseña actualizada',
      message: 'Tu contraseña ha sido restablecida con éxito'
    });

    // Redirigir después de un breve momento para que se vea la notificación
    setTimeout(() => {
      router.push(R.to('login'));
    }, 1500);
  } catch (error) {
    const errorMsg = parseAxiosError(error) || 'No se pudo restablecer la contraseña';
    toast.reject({
      title: 'Error',
      message: errorMsg
    });
    loading.value = false;
  }
}
</script>
