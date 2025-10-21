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
      <NuxtLink
        to="/"
        class="btn-back"
        aria-label="Regresar"
        :class="{ 'disabled-link': loading }"
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

          <!-- Botón de submit -->
          <button
            class="btn"
            type="submit"
            :disabled="isSubmitDisabled"
            :aria-busy="loading"
          >
            <span v-if="loading">Ingresando…</span>
            <span v-else>Iniciar Sesión</span>
          </button>

          <!-- Divider + Register -->
          <div class="divider">
            <span class="line"></span>
            <span class="muted">¿No tienes cuenta?</span>
            <span class="line"></span>
          </div>

          <!-- Registro -->
          <button
            type="button"
            class="btn ghost"
            @click="onRegister"
            :disabled="loading"
          >
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
import "@/assets/css/styles/auth/login.css";
import { useLogin } from "@/composables/auth/use-login";

import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiArrowRight,
  mdiEmailOutline,
  mdiLockOutline,
  mdiEyeOutline,
  mdiEyeOffOutline,
  mdiArrowLeft,
} from "@mdi/js";

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
</script>
