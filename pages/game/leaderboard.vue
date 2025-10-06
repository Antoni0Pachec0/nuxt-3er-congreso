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
                  <span class="player-name">{{ user.name_user || user.email || 'Anónimo' }}</span>
                  <span class="player-email" v-if="user.email && user.name_user">{{ user.email }}</span>
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
import api from '@/plugins/http/api'
import { ROUTES } from '@/plugins/http/routes'

const router = useRouter()
const leaderboard = ref([])
const loading = ref(true)
const error = ref(null)

const loadLeaderboard = async () => {
  try {
    loading.value = true
    error.value = null
    console.log('🔄 Cargando leaderboard...')
    
    const response = await api.get(ROUTES.SCORES.LEADERBOARD)
    console.log('✅ Leaderboard cargado:', response.data)
    
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

<style scoped>
.leaderboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: white;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.leaderboard-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

.leaderboard-header h1 {
  font-size: 3rem;
  margin: 0;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
  margin: 10px 0 0 0;
}

.leaderboard-content {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.loading, .error, .empty {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error p {
  color: #ff6b6b;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.retry-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #ff5252;
}

.empty p {
  font-size: 1.2rem;
  opacity: 0.8;
  margin: 10px 0;
}

.table-container {
  overflow-x: auto;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.leaderboard-table th {
  background: rgba(255, 255, 255, 0.15);
  padding: 20px 15px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.rank-header {
  width: 80px;
  text-align: center;
}

.player-header {
  text-align: left;
}

.score-header {
  width: 120px;
  text-align: center;
}

.leaderboard-table td {
  padding: 18px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Estilos para las posiciones */
.first-place {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
  border-left: 4px solid #ffd700;
}

.second-place {
  background: linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.05));
  border-left: 4px solid #c0c0c0;
}

.third-place {
  background: linear-gradient(135deg, rgba(205, 127, 50, 0.15), rgba(205, 127, 50, 0.05));
  border-left: 4px solid #cd7f32;
}

.other-place {
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid transparent;
}

.other-place:hover {
  background: rgba(255, 255, 255, 0.1);
}

.rank-cell {
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.rank-number {
  display: inline-block;
  min-width: 30px;
}

.medal {
  margin-left: 8px;
  font-size: 1.2rem;
}

.player-cell {
  text-align: left;
}

.player-info {
  display: flex;
  flex-direction: column;
}

.player-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.player-email {
  font-size: 0.85rem;
  opacity: 0.7;
}

.score-cell {
  text-align: center;
  font-weight: bold;
}

.score-value {
  font-size: 1.3rem;
  color: #4ecdc4;
  margin-right: 5px;
}

.score-points {
  font-size: 0.8rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.leaderboard-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.back-btn, .refresh-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.refresh-btn {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  border: 2px solid transparent;
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #45b8af, #3a8f7e);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .leaderboard {
    padding: 10px;
  }
  
  .leaderboard-header h1 {
    font-size: 2.2rem;
  }
  
  .leaderboard-content {
    padding: 20px 15px;
    margin: 0 10px;
  }
  
  .leaderboard-table th,
  .leaderboard-table td {
    padding: 12px 8px;
  }
  
  .player-name {
    font-size: 1rem;
  }
  
  .score-value {
    font-size: 1.1rem;
  }
  
  .leaderboard-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .back-btn, .refresh-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .leaderboard-header h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .leaderboard-table {
    font-size: 0.9rem;
  }
  
  .player-email {
    font-size: 0.8rem;
  }
}
</style>