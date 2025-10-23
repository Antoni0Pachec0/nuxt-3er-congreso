// composables/game/use-game.js

// 1) Vue / Nuxt
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// 2) Utilidades/constantes del proyecto
import { ROUTES } from '@/backend/http/routes'   // ajusta si tus ROUTES viven en otro lugar
import api from '@/backend/http/api'

// 3) Capa API específica
import { ScoresApi } from '@/backend/game/scores-api'
import { TokenApi }  from '@/backend/auth/token-api'

// 4) Assets (agrupados por carpeta/tipo)
import fondo1 from '@/assets/img/game/funds/fondo.webp'
import fondo2 from '@/assets/img/game/funds/fondo-tarde.webp'
import fondo3 from '@/assets/img/game/funds/fondo-noche.webp'

import carMotocle from '@/assets/img/game/cars/motocle.webp'
import combi      from '@/assets/img/game/cars/combi.webp'
import carro      from '@/assets/img/game/cars/carro.webp'
import hinfinitum from '@/assets/img/game/cars/hinfinitum.webp'
import moto       from '@/assets/img/game/cars/moto.webp'
import bici       from '@/assets/img/game/cars/bici.webp'

import Pedraza from '@/assets/img/game/professors/pedraza.webp'
import Elvis   from '@/assets/img/game/professors/elvis.webp'
import Julio   from '@/assets/img/game/professors/julio.webp'
import Victor  from '@/assets/img/game/professors/victor.webp'

import Elit         from '@/assets/img/game/logos/elit.webp'
import LogoCongreso from '@/assets/img/game/logos/logo-congreso.webp'

