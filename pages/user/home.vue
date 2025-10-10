<template>
  <main class="home-page">
    <div id="particles-js" aria-hidden="true"></div>

    <div class="home-container">
      <h1 class="home-title">Bienvenido al 3er Congreso Internacional</h1>

      <p class="home-subtitle">
        Explora el juego o cierra sesión cuando termines.
      </p>

      <div class="home-button-group">
        <button
          class="home-btn home-btn--primary"
          @click="goToGame"
          aria-label="Ir al juego"
          :disabled="loading"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else>Game</span>
        </button>
        <button
          class="home-btn home-btn--danger"
          @click="handleLogout"
          aria-label="Cerrar sesión"
          :disabled="loading"
        >
          <span v-if="loading">Cerrando...</span>
          <span v-else>Cerrar Sesión</span>
        </button>
      </div>

      <p v-if="error" class="home-error-message">{{ error }}</p>
    </div>
  </main>
</template>

<script setup>
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { R } from '~/utils/app-routes'
// Importa onUnmounted para limpiar las partículas
import { onMounted, onUnmounted, ref } from 'vue'

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
    await authStore.logout()
    window.location.href = '/login'
  } catch (err) {
    console.error('Error durante logout:', err)
    error.value = 'Error al cerrar sesión. Redirigiendo...'
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  } finally {
    loading.value = false
  }
}

// ====================================================================
// LÓGICA DE PARTICLES.JS (COPIADA)
// ====================================================================

const loadParticles = () => {
  if (typeof window.particlesJS !== 'undefined') {
    window.particlesJS('particles-js', {
      "particles": {
        "number": { "value": 160, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#b3d7ff" },
        "shape": { "type": "edge", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } },
        "opacity": { "value": 1, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0, "sync": false } },
        "size": { "value": 10, "random": true, "anim": { "enable": false, "speed": 4, "size_min": 0.3, "sync": false } },
        "line_linked": { "enable": false },
        "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": false, "mode": "bubble" }, "onclick": { "enable": false, "mode": "repulse" }, "resize": true },
        "modes": {
          "bubble": { "distance": 250, "size": 0, "duration": 2, "opacity": 0 },
          "repulse": { "distance": 400, "duration": 0.4 }
        }
      },
      "retina_detect": true
    });
  } else {
    console.error("particlesJS no está definido. Asegúrate de que el script de particles.js esté cargado.");
  }
}

// ====================================================================
// CICLO DE VIDA DE VUE
// ====================================================================

onMounted(() => {
  authStore.loadFromStorage()
  // Carga las partículas cuando el componente se monta
  loadParticles()
})

onUnmounted(() => {
  // Limpia la instancia de particles.js para evitar fugas de memoria
  if (typeof window.pJSDom !== 'undefined' && window.pJSDom.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
})

</script>

<style scoped>
.home-page {
  position: relative; /* Necesario para que el posicionamiento absoluto de las partículas funcione */
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: clamp(16px, 2vw, 32px);
  background: radial-gradient(120% 120% at 10% 10%, #0b1534 0%, #10308b 60%, #0b1534 100%);
  color: #fff;
  font-family: 'Orbitron', sans-serif;
  overflow: hidden; /* Evita barras de desplazamiento por las partículas */
}

/* Estilos para el contenedor de partículas */
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1; /* Detrás del contenido */
}

.home-container {
  position: relative; /* Asegura que el contenido esté sobre las partículas */
  z-index: 2; /* Encima del z-index de particles-js */
  width: min(100%, 920px);
  text-align: center;
  padding: clamp(16px, 4vw, 48px);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(6px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .3);
}

.home-title {
  font-size: clamp(24px, 4vw, 40px);
  line-height: 1.15;
  margin: 0 0 12px;
}

.home-subtitle {
  font-size: clamp(14px, 2.2vw, 18px);
  opacity: .9;
  margin: 0 0 24px;
}

.home-button-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  justify-items: center;
}

@media (min-width: 560px) {
  .home-button-group {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
    gap: 16px;
  }
}

.home-btn {
  width: 100%;
  max-width: 260px;
  padding: 12px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: .3px;
  transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease;
  font-family: inherit;
}

.home-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.home-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.home-btn--primary {
  background-color: #00b394;
  color: #fff;
  box-shadow: 0 6px 14px rgba(0, 179, 148, .35);
}
.home-btn--primary:hover:not(:disabled) {
  background-color: #00a086;
}

.home-btn--danger {
  background-color: #f57000;
  color: #fff;
  box-shadow: 0 6px 14px rgba(245, 112, 0, .35);
}
.home-btn--danger:hover:not(:disabled) {
  background-color: #d55f00;
}

.home-error-message {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 14px;
  background: rgba(255, 107, 107, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

</style>

