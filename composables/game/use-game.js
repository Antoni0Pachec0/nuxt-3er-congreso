// composables/game/use-game.js

// 1) Vue / Nuxt
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// 3) Capa API específica
import { ScoresApi } from '@/backend/game/scores-api'
import { TokenApi } from '@/backend/auth/token-api'

// 4) Assets (agrupados por carpeta/tipo)
import fondo1 from '@/assets/img/game/funds/fondo.webp'
import fondo2 from '@/assets/img/game/funds/fondo-tarde.webp'
import fondo3 from '@/assets/img/game/funds/fondo-noche.webp'

import carMotocle from '@/assets/img/game/cars/motocle.webp'
import combi from '@/assets/img/game/cars/combi.webp'
import carro from '@/assets/img/game/cars/carro.webp'
import hinfinitum from '@/assets/img/game/cars/hinfinitum.webp'
import moto from '@/assets/img/game/cars/moto.webp'
import bici from '@/assets/img/game/cars/bici.webp'

import Pedraza from '@/assets/img/game/professors/pedraza.webp'
import Elvis from '@/assets/img/game/professors/elvis.webp'
import Julio from '@/assets/img/game/professors/julio.webp'
import Victor from '@/assets/img/game/professors/victor.webp'

import Elit from '@/assets/img/game/logos/elit.webp'
import LogoCongreso from '@/assets/img/game/logos/logo-congreso.webp'

export function useGame() {
  // ---------- refs para el template ----------
  const entryPage = ref(null)
  const gameContainer = ref(null)
  const gameCanvas = ref(null)

  const router = useRouter()
  let gameInstance = null

  // ---------- helpers auth ----------
  function getCookie(name) {
    if (typeof document === 'undefined') return null
    try {
      const cookies = document.cookie.split(';')
      for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=')
        if (cookieName === name) return cookieValue ? decodeURIComponent(cookieValue) : null
      }
      return null
    } catch {
      return null
    }
  }

  function getAccessToken() {
    return getCookie('access_token') || null
  }

  async function checkGameAuthentication() {
    // Si ya tienes userId guardado, intentamos validar sesión con un ping protegido
    try {
      // Llama un endpoint que requiera JWT (cookies via withCredentials)
      await ScoresApi.getMyBest(); // ajusta al nombre real del método
      return true; // si no lanza, hay sesión
    } catch (e) {
      // Fallback: si falla, no hay sesión válida
      console.warn('Auth check falló:', e?.response?.status, e?.message)
      return false
    }
  }


  async function refreshAccessToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token') || getCookie('refresh_token')
      if (!refreshToken) throw new Error('No hay refresh token')
      const newToken = await TokenApi.refresh(refreshToken)
      if (newToken) localStorage.setItem('access_token', newToken)
      return newToken
    } catch (error) {
      // limpiar y mandar a login
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('userId')
      router.push('/login')
      throw error
    }
  }

  const checkAuthentication = async () => {
    const token = getAccessToken()
    const userId = localStorage.getItem('userId')
    return !!token && !!userId
  }

  // ---------- clase del juego ----------
  class CarRacing {
    constructor(canvas) {
      this.canvas = canvas
      this.ctx = this.canvas.getContext('2d')
      this.touchStartX = null
      this.touchStartY = null

      // dimensiones base
      this.base_width = 800
      this.base_height = 1510
      this.scale = 1

      // colores y runtime
      this.black = '#000000'
      this.white = '#FFFFFF'
      this.red = '#FF0000'
      this.green = '#000000'
      this.gray = '#808080'
      this.fps = 90
      this.paused = false
      this.gameLoopId = null
      this.userId = null
      this.scoreSent = false
      this.sendingScore = false

      // carriles
      this.lanes = []
      this.resizeCanvas()
      this.initializeLanes()

      // fondos
      this.backgrounds = [fondo1, fondo2, fondo3]
      this.currentBackgroundIndex = 0
      this.backgroundImages = this.backgrounds.map(src => {
        const img = new Image()
        img.src = src
        return img
      })

      // jugador
      this.playerCarImage = new Image()
      this.playerCarImage.src = carMotocle

      // enemigos
      this.enemyCarImages = [combi, carro, hinfinitum, moto, bici].map(src => {
        const img = new Image()
        img.src = src
        return img
      })

      // imágenes de choque / logos
      this.crashImages = [Pedraza, Elvis, Julio, Victor, bici].map(src => {
        const img = new Image()
        img.src = src
        return img
      })
      this.elitLogo = new Image(); this.elitLogo.src = Elit
      this.congresoLogo = new Image(); this.congresoLogo.src = LogoCongreso

      // dificultad/spawn
      this.enemyPool = [0, 1, 2, 3, 4]
      this.shuffleEnemies()
      this.lastSpawnTime = 0
      this.baseSpawnInterval = 1300
      this.minSpawnInterval = 350
      this.difficultyLevel = 1
      this.maxDifficulty = 10

      // estado juego
      this.initialize()
      this.loadUserId()
      this.keys = {}

      // listeners
      this._onKeyDown = (e) => { this.keys[e.key] = true }
      this._onKeyUp = (e) => { this.keys[e.key] = false }
      this._onResize = () => this.resizeCanvas()
      this._onTouchStart = (e) => this.handleTouchStart(e)
      this._onTouchMove = (e) => this.handleTouchMove(e)
      this._onTouchEnd = (e) => this.handleTouchEnd(e)

      // Registrar con esas referencias
      window.addEventListener('keydown', this._onKeyDown)
      window.addEventListener('keyup', this._onKeyUp)
      window.addEventListener('resize', this._onResize)
      this.canvas.addEventListener('touchstart', this._onTouchStart, { passive: false })
      this.canvas.addEventListener('touchmove', this._onTouchMove, { passive: false })
      this.canvas.addEventListener('touchend', this._onTouchEnd, { passive: false })

      // música (opcional simple)
      this.songs = []
      this.songPool = []
      this.currentSongIndex = 0
      this.backgroundMusic = null
    }

    // ---- helpers de lanes / resize ----
    initializeLanes() {
      const roadWidth = this.base_width / 2
      const roadX = this.base_width / 4
      const laneWidth = roadWidth / 3

      const enemyW = this.enemy_width || 120
      this.lanes = [
        roadX + laneWidth * 0.5 - enemyW * 0.5,
        roadX + laneWidth * 1.5 - enemyW * 0.5,
        roadX + laneWidth * 2.5 - enemyW * 0.5,
      ]
    }

    resizeCanvas() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.scale = Math.min(
        window.innerWidth / this.base_width,
        window.innerHeight / this.base_height
      )
      this.initializeLanes()
    }

    // ---- dificultad / spawn ----
    updateDifficulty() {
      this.difficultyLevel = Math.min(this.maxDifficulty, Math.floor(this.score / 10) + 1)
      this.enemy_speed = 7 + Math.pow(this.difficultyLevel, 2)
      this.bg_speed = this.enemy_speed * 1.5

      const spawnReduction = (this.difficultyLevel - 1) * 0.12
      const baseInterval = this.baseSpawnInterval * (1 - spawnReduction)
      this.currentSpawnInterval = Math.max(
        this.minSpawnInterval,
        baseInterval + (Math.random() * 500 - 100)
      )

      this.maxEnemiesOnScreen = Math.min(10, 3 + Math.floor(this.difficultyLevel * 1.5))
    }

    shuffleEnemies() {
      for (let i = this.enemyPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[this.enemyPool[i], this.enemyPool[j]] = [this.enemyPool[j], this.enemyPool[i]]
      }
    }

    // ---- estado inicial ----
    initialize() {
      this.car_width = 120
      this.car_height = 240
      this.car_x = this.base_width / 2 - this.car_width / 2
      this.car_y = this.base_height - this.car_height - 20
      this.car_speed = 4

      this.enemies = []
      this.enemy_width = 120
      this.enemy_height = 240
      this.enemy_speed = 4

      this.bg_y = 0
      this.bg_speed = this.enemy_speed

      this.score = 0
      this.game_over = false
      this.scoreSent = false
      this.sendingScore = false

      this.road_width = this.base_width / 2
      this.road_x = this.base_width / 4

      this.currentBackgroundIndex = 0
      this.lastSpawnTime = 0
      this.difficultyLevel = 1
      this.maxEnemiesOnScreen = 2
      this.currentSpawnInterval = this.baseSpawnInterval

      this.initializeLanes()
      this.updateDifficulty()
    }

    loadUserId() {
      const storedUserId = localStorage.getItem('userId')
      if (storedUserId) this.userId = storedUserId
    }

    // ---- control táctil ----
    handleTouchStart(e) {
      e.preventDefault()
      if (this.paused) {
        return           // no hagas nada en pausa
      }
      if (this.game_over) {
        this.initialize()
        this.game_over = false
      } else {
        this.touchStartX = e.touches[0].clientX
        this.touchStartY = e.touches[0].clientY
      }
    }

    handleTouchMove(e) {
      e.preventDefault()
      if (this.touchStartX !== null && this.touchStartY !== null && !this.game_over && !this.paused) {
        const touchX = e.touches[0].clientX
        const touchY = e.touches[0].clientY
        const deltaX = (touchX - this.touchStartX) / this.scale
        const deltaY = (touchY - this.touchStartY) / this.scale
        this.car_x += deltaX * 0.8
        this.car_y += deltaY * 0.8
        this.touchStartX = touchX
        this.touchStartY = touchY
      }
    }
    handleTouchEnd(e) {
      e.preventDefault()
      if (this.paused) return
      this.touchStartX = null
      this.touchStartY = null
    }

    // ---- spawn / lanes ----
    getAvailableLanes() {
      const available = [...this.lanes]
      const safeDistance = this.enemy_height * 1.5

      for (let i = available.length - 1; i >= 0; i--) {
        const laneX = available[i]
        for (const enemy of this.enemies) {
          if (Math.abs(enemy.x - laneX) < 10 && enemy.y > -safeDistance) {
            available.splice(i, 1)
            break
          }
        }
      }
      return available
    }

    spawnEnemy() {
      if (this.enemies.length >= this.maxEnemiesOnScreen) return
      if (this.enemyPool.length === 0) {
        this.enemyPool = [0, 1, 2, 3, 4]
        this.shuffleEnemies()
      }
      const designIndex = this.enemyPool.pop()
      const available = this.getAvailableLanes()
      if (!available.length) { this.enemyPool.push(designIndex); return }

      const randomLaneIndex = Math.floor(Math.random() * available.length)
      const enemy_x = available[randomLaneIndex] + (Math.random() * 100 - 50)

      this.enemies.push({ x: enemy_x, y: -this.enemy_height, designIndex })
      this.lastSpawnTime = Date.now()
    }

    // ---- dibujo / HUD ----
    draw_objects() {
      const offsetX = (this.canvas.width - this.base_width * this.scale) / 2
      const offsetY = (this.canvas.height - this.base_height * this.scale) / 2
      this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY)

      const bgImage = this.backgroundImages[this.currentBackgroundIndex]
      if (bgImage.complete && bgImage.naturalWidth !== 0) {
        this.ctx.drawImage(bgImage, 0, this.bg_y, this.base_width, this.base_height)
        this.ctx.drawImage(bgImage, 0, this.bg_y - this.base_height, this.base_width, this.base_height)
      } else {
        this.ctx.fillStyle = this.green
        this.ctx.fillRect(0, 0, this.base_width, this.base_height)
      }

      if (this.playerCarImage.complete) {
        this.ctx.drawImage(this.playerCarImage, this.car_x, this.car_y, this.car_width, this.car_height)
      } else {
        this.ctx.fillStyle = this.red
        this.ctx.fillRect(this.car_x, this.car_y, this.car_width, this.car_height)
      }

      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i]
        const img = this.enemyCarImages[enemy.designIndex]
        if (img?.complete) {
          this.ctx.drawImage(img, enemy.x, enemy.y, this.enemy_width, this.enemy_height)
        } else {
          this.ctx.fillStyle = this.white
          this.ctx.fillRect(enemy.x, enemy.y, this.enemy_width, this.enemy_height)
        }

        if (enemy.y > this.base_height + this.enemy_height) {
          this.enemies.splice(i, 1)
          this.score++
          this.updateDifficulty()
          if (this.score % 10 === 0) {
            this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgroundImages.length
          }
        }
      }

      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      const hudX = Math.round(offsetX + 10 * this.scale)
      const hudY = Math.round(offsetY + 40 * this.scale)
      const hudFontPx = Math.max(12, Math.round(30 * this.scale))
      this.ctx.font = `${hudFontPx}px Comic Sans MS`
      this.ctx.fillStyle = this.white
      this.ctx.textAlign = 'left'
      this.ctx.fillText(`Puntaje: ${this.score}`, hudX, hudY)
      this.ctx.fillText(`Nivel: ${this.difficultyLevel}`, hudX, hudY + Math.round(40 * this.scale))
    }

    // ---- colisiones / fin de juego ----
    check_collision() {
      const hitboxScale = 0.5
      const car_rect = {
        x: this.car_x + this.car_width * (1 - hitboxScale) / 2,
        y: this.car_y + this.car_height * (1 - hitboxScale) / 2,
        width: this.car_width * hitboxScale,
        height: this.car_height * hitboxScale
      }
      for (const enemy of this.enemies) {
        const enemy_rect = {
          x: enemy.x + this.enemy_width * (1 - hitboxScale) / 2,
          y: enemy.y + this.enemy_height * (1 - hitboxScale) / 2,
          width: this.enemy_width * hitboxScale,
          height: this.enemy_height * hitboxScale
        }
        if (
          car_rect.x < enemy_rect.x + enemy_rect.width &&
          car_rect.x + car_rect.width > enemy_rect.x &&
          car_rect.y < enemy_rect.y + enemy_rect.height &&
          car_rect.y + car_rect.height > enemy_rect.y
        ) {
          this.crashEnemy = enemy.designIndex
          // Consgelar ya mismo y mostrar UI en el mismo frame
          this.freezeOnGameOver()
          this.display_message('¡Choque! Fin del Juego')
          return true
        }
      }
      return false
    }

    drawGameOverScreen(msg) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.fillStyle = this.black
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      const offsetX = (this.canvas.width - this.base_width * this.scale) / 2
      const offsetY = (this.canvas.height - this.base_height * this.scale) / 2
      this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY)
      const Y = this.base_height / 2 - 400
      this.ctx.font = `bold 72px Comic Sans MS`
      this.ctx.fillStyle = this.white
      this.ctx.textAlign = 'center'
      this.ctx.fillText(msg, this.base_width / 2, Y)
      this.ctx.font = `40px Comic Sans MS`
      this.ctx.fillText(`Puntaje final: ${this.finalScore ?? this.score}`, this.base_width / 2, Y + 70)
      this.ctx.font = `30px Comic Sans MS`
      this.ctx.fillText(`Toca la pantalla o F para reiniciar`, this.base_width / 2, Y + 130)
      this.ctx.fillText(`Nivel alcanzado: ${this.difficultyLevel}`, this.base_width / 2, Y + 180)
      this.ctx.font = `20px Comic Sans MS`
      this.ctx.fillText(this.scoreSent ? '✅ Puntaje guardado' : '⏳ Guardando puntaje...', this.base_width / 2, Y + 230)

      if (this.crashEnemy !== undefined) {
        const crashImg = this.crashImages[this.crashEnemy]
        if (crashImg?.complete) this.ctx.drawImage(crashImg, this.base_width / 2 - 200, Y + 260, 400, 500)
      }
      if (this.elitLogo?.complete) {
        this.ctx.drawImage(this.elitLogo, this.base_width - 110, this.base_height - 110, 100, 100)
      }
      if (this.congresoLogo?.complete) {
        this.ctx.drawImage(this.congresoLogo, 10, this.base_height - 130, 120, 120)
      }
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    async ensureScoreSent(scoreToSend) {
      if (this.scoreSent || !Number.isFinite(scoreToSend) || scoreToSend <= 0) return

      this.scoreSent = true         // evita duplicados
      this.sendingScore = true      // bloquea restart mientras enviamos

      let attempts = 0
      const maxAttempts = 3

      try {
        while (attempts < maxAttempts) {
          try {
            await this.sendScoreToBackend(scoreToSend)
            console.log('✅ Score enviado exitosamente')
            return
          } catch (error) {
            attempts++
            console.warn(`⚠️ Intento ${attempts} fallido:`, error.message)
            if (attempts < maxAttempts) {
              const delay = Math.min(1000 * Math.pow(2, attempts), 5000)
              await new Promise(r => setTimeout(r, delay))
            } else {
              console.error('❌ Todos los intentos fallaron')
              // permitimos reintento manual en un futuro
              this.scoreSent = false
            }
          }
        }
      } finally {
        this.sendingScore = false   // SIEMPRE liberar, salga bien o mal
      }
    }


    async sendScoreToBackend(finalScore) {
      const userId = localStorage.getItem('userId')
      if (!userId) throw new Error('User ID no encontrado')

      // NO leas ni pases accessToken: usa cookies HttpOnly con withCredentials
      const response = await ScoresApi.create({ value: finalScore })
      if (!response?.data) throw new Error('Respuesta vacía del servidor')
      return response.data
    }

    freezeOnGameOver() {
      this.game_over = true
      this.finalScore = this.score  // ← inmutable
      // Congelar movimiento
      this.bg_speed = 0
      this.enemy_speed = 0
    }

    async display_message(msg) {
      // 1) Congelar de inmediato para que nada cambie
      if (!this.game_over) this.freezeOnGameOver()

      // 2) Enviar score final (si aplica) y esperar a que termine
      if (!this.scoreSent && (this.finalScore ?? 0) > 0) {
        await this.ensureScoreSent(this.finalScore)
      }

      // 3) Pintar UI de fin
      this.drawGameOverScreen(msg)
    }


    // ---- loop ----
    update() {
      if (!this.game_over) {
        this.bg_y += this.bg_speed
        if (this.bg_y >= this.base_height) this.bg_y = 0

        // movimientos
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) this.car_x -= this.car_speed
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) this.car_x += this.car_speed
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) this.car_y -= this.car_speed
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) this.car_y += this.car_speed

        // límites
        this.car_x = Math.max(this.road_x, Math.min(this.car_x, this.road_x + this.road_width - this.car_width))
        this.car_y = Math.max(0, Math.min(this.car_y, this.base_height - this.car_height))

        // enemigos
        for (const enemy of this.enemies) enemy.y += this.enemy_speed

        const now = Date.now()
        if (now - this.lastSpawnTime > this.currentSpawnInterval) this.spawnEnemy()

        if (this.check_collision()) {
          this.display_message('¡Choque! Fin del juego')
          return
        }
        this.draw_objects()
      } else {
        this.drawGameOverScreen('¡Choque! Fin del juego')
      }

      if (this.game_over && !this.paused && (this.keys['f'] || this.keys['F'])) {
        if (!this.sendingScore) {
          this.initialize()
          this.game_over = false
        }
      }
    }

    run() {
      if (this._running) return        // evita arrancar dos veces
      this._running = true
      const loop = () => {
        if (!this._running) return
        if (!this.paused) this.update()
        this._rafId = requestAnimationFrame(loop)
      }
      this._rafId = requestAnimationFrame(loop)
    }

    stop() {
      this._running = false
      if (this._rafId) {
        cancelAnimationFrame(this._rafId)
        this._rafId = null
      }
    }
  }

  // ---------- acciones atadas a la vista ----------
  const startGame = async () => {
    const ok = await checkGameAuthentication()
    if (!ok) {
      alert('🔐 Debes iniciar sesión para jugar')
      router.push('/login')
      return
    }

    if (entryPage.value) entryPage.value.style.display = 'none'
    if (gameContainer.value) gameContainer.value.style.display = 'block'

    if (!gameInstance && gameCanvas.value) {
      gameInstance = new CarRacing(gameCanvas.value)
      gameInstance.run()
    } else if (gameInstance) {
      // 🔥 Reiniciar instancia existente en lugar de crear nueva
      gameInstance.initialize()
      gameInstance.game_over = false
      gameInstance.paused = false
    }
  }

  const togglePause = () => {
    if (gameInstance) gameInstance.paused = !gameInstance.paused
  }

  // Si no usas música real, deja este stub sin romper la UI
  const nextSong = () => {
    // TODO: implementar lista de canciones reales
    console.log('Cambiar canción (stub)')
  }

  const navigateToLeaderboard = () => {
    router.push('/game/leaderboard')
  }

  // ---------- lifecycle ----------
  onMounted(() => {
    const userId = localStorage.getItem('userId')
    const token = getAccessToken()
    if (!userId || !token) {
      console.warn('⚠️ Credenciales incompletas (userId/token)')
    }
  })

  onUnmounted(() => {
    if (gameInstance) {
      // 1) Detener el loop
      gameInstance.stop?.()

      // 2) Quitar listeners con las mismas referencias
      window.removeEventListener('keydown', gameInstance._onKeyDown)
      window.removeEventListener('keyup', gameInstance._onKeyUp)
      window.removeEventListener('resize', gameInstance._onResize)

      if (gameInstance.canvas) {
        gameInstance.canvas.removeEventListener('touchstart', gameInstance._onTouchStart)
        gameInstance.canvas.removeEventListener('touchmove', gameInstance._onTouchMove)
        gameInstance.canvas.removeEventListener('touchend', gameInstance._onTouchEnd)
      }

      gameInstance = null
    }
  })



  // ---------- expose ----------
  return {
    entryPage,
    gameContainer,
    gameCanvas,
    startGame,
    togglePause,
    nextSong,
    navigateToLeaderboard,
  }
}