export function useGame () {
  // ---------- refs para el template ----------
  const entryPage     = ref(null)
  const gameContainer = ref(null)
  const gameCanvas    = ref(null)

  const router = useRouter()
  let gameInstance = null

  // ---------- helpers auth ----------
  function getCookie (name) {
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

  function getAccessToken () {
    return getCookie('access_token') || null
  }

  async function checkGameAuthentication () {
    const token = getAccessToken()
    const userId = localStorage.getItem('userId')
    
    // 🔥 CORREGIDO: Verificar que AMBOS existan
    if (!token || !userId) {
      // Intentar refresh si no hay token
      try {
        const refreshToken = getCookie('refresh_token')
        if (refreshToken) {
          const response = await TokenApi.refresh(refreshToken)
          if (response.access_token) {
            document.cookie = `access_token=${response.access_token}; path=/; max-age=900`
            
            // 🔥 VERIFICAR que ahora tenemos ambos
            const newUserId = localStorage.getItem('userId')
            if (newUserId) {
              return true
            }
          }
        }
      } catch (error) {
        console.error('Error en autenticación:', error)
      }
      
      return false
    }
    
    return true
  }

  async function refreshAccessToken () {
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
    const token  = getAccessToken()
    const userId = localStorage.getItem('userId')
    return !!token && !!userId
  }

  // ---------- clase del juego ----------
  class CarRacing {
    constructor (canvas) {
      this.canvas = canvas
      this.ctx    = this.canvas.getContext('2d')

      // dimensiones base
      this.base_width  = 800
      this.base_height = 1510
      this.scale = 1

      // colores y runtime
      this.black = '#000000'
      this.white = '#FFFFFF'
      this.red   = '#FF0000'
      this.green = '#000000'
      this.gray  = '#808080'
      this.fps   = 90
      this.paused      = false
      this.gameLoopId  = null
      this.userId      = null
      this.scoreSent   = false

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
      this.elitLogo = new Image();        this.elitLogo.src = Elit
      this.congresoLogo = new Image();    this.congresoLogo.src = LogoCongreso

      // dificultad/spawn
      this.enemyPool = [0,1,2,3,4]
      this.shuffleEnemies()
      this.lastSpawnTime = 0
      this.baseSpawnInterval = 1300
      this.minSpawnInterval  = 350
      this.difficultyLevel   = 1
      this.maxDifficulty     = 10

      // estado juego
      this.initialize()
      this.loadUserId()
      this.keys = {}

      // listeners
      window.addEventListener('keydown', (e) => { this.keys[e.key] = true })
      window.addEventListener('keyup',   (e) => { this.keys[e.key] = false })

      this.touchStartX = null
      this.touchStartY = null
      this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e))
      this.canvas.addEventListener('touchmove',  (e) => this.handleTouchMove(e))
      this.canvas.addEventListener('touchend',   (e) => this.handleTouchEnd(e))
      window.addEventListener('resize', () => this.resizeCanvas())

      // música (opcional simple)
      this.songs = []
      this.songPool = []
      this.currentSongIndex = 0
      this.backgroundMusic = null
    }

    // ---- helpers de lanes / resize ----
    initializeLanes () {
      const roadWidth = this.base_width / 2
      const roadX     = this.base_width / 4
      const laneWidth = roadWidth / 3

      const enemyW = this.enemy_width || 120
      this.lanes = [
        roadX + laneWidth * 0.5 - enemyW * 0.5,
        roadX + laneWidth * 1.5 - enemyW * 0.5,
        roadX + laneWidth * 2.5 - enemyW * 0.5,
      ]
    }

    resizeCanvas () {
      this.canvas.width  = window.innerWidth
      this.canvas.height = window.innerHeight
      this.scale = Math.min(
        window.innerWidth / this.base_width,
        window.innerHeight / this.base_height
      )
      this.initializeLanes()
    }

    // ---- dificultad / spawn ----
    updateDifficulty () {
      this.difficultyLevel = Math.min(this.maxDifficulty, Math.floor(this.score / 10) + 1)
      this.enemy_speed = 7 + Math.pow(this.difficultyLevel, 2)
      this.bg_speed    = this.enemy_speed * 1.5

      const spawnReduction = (this.difficultyLevel - 1) * 0.12
      const baseInterval   = this.baseSpawnInterval * (1 - spawnReduction)
      this.currentSpawnInterval = Math.max(
        this.minSpawnInterval,
        baseInterval + (Math.random() * 500 - 100)
      )

      this.maxEnemiesOnScreen = Math.min(10, 3 + Math.floor(this.difficultyLevel * 1.5))
    }

    shuffleEnemies () {
      for (let i = this.enemyPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.enemyPool[i], this.enemyPool[j]] = [this.enemyPool[j], this.enemyPool[i]]
      }
    }

    // ---- estado inicial ----
    initialize () {
      this.car_width = 120
      this.car_height = 240
      this.car_x = this.base_width / 2 - this.car_width / 2
      this.car_y = this.base_height - this.car_height - 20
      this.car_speed = 4

      this.enemies = []
      this.enemy_width  = 120
      this.enemy_height = 240
      this.enemy_speed  = 4

      this.bg_y = 0
      this.bg_speed = this.enemy_speed

      this.score = 0
      this.game_over = false
      this.scoreSent = false

      this.road_width = this.base_width / 2
      this.road_x     = this.base_width / 4

      this.currentBackgroundIndex = 0
      this.lastSpawnTime = 0
      this.difficultyLevel = 1
      this.maxEnemiesOnScreen = 2
      this.currentSpawnInterval = this.baseSpawnInterval

      this.initializeLanes()
      this.updateDifficulty()
    }

    loadUserId () {
      const storedUserId = localStorage.getItem('userId')
      if (storedUserId) this.userId = storedUserId
    }

    // ---- control táctil ----
    handleTouchStart (e) {
      e.preventDefault()
      if (this.game_over) {
        this.initialize()
        this.game_over = false
      } else {
        this.touchStartX = e.touches[0].clientX
        this.touchStartY = e.touches[0].clientY
      }
    }
    handleTouchMove (e) {
      e.preventDefault()
      if (this.touchStartX !== null && this.touchStartY !== null && !this.game_over) {
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
    handleTouchEnd (e) {
      e.preventDefault()
      this.touchStartX = null
      this.touchStartY = null
    }

    // ---- spawn / lanes ----
    getAvailableLanes () {
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

    spawnEnemy () {
      if (this.enemies.length >= this.maxEnemiesOnScreen) return
      if (this.enemyPool.length === 0) {
        this.enemyPool = [0,1,2,3,4]
        this.shuffleEnemies()
      }
      const designIndex = this.enemyPool.pop()
      const available   = this.getAvailableLanes()
      if (!available.length) { this.enemyPool.push(designIndex); return }

      const randomLaneIndex = Math.floor(Math.random() * available.length)
      const enemy_x = available[randomLaneIndex] + (Math.random() * 100 - 50)

      this.enemies.push({ x: enemy_x, y: -this.enemy_height, designIndex })
      this.lastSpawnTime = Date.now()
    }

    // ---- dibujo / HUD ----
    draw_objects () {
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
        const img   = this.enemyCarImages[enemy.designIndex]
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
    check_collision () {
      const hitboxScale = 0.5
      const car_rect = {
        x: this.car_x + this.car_width * (1 - hitboxScale) / 2,
        y: this.car_y + this.car_height * (1 - hitboxScale) / 2,
        width:  this.car_width * hitboxScale,
        height: this.car_height * hitboxScale
      }
      for (const enemy of this.enemies) {
        const enemy_rect = {
          x: enemy.x + this.enemy_width * (1 - hitboxScale) / 2,
          y: enemy.y + this.enemy_height * (1 - hitboxScale) / 2,
          width:  this.enemy_width * hitboxScale,
          height: this.enemy_height * hitboxScale
        }
        if (
          car_rect.x < enemy_rect.x + enemy_rect.width &&
          car_rect.x + car_rect.width > enemy_rect.x &&
          car_rect.y < enemy_rect.y + enemy_rect.height &&
          car_rect.y + car_rect.height > enemy_rect.y
        ) {
          this.crashEnemy = enemy.designIndex
          return true
        }
      }
      return false
    }

    drawGameOverScreen (msg) {
      this.ctx.setTransform(1,0,0,1,0,0)
      this.ctx.fillStyle = this.black
      this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
      const offsetX = (this.canvas.width - this.base_width * this.scale) / 2
      const offsetY = (this.canvas.height - this.base_height * this.scale) / 2
      this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY)
      const Y = this.base_height / 2 - 400
      this.ctx.font = `bold 72px Comic Sans MS`
      this.ctx.fillStyle = this.white
      this.ctx.textAlign = 'center'
      this.ctx.fillText(msg, this.base_width / 2, Y)
      this.ctx.font = `40px Comic Sans MS`
      this.ctx.fillText(`Puntaje final: ${this.score}`, this.base_width / 2, Y + 70)
      this.ctx.font = `30px Comic Sans MS`
      this.ctx.fillText(`Toca la pantalla o F para reiniciar`, this.base_width / 2, Y + 130)
      this.ctx.fillText(`Nivel alcanzado: ${this.difficultyLevel}`, this.base_width / 2, Y + 180)
      this.ctx.font = `20px Comic Sans MS`
      this.ctx.fillText(this.scoreSent ? '✅ Puntaje guardado' : '⏳ Guardando puntaje...', this.base_width / 2, Y + 230)

      if (this.crashEnemy !== undefined) {
        const crashImg = this.crashImages[this.crashEnemy]
        if (crashImg?.complete) this.ctx.drawImage(crashImg, this.base_width/2 - 200, Y + 260, 400, 500)
      }
      if (this.elitLogo?.complete) {
        this.ctx.drawImage(this.elitLogo, this.base_width - 110, this.base_height - 110, 100, 100)
      }
      if (this.congresoLogo?.complete) {
        this.ctx.drawImage(this.congresoLogo, 10, this.base_height - 130, 120, 120)
      }
      this.ctx.setTransform(1,0,0,1,0,0)
    }

    async ensureScoreSent () {
      if (this.scoreSent || this.score <= 0) return
      
      this.scoreSent = true // ← Marcar inmediatamente para evitar duplicados
      
      let attempts = 0
      const maxAttempts = 3
      
      while (attempts < maxAttempts) {
        try {
          await this.sendScoreToBackend()
          console.log('✅ Score enviado exitosamente')
          return // ← Salir si tiene éxito
        } catch (error) {
          attempts++
          console.warn(`⚠️ Intento ${attempts} fallido:`, error.message)
          
          if (attempts < maxAttempts) {
            const delay = Math.min(1000 * Math.pow(2, attempts), 5000)
            await new Promise(r => setTimeout(r, delay))
          } else {
            console.error('❌ Todos los intentos fallaron')
            // 🔥 IMPORTANTE: Si falla después de todos los intentos, permitir reintento
            this.scoreSent = false
          }
        }
      }
    }

    async sendScoreToBackend () {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User ID no encontrado')
      }

      let accessToken = getCookie('access_token') // 🔥 Usar SOLO cookies
      
      // Si no hay token en cookies, intentar refresh
      if (!accessToken) {
        try {
          const refreshToken = getCookie('refresh_token')
          if (!refreshToken) throw new Error('No hay refresh token')
          
          const response = await TokenApi.refresh(refreshToken)
          accessToken = response.access_token
          
          // 🔥 Guardar el nuevo token en cookies (no en localStorage)
          document.cookie = `access_token=${accessToken}; path=/; max-age=900` // 15 min
        } catch (error) {
          console.error('Error refrescando token:', error)
          throw new Error('No se pudo renovar la sesión')
        }
      }

      if (!accessToken) {
        throw new Error('No hay token de acceso')
      }

      // 🔥 Enviar el score
      const response = await ScoresApi.create({ value: this.score }, accessToken)
      
      if (!response.data) {
        throw new Error('Respuesta vacía del servidor')
      }
      
      return response.data
    }

    async display_message (msg) {
      // 🔥 PRIMERO intentar enviar el score ANTES de pausar el juego
      if (!this.scoreSent && this.score > 0) {
        await this.ensureScoreSent() // ← Esperar a que se complete
      }
      
      // 🔥 LUEGO marcar como game_over
      this.game_over = true
      this.drawGameOverScreen(msg)
    }

    // ---- loop ----
    update () {
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

      if (this.game_over && (this.keys['f'] || this.keys['F'])) {
        this.initialize()
        this.game_over = false
      }
    }

    run () {
      const loop = () => {
        if (!this.paused) this.update()
        setTimeout(() => requestAnimationFrame(loop), 1000 / this.fps)
      }
      requestAnimationFrame(loop)
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
    const token  = getAccessToken()
    if (!userId || !token) {
      console.warn('⚠️ Credenciales incompletas (userId/token)')
    }
  })

  onUnmounted(() => {
    gameInstance = null
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
