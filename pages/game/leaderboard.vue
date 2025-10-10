<template>
  <main class="leaderboard">
    <div class="leaderboard-header">
      <h1>🏆 Tabla de Clasificaciones</h1>
      <p class="subtitle">Top 10 mejores puntajes</p>
    </div>

    <div class="leaderboard-content">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando clasificaciones...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
        <button @click="loadLeaderboard" class="retry-btn">Reintentar</button>
      </div>

      <div v-else-if="leaderboard.length === 0" class="empty">
        <p>🎯 Aún no hay puntajes registrados</p>
        <p>Sé el primero en jugar y aparecerás aquí</p>
      </div>

      <div v-else class="table-container">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th class="rank-header">#</th>
              <th class="player-header">Jugador</th>
              <th class="score-header">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(user, index) in leaderboard" 
              :key="user.id || index"
              :class="{
                'first-place': index === 0,
                'second-place': index === 1,
                'third-place': index === 2,
                'other-place': index > 2
              }"
            >
              <td class="rank-cell">
                <span class="rank-number">{{ index + 1 }}</span>
                <span v-if="index === 0" class="medal">🥇</span>
                <span v-else-if="index === 1" class="medal">🥈</span>
                <span v-else-if="index === 2" class="medal">🥉</span>
              </td>
              <td class="player-cell">
                <div class="player-info">
                  <!-- ✅ CORREGIDO: Mejor lógica para mostrar nombres -->
                  <span class="player-name">{{ getUserDisplayName(user) }}</span>
                  <span 
                    class="player-email" 
                    v-if="shouldShowEmail(user)"
                  >
                    {{ user.email }}
                  </span>
                </div>
              </td>
              <td class="score-cell">
                <span class="score-value">{{ user.value }}</span>
                <span class="score-points">puntos</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="leaderboard-actions">
      <button @click="goBack" class="back-btn">
        ← Volver al Juego
      </button>
      <button @click="refreshLeaderboard" class="refresh-btn" :disabled="loading">
        🔄 Actualizar
      </button>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/css/styles/game/leaderboard.css'
import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'

definePageMeta({
  name: 'leaderboard',
  path: '/game/leaderboard',
  alias: ['/leaderboard'],
  requiresAuth: true,
})

const router = useRouter()
const leaderboard = ref([])
const loading = ref(true)
const error = ref(null)

// ✅ CORREGIDO: Función para determinar qué nombre mostrar
const getUserDisplayName = (user) => {
  if (user.name_user) return user.name_user
  if (user.email) return user.email.split('@')[0] // Mostrar solo la parte antes del @
  return 'Anónimo'
}

// ✅ CORREGIDO: Función para determinar si mostrar email
const shouldShowEmail = (user) => {
  return user.email && user.name_user // Solo mostrar email si también hay nombre
}

const loadLeaderboard = async () => {
  try {
    loading.value = true
    error.value = null
    console.log('🔄 Cargando leaderboard...')
    
    const response = await api.get(ROUTES.SCORES.LEADERBOARD)
    console.log('✅ Leaderboard cargado:', response.data)
    console.log('📊 Total de registros:', response.data.length) // ← Para verificar
    
    leaderboard.value = response.data
  } catch (err) {
    console.error('❌ Error cargando leaderboard:', err)
    error.value = err.response?.data?.message || err.message || 'Error al cargar las clasificaciones'
  } finally {
    loading.value = false
  }
}

const refreshLeaderboard = () => {
  loadLeaderboard()
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadLeaderboard()
})
</script>