<template>
  <main class="home-page">
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
import { useAuthStore } from '~/stores/auth'
import { R } from '~/utils/app-routes'

definePageMeta({
  name: 'user-home',
  path: '/user-home',
  requiresAuth: true
})

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

function goToGame() {
  return navigateTo(R.path('game'))
}

async function handleLogout() {
  if (loading.value) return
  
  loading.value = true
  error.value = ''

  try {
    // Usar window.location para forzar la navegación y evitar middlewares
    await authStore.logout()
    
    // Forzar recarga completa para evitar problemas con middlewares
    window.location.href = '/login'
    
  } catch (err) {
    console.error('Error durante logout:', err)
    error.value = 'Error al cerrar sesión. Redirigiendo...'
    
    // Forzar redirección incluso con error
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  authStore.loadFromStorage()
})
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
  font-family: inherit;
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn.primary {
  background-color: #00b394;
  color: #fff;
  box-shadow: 0 6px 14px rgba(0, 179, 148, .35);
}
.btn.primary:hover:not(:disabled) { 
  background-color: #00a086; 
}

.btn.danger {
  background-color: #f57000;
  color: #fff;
  box-shadow: 0 6px 14px rgba(245, 112, 0, .35);
}
.btn.danger:hover:not(:disabled) { 
  background-color: #d55f00; 
}

.error-message {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 14px;
  background: rgba(255, 107, 107, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}
</style>