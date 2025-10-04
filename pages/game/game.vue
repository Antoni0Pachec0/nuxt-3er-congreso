<template>
  <div>
    <div id="entry-page" ref="entryPage">
      <h1>MotocleCar</h1>
      <button class="button" id="start-button" @click="startGame">
        <span class="text">ST&nbsp;&nbsp;&nbsp;&nbsp;RT</span>
        <div class="katana-container">
          <div class="katana katana-1">
            <div class="handle"></div>
            <div class="guard"></div>
            <div class="blade"></div>
          </div>
          <div class="katana katana-2">
            <div class="handle"></div>
            <div class="guard"></div>
            <div class="blade"></div>
          </div>
        </div>
      </button>
    </div>

    <div id="gameContainer" ref="gameContainer">
      <canvas id="gameCanvas" ref="gameCanvas"></canvas>

      <div id="musicControls">
        <button id="pauseBtn" class="Btn" @click="togglePause">
          Pausa
          <svg class="svgIcon" viewBox="0 0 576 512">
            <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"/>
          </svg>
        </button>

        <button id="nextBtn" class="Btn" @click="nextSong">
          Cambiar canción
          <svg class="svgIcon" viewBox="0 0 576 512">
            <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"/>
          </svg>
        </button>

        <button class="Btn" @click="navigateToLeaderboard">
          Clasificaciones
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/http/api'
import { ROUTES } from '@/plugins/http/routes'

import '@/assets/css/styles/Game.css'

// Fondos
import fondo1 from '@/assets/images/images/funds/fondo.webp'
import fondo2 from '@/assets/images/images/funds/fondoTarde.webp'
import fondo3 from '@/assets/images/images/funds/fondoNoche.webp'

// Autos
import carMotocle from '@/assets/images/images/cars/motocle.webp'
import combi from '@/assets/images/images/cars/combi.webp'
import carro from '@/assets/images/images/cars/carro.webp'
import hinfinitum from '@/assets/images/images/cars/hinfinitum.webp'
import moto from '@/assets/images/images/cars/moto.webp'
import bici from '@/assets/images/images/cars/bici.webp'

// “Choque”/profes
import Pedraza from '@/assets/images/images/professors/Pedraza.webp'
import Elvis from '@/assets/images/images/professors/Elvis.webp'
import Julio from '@/assets/images/images/professors/Julio.webp'
import Victor from '@/assets/images/images/professors/Victor.webp'

// Logos
import Elit from '@/assets/images/images/logos/elit.webp'
import LogoCongreso from '@/assets/images/images/logos/LogoCongreso.webp'

// Música
import cancion1 from '@/assets/sounds_game/SabanasBlancas.mp3'
import cancion2 from '@/assets/sounds_game/SERPIENTE.mp3'
import cancion3 from '@/assets/sounds_game/ENALTAVOZ.mp3'

const entryPage = ref(null)
const gameContainer = ref(null)
const gameCanvas = ref(null)
const router = useRouter()

// --- Lógica del juego ---
class CarRacing {
  constructor(canvas, router) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d', { alpha: false }) // alpha off = mejora rendimiento
    this.router = router

    // Estado auth
    this.userId = null
    this.fetchUserId()

    // Canvas base + escala
    this.base_width = 800
    this.base_height = 1510
    this.scale = 1
    this.resizeCanvas()

    // Colores
    this.black = '#000000'
    this.white = '#FFFFFF'
    this.red = '#FF0000'
    this.green = '#000000'
    this.gray = '#808080'

    // Control de loop
    this.paused = false
    this.game_over = false
    this.lastRAFTime = 0 // timestamp anterior de rAF
    this.spawnIntervalMs = 500
    this.lastSpawnTime = 0

    // Velocidades base (ajustadas por dt)
    this.car_speed = 400 // px/seg
    this.enemy_speed = 380 // px/seg
    this.bg_speed = this.enemy_speed

    // Imágenes
    this.backgrounds = [fondo1, fondo2, fondo3]
    this.currentBackgroundIndex = 0
    this.backgroundImages = this.backgrounds.map(this.makeImage)
    this.playerCarImage = this.makeImage(carMotocle)
    this.enemyCarImages = [this.makeImage(combi), this.makeImage(carro), this.makeImage(hinfinitum), this.makeImage(moto), this.makeImage(bici)]
    this.crashImages = [this.makeImage(Pedraza), this.makeImage(Elvis), this.makeImage(Julio), this.makeImage(Victor), this.makeImage(bici)]
    this.elitLogo = this.makeImage(Elit)
    this.congresoLogo = this.makeImage(LogoCongreso)

    // Música
    this.songs = [cancion1, cancion2, cancion3]
    this.songPool = Array.from({ length: this.songs.length }, (_, i) => i)
    this.shuffle(this.songPool)
    this.currentSongIndex = 0
    this.backgroundMusic = new Audio(this.songs[this.songPool[this.currentSongIndex]])
    this.backgroundMusic.loop = true
    this.backgroundMusic.volume = 0.5

    // Input
    this.keys = Object.create(null)
    this.keydownHandler = (e) => {
      this.keys[e.key] = true
      if (this.backgroundMusic && this.backgroundMusic.paused) {
        // Reanuda al primer input (móvil/browsers con autoplay policy)
        this.backgroundMusic.play().catch(() => {})
      }
    }
    this.keyupHandler = (e) => { this.keys[e.key] = false }

    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keyup', this.keyupHandler)

    // Touch
    this.touchStartX = null
    this.touchStartY = null
    this._touchStart = (e) => this.handleTouchStart(e)
    this._touchMove = (e) => this.handleTouchMove(e)
    this._touchEnd = (e) => this.handleTouchEnd(e)
    this.canvas.addEventListener('touchstart', this._touchStart, { passive: false })
    this.canvas.addEventListener('touchmove', this._touchMove, { passive: false })
    this.canvas.addEventListener('touchend', this._touchEnd, { passive: false })

    // Resize
    this._resize = () => this.resizeCanvas()
    window.addEventListener('resize', this._resize)

    // Enemigos
    this.enemyPool = [0, 1, 2, 3, 4]
    this.shuffle(this.enemyPool)

    // Estado inicial del juego
    this.initialize()
  }

  // Utilidades
  makeImage(src) {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    return img
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0
      const tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
  }

  async fetchUserId() {
    try {
      const { data } = await api.get(ROUTES.AUTH.ME, { withCredentials: true })
      this.userId = Number(
        data?.user_id ?? data?.userId ?? data?.user?.user_id ?? data?.user?.userId ?? null
      )
    } catch {
      this.userId = null
      // si no hay sesión, el middleware del front debería evitar cargar esta vista
      // opcional: this.router.push('/login')
    }
  }

  // Canvas
  resizeCanvas() {
    const { innerWidth: w, innerHeight: h } = window
    this.canvas.width = w
    this.canvas.height = h
    this.scale = Math.min(w / this.base_width, h / this.base_height)
  }

  // Estado inicial / reset de partida
  initialize() {
    this.car_width = 120
    this.car_height = 240
    this.car_x = this.base_width / 2 - this.car_width / 2
    this.car_y = this.base_height - this.car_height - 20

    this.enemies = []
    this.enemy_width = 120
    this.enemy_height = 240

    this.bg_y = 0
    this.score = 0
    this.game_over = false
    this.currentBackgroundIndex = 0
    this.lastSpawnTime = 0
    this.spawnEnemy()
  }

  // Touch
  handleTouchStart(e) {
    e.preventDefault()
    if (this.game_over) {
      this.initialize()
      return
    }
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
  }

  handleTouchMove(e) {
    e.preventDefault()
    if (this.touchStartX == null || this.touchStartY == null || this.game_over) return
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    const deltaX = (touchX - this.touchStartX) / this.scale
    const deltaY = (touchY - this.touchStartY) / this.scale
    this.car_x += deltaX * 0.8
    this.car_y += deltaY * 0.8
    this.touchStartX = touchX
    this.touchStartY = touchY
  }

  handleTouchEnd(e) {
    e.preventDefault()
    this.touchStartX = null
    this.touchStartY = null
  }

  // Enemigos
  spawnEnemy() {
    if (!this.enemyPool.length) {
      this.enemyPool = [0, 1, 2, 3, 4]
      this.shuffle(this.enemyPool)
    }
    const designIndex = this.enemyPool.pop()
    const hitboxScale = 0.5
    const maxAttempts = 10
    const verticalBuffer = this.enemy_height * 2
    let attempts = 0
    let enemy_x, validPosition

    do {
      validPosition = true
      enemy_x = Math.floor(Math.random() * (this.base_width / 2 - this.enemy_width)) + this.base_width / 4

      const newEnemyRect = {
        x: enemy_x + (this.enemy_width * (1 - hitboxScale)) / 2,
        y: -this.enemy_height + (this.enemy_height * (1 - hitboxScale)) / 2,
        width: this.enemy_width * hitboxScale,
        height: this.enemy_height * hitboxScale + verticalBuffer,
      }

      for (let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i]
        const existingRect = {
          x: e.x + (this.enemy_width * (1 - hitboxScale)) / 2,
          y: e.y + (this.enemy_height * (1 - hitboxScale)) / 2,
          width: this.enemy_width * hitboxScale,
          height: this.enemy_height * hitboxScale + verticalBuffer,
        }
        if (
          newEnemyRect.x < existingRect.x + existingRect.width &&
          newEnemyRect.x + newEnemyRect.width > existingRect.x &&
          newEnemyRect.y < existingRect.y + existingRect.height &&
          newEnemyRect.y + newEnemyRect.height > existingRect.y
        ) {
          validPosition = false
          break
        }
      }
      attempts++
    } while (!validPosition && attempts < maxAttempts)

    if (validPosition) {
      this.enemies.push({ x: enemy_x, y: -this.enemy_height, designIndex })
      this.lastSpawnTime = performance.now()
    } else {
      this.enemyPool.push(designIndex)
    }
  }

  // Dibujo
  draw() {
    const offsetX = (this.canvas.width - this.base_width * this.scale) / 2
    const offsetY = (this.canvas.height - this.base_height * this.scale) / 2

    // Fondo
    this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY)
    const bgImage = this.backgroundImages[this.currentBackgroundIndex]
    if (bgImage.complete && bgImage.naturalWidth) {
      this.ctx.drawImage(bgImage, 0, this.bg_y, this.base_width, this.base_height)
      this.ctx.drawImage(bgImage, 0, this.bg_y - this.base_height, this.base_width, this.base_height)
    } else {
      this.ctx.fillStyle = this.green
      this.ctx.fillRect(0, 0, this.base_width, this.base_height)
    }

    // Player
    if (this.playerCarImage.complete && this.playerCarImage.naturalWidth) {
      this.ctx.drawImage(this.playerCarImage, this.car_x, this.car_y, this.car_width, this.car_height)
    } else {
      this.ctx.fillStyle = this.red
      this.ctx.fillRect(this.car_x, this.car_y, this.car_width, this.car_height)
    }

    // Enemigos
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i]
      const img = this.enemyCarImages[enemy.designIndex]
      if (img && img.complete && img.naturalWidth) {
        this.ctx.drawImage(img, enemy.x, enemy.y, this.enemy_width, this.enemy_height)
      } else {
        this.ctx.fillStyle = this.white
        this.ctx.fillRect(enemy.x, enemy.y, this.enemy_width, this.enemy_height)
      }
      // si sale de pantalla por abajo, suma score
      if (enemy.y > this.base_height + this.enemy_height) {
        this.enemies.splice(i, 1)
        this.score++
        if (this.score % 15 === 0) {
          this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgroundImages.length
        }
      }
    }

    // HUD
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    const hudX = Math.round(offsetX + 10 * this.scale)
    const hudY = Math.round(offsetY + 40 * this.scale)
    const hudFontPx = Math.max(12, Math.round(30 * this.scale))
    this.ctx.font = `${hudFontPx}px Comic Sans MS`
    this.ctx.fillStyle = this.white
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`Puntaje: ${this.score}`, hudX, hudY)
  }

  // Colisiones
  checkCollision() {
    const hitboxScale = 0.5
    const carRect = {
      x: this.car_x + (this.car_width * (1 - hitboxScale)) / 2,
      y: this.car_y + (this.car_height * (1 - hitboxScale)) / 2,
      width: this.car_width * hitboxScale,
      height: this.car_height * hitboxScale,
    }

    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i]
      const enemyRect = {
        x: e.x + (this.enemy_width * (1 - hitboxScale)) / 2,
        y: e.y + (this.enemy_height * (1 - hitboxScale)) / 2,
        width: this.enemy_width * hitboxScale,
        height: this.enemy_height * hitboxScale,
      }
      const overlap =
        carRect.x < enemyRect.x + enemyRect.width &&
        carRect.x + carRect.width > enemyRect.x &&
        carRect.y < enemyRect.y + enemyRect.height &&
        carRect.y + carRect.height > enemyRect.y

      if (overlap) {
        this.crashEnemy = e.designIndex
        return true
      }
    }
    return false
  }

  // Mensaje fin
  displayMessage(msg) {
    this.game_over = true

    // fondo negro
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.fillStyle = this.black
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    const offsetX = (this.canvas.width - this.base_width * this.scale) / 2
    const offsetY = (this.canvas.height - this.base_height * this.scale) / 2
    this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY)

    const baseY = this.base_height / 2 - 400
    this.ctx.font = 'bold 72px Comic Sans MS'
    this.ctx.fillStyle = this.white
    this.ctx.textAlign = 'center'
    this.ctx.fillText(msg, this.base_width / 2, baseY)
    this.ctx.font = '40px Comic Sans MS'
    this.ctx.fillText(`Puntaje final: ${this.score}`, this.base_width / 2, baseY + 70)
    this.ctx.font = '30px Comic Sans MS'
    this.ctx.fillText('Toca la pantalla o F para reiniciar', this.base_width / 2, baseY + 130)

    if (this.crashEnemy !== undefined) {
      const crashImg = this.crashImages[this.crashEnemy]
      if (crashImg && crashImg.complete) {
        this.ctx.drawImage(crashImg, this.base_width / 2 - 200, baseY + 180, 400, 500)
      }
    }
    if (this.elitLogo && this.elitLogo.complete) {
      const logoSize = 100
      this.ctx.drawImage(this.elitLogo, this.base_width - logoSize - 10, this.base_height - logoSize - 10, logoSize, logoSize)
    }
    if (this.congresoLogo && this.congresoLogo.complete) {
      const logoSize = 120
      this.ctx.drawImage(this.congresoLogo, 10, this.base_height - logoSize - 10, logoSize, logoSize)
    }

    // Enviar score
    if (this.userId != null) {
      api.post(ROUTES.SCORES.CREATE, { value: this.score }, { withCredentials: true })
        .then((r) => console.log('Puntaje guardado:', r.data))
        .catch((err) => console.error('Error guardando puntaje:', err?.response?.data || err.message))
    } else {
      console.error('No se pudo enviar puntaje: userId no asignado (no hay sesión)')
    }
  }

  // Update
  update(dt) {
    if (this.paused) return

    // Input teclado
    const move = this.car_speed * dt
    if (this.keys['ArrowLeft']) this.car_x -= move
    if (this.keys['ArrowRight']) this.car_x += move
    if (this.keys['ArrowUp']) this.car_y -= move
    if (this.keys['ArrowDown']) this.car_y += move

    // Limites
    const road_x = this.base_width / 4
    const road_width = this.base_width / 2
    this.car_x = Math.max(road_x, Math.min(this.car_x, road_x + road_width - this.car_width))
    this.car_y = Math.max(0, Math.min(this.car_y, this.base_height - this.car_height))

    // Enemigos bajan
    const enemyMove = this.enemy_speed * dt
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].y += enemyMove
    }

    // Spawn por intervalo de tiempo
    const now = performance.now()
    if (now - this.lastSpawnTime >= this.spawnIntervalMs) {
      // Aumenta dificultad suavemente
      this.enemy_speed = Math.min(this.enemy_speed + 6, 900)
      this.spawnIntervalMs = Math.max(220, this.spawnIntervalMs - 6)
      this.spawnEnemy()
    }

    // Fondo
    const bgMove = this.bg_speed * dt
    this.bg_y += bgMove
    if (this.bg_y >= this.base_height) this.bg_y = 0

    // Colisión
    if (this.checkCollision()) {
      this.displayMessage('¡Choque! Fin del juego')
      return
    }

    // Dibuja
    this.draw()

    // Reinicio tras game over con tecla F
    if (this.game_over && (this.keys['f'] || this.keys['F'])) {
      this.initialize()
      this.game_over = false
    }
  }

  // Game loop
  run = (ts) => {
    if (this.paused) {
      this.lastRAFTime = ts ?? performance.now()
      this.rafId = requestAnimationFrame(this.run)
      return
    }

    const now = ts ?? performance.now()
    const last = this.lastRAFTime || now
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)) // clamp dt [0..50ms]
    this.lastRAFTime = now

    if (!this.game_over) {
      this.update(dt)
    } else {
      // Redibujar pantalla de fin (por si hay resize)
      this.displayMessage('¡Choque! Fin del juego')
    }

    this.rafId = requestAnimationFrame(this.run)
  }

  start() {
    // comenzar música en el primer input; aquí solo preparamos loop
    this.rafId = requestAnimationFrame(this.run)
  }

  pauseToggle() {
    this.paused = !this.paused
    if (this.paused) {
      this.backgroundMusic?.pause()
    } else {
      this.backgroundMusic?.play().catch(() => {})
    }
  }

  nextSong() {
    if (!this.backgroundMusic) return
    this.backgroundMusic.pause()
    this.currentSongIndex++
    if (this.currentSongIndex >= this.songPool.length) {
      this.shuffle(this.songPool)
      this.currentSongIndex = 0
    }
    this.backgroundMusic.src = this.songs[this.songPool[this.currentSongIndex]]
    this.backgroundMusic.play().catch(() => {})
  }

  // Limpieza
  destroy() {
    cancelAnimationFrame(this.rafId)
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keyup', this.keyupHandler)
    window.removeEventListener('resize', this._resize)
    this.canvas.removeEventListener('touchstart', this._touchStart)
    this.canvas.removeEventListener('touchmove', this._touchMove)
    this.canvas.removeEventListener('touchend', this._touchEnd)
    this.backgroundMusic?.pause()
    this.backgroundMusic = null
  }
}

let gameInstance = null

const startGame = () => {
  if (entryPage.value) entryPage.value.style.display = 'none'
  if (gameContainer.value) gameContainer.value.style.display = 'block'

  if (!gameInstance && gameCanvas.value) {
    gameInstance = new CarRacing(gameCanvas.value, router)
    gameInstance.start()
  }
}

const togglePause = () => {
  if (gameInstance) gameInstance.pauseToggle()
}

const nextSong = () => {
  if (gameInstance) gameInstance.nextSong()
}

const navigateToLeaderboard = () => {
  router.push('/leaderboard')
}

onMounted(() => {
  const resizeHandler = () => {
    if (gameInstance) gameInstance.resizeCanvas()
  }
  window.addEventListener('resize', resizeHandler)

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
    if (gameInstance) {
      gameInstance.destroy()
      gameInstance = null
    }
  })
})
</script>
