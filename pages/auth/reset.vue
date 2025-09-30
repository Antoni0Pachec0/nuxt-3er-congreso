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
import { definePageMeta } from '#imports'
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import api from "~/plugins/http/api"
import { ROUTES } from "~/plugins/http/routes"
import { parseAxiosError } from '~/plugins/http/error'
import { notifyLoading, notifyError } from '~/utils/notifications'
import { R } from '~/utils/app-routes'
import '@/assets/css/styles/Reset.css'

definePageMeta({
  name: 'reset',
  path: '/reset',
  guestOnly: true,
})

const router = useRouter()
const password = ref("")
const password2 = ref("")
const userEmail = ref("")
const resetCode = ref("")   // 👈 nuevo
const loading = ref(false)

onMounted(() => {
  const resetToken = sessionStorage.getItem('reset_token')
  const resetEmail = sessionStorage.getItem('reset_email')
  const tokenExpiry = sessionStorage.getItem('reset_token_expiry')
  const code = sessionStorage.getItem('reset_code')   // 👈 recuperar

  if (!resetToken || !resetEmail || !code) {
    notifyError('Error', 'Sesión expirada. Solicita un nuevo código.')
    router.push('/forgot')
    return
  }

  if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    sessionStorage.clear()
    notifyError('Error', 'Sesión expirada. Solicita un nuevo código.')
    router.push('/forgot')
    return
  }

  userEmail.value = resetEmail
  resetCode.value = code
})

async function onSubmit() {
  if (password.value !== password2.value) {
    notifyError('Error', 'Las contraseñas no coinciden.')
    return
  }

  if (!userEmail.value || !resetCode.value) {
    notifyError('Error', 'No se pudo identificar tu cuenta.')
    router.push('/forgot')
    return
  }

  loading.value = true
  const toast = notifyLoading('Guardando contraseña', 'Procesando...')

  try {
    await api.post(ROUTES.AUTH.RESET_PASSWORD, {
      email: userEmail.value,
      password: password.value,
      code: resetCode.value   // 👈 enviar el código de 6 dígitos
    })

    toast.resolve({ title: 'Contraseña actualizada', message: 'Tu contraseña ha sido restablecida.' })

    sessionStorage.clear()
    localStorage.removeItem('verify_email')
    localStorage.removeItem('verification_purpose')

    setTimeout(() => router.push(R.to('login')), 1500)
  } catch (error) {
    const errorMsg = parseAxiosError(error) || 'No se pudo restablecer la contraseña'
    toast.reject({ title: 'Error', message: errorMsg })
    loading.value = false
  }
}
</script>
