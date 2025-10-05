<template>
  <main class="home-page">
    <div class="container">
      <h1 class="title">Bienvenido al 3er Congreso Internacional</h1>

      <p class="subtitle">
        Explora el juego o cierra sesión cuando termines.
      </p>

      <div class="button-group">
        <button class="btn primary" @click="goToGame" aria-label="Ir al juego">
          Game
        </button>
        <button class="btn danger" @click="logout" aria-label="Cerrar sesión">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { R } from '~/utils/app-routes'

definePageMeta({
  name: 'user-home',
  path: '/user-home',
  requiresAuth: true
})

const authStore = useAuthStore()

function goToGame() {
  return navigateTo(R.path('game')) // 👈 usa tu tabla de rutas
}

async function logout() {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Error durante logout:', error)
    await navigateTo('/login')
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: clamp(16px, 2vw, 32px);
  background: radial-gradient(120% 120% at 10% 10%, #0b1534 0%, #10308b 60%, #0b1534 100%);
  color: #fff;
  font-family: 'Orbitron', sans-serif;
}

.container {
  width: min(100%, 920px);
  text-align: center;
  padding: clamp(16px, 4vw, 48px);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(6px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .3);
}

.title {
  font-size: clamp(24px, 4vw, 40px);
  line-height: 1.15;
  margin: 0 0 12px;
}

.subtitle {
  font-size: clamp(14px, 2.2vw, 18px);
  opacity: .9;
  margin: 0 0 24px;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  justify-items: center;
}

@media (min-width: 560px) {
  .button-group {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
    gap: 16px;
  }
}

.btn {
  width: 100%;
  max-width: 260px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: .3px;
  transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn.primary {
  background-color: #00b394;
  color: #fff;
  box-shadow: 0 6px 14px rgba(0, 179, 148, .35);
}
.btn.primary:hover { background-color: #00a086; }

.btn.danger {
  background-color: #f57000;
  color: #fff;
  box-shadow: 0 6px 14px rgba(245, 112, 0, .35);
}
.btn.danger:hover { background-color: #d55f00; }
</style>
