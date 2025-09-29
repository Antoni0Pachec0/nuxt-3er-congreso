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
            <input 
              id="password" 
              v-model="password" 
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
              v-model="password2" 
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

          <small v-if="password2 && password2 !== password" class="help error">
            Las contraseñas no coinciden.
          </small>

          <button class="btn" type="submit" :disabled="loading || password !== password2 || !password">
            {{ loading ? "Guardando…" : "Guardar nueva contraseña" }}
          </button>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { definePageMeta } from '#imports';

definePageMeta({
  name: 'reset',
  path: '/reset',
  guestOnly: true,
})

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLockOutline, mdiLockCheckOutline, mdiEye, mdiEyeOff } from '@mdi/js';
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
const userEmail = ref("");
const showPassword = ref(false);
const showPassword2 = ref(false);

onMounted(() => {
  console.log('🔍 Reset page mounted')
  
  // ✅ MÉTODO MÁS SEGURO: Usar token temporal en lugar de email en URL
  const resetToken = sessionStorage.getItem('reset_token')
  const resetEmail = sessionStorage.getItem('reset_email')
  const tokenExpiry = sessionStorage.getItem('reset_token_expiry')
  
  console.log('🔍 Reset token:', resetToken ? 'Present' : 'Missing')
  console.log('🔍 Reset email:', resetEmail ? 'Present' : 'Missing')
  
  if (!resetToken || !resetEmail) {
    console.log('❌ No reset token found, redirecting to forgot')
    notifyError('Error', 'Sesión expirada. Por favor, solicita un nuevo código.')
    router.push('/forgot')
    return
  }
  
  // Verificar expiración
  if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    console.log('❌ Reset token expired')
    sessionStorage.removeItem('reset_token')
    sessionStorage.removeItem('reset_email')
    sessionStorage.removeItem('reset_token_expiry')
    notifyError('Error', 'Sesión expirada. Por favor, solicita un nuevo código.')
    router.push('/forgot')
    return
  }
  
  userEmail.value = resetEmail
  console.log('✅ Valid reset session found for:', userEmail.value)
});

async function onSubmit() {
  if (password.value !== password2.value) {
    notifyError('Error', 'Las contraseñas no coinciden.')
    return;
  }

  if (!userEmail.value) {
    notifyError('Error', 'No se pudo identificar tu cuenta. Por favor, intenta nuevamente.');
    router.push('/forgot');
    return;
  }

  loading.value = true;
  const toast = notifyLoading('Guardando contraseña', 'Procesando tu solicitud...');

  try {
    console.log('🔍 Sending reset request for:', userEmail.value)
    const response = await api.post(ROUTES.AUTH.RESET_PASSWORD, {
      email: userEmail.value,
      password: password.value,
    });

    console.log('✅ Reset successful:', response)

    toast.resolve({
      title: 'Contraseña actualizada',
      message: 'Tu contraseña ha sido restablecida con éxito'
    });

    // Limpiar todo el contexto
    sessionStorage.removeItem('verify_email');
    localStorage.removeItem('verify_email');
    localStorage.removeItem('verification_purpose');
    sessionStorage.removeItem('reset_token');
    sessionStorage.removeItem('reset_email');
    sessionStorage.removeItem('reset_token_expiry');

    // Redirigir al login
    setTimeout(() => {
      router.push(R.to('login'));
    }, 1500);
  } catch (error) {
    console.error('❌ Reset error:', error)
    const errorMsg = parseAxiosError(error) || 'No se pudo restablecer la contraseña';
    toast.reject({
      title: 'Error',
      message: errorMsg
    });
    loading.value = false;
  }
}
</script>
