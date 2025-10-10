<template>
  <main id="user-home" class="home-page">
    <div class="container">
      <h1 class="title">Bienvenido al 3er Congreso Internacional</h1>

      <p class="subtitle">
        Explora el juego o cierra sesión cuando termines.
      </p>

      <div class="button-group">
        <button
          class="btn primary"
          @click="goToGame"
          aria-label="Ir al juego"
          :disabled="loading"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else>Game</span>
        </button>

        <button
          class="btn danger"
          @click="handleLogout"
          aria-label="Cerrar sesión"
          :disabled="loading"
        >
          <span v-if="loading">Cerrando...</span>
          <span v-else>Cerrar Sesión</span>
        </button>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </main>
</template>

<script setup>
import { definePageMeta } from '#imports'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft } from '@mdi/js'
import { useUserHome } from '@/composables/auth/use-user-home'
import '@/assets/css/styles/user/home.css'

definePageMeta({
  name: 'user-home',
  path: '/user-home',
  alias: ['/user-home'],
  requiresAuth: true
})

const { loading, error, goToGame, handleLogout } = useUserHome()
</script>