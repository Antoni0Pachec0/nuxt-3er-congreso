<template>
  <div>
    <div id="entry-page" ref="entryPage">
      <h1>MotocleCar </h1>
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
      <div v-if="!isAuthenticated" class="auth-warning">
          Inicia sesión para guardar tu puntaje.
      </div>
    </div>

    <div id="gameContainer" ref="gameContainer" style="display: none;">
      <canvas id="gameCanvas" ref="gameCanvas"></canvas>

      <div id="musicControls">
        <button id="pauseBtn" class="Btn" :disabled="!gameInstance" @click="togglePause">
          {{ pauseLabel }}
          <svg class="svgIcon" viewBox="0 0 576 512">
            <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"/>
          </svg>
        </button>

        <button class="Btn" @click="navigateToLeaderboard">
            Posiciones
            <svg class="svgIcon" viewBox="0 0 576 512">
                <path d="M512 0c8.8 0 16 7.2 16 16v32H48V16c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V144H528zM64 64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm56 248c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"/>
            </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// Importación de assets con alias @/ o ~/...
import fondo1 from '@/assets/images/images/funds/fondo.webp';
import fondo2 from '@/assets/images/images/funds/fondoTarde.webp';
import fondo3 from '@/assets/images/images/funds/fondoNoche.webp';
import carMotocle from '@/assets/images/images/cars/motocle.webp';
import combi from '@/assets/images/images/cars/combi.webp';
import carro from '@/assets/images/images/cars/carro.webp';
import hinfinitum from '@/assets/images/images/cars/hinfinitum.webp';
import moto from '@/assets/images/images/cars/moto.webp';
import bici from '@/assets/images/images/cars/bici.webp';
import Pedraza from '@/assets/images/images/professors/Pedraza.webp';
import Elvis from '@/assets/images/images/professors/Elvis.webp';
import Julio from '@/assets/images/images/professors/Julio.webp';
import Victor from '@/assets/images/images/professors/Victor.webp';
import Elit from '@/assets/images/images/logos/elit.webp';
import LogoCongreso from '@/assets/images/images/logos/LogoCongreso.webp';
import api from '@/plugins/http/api'; 
import '@/assets/css/styles/Game.css';
import { ROUTES } from '~/plugins/http/routes'

definePageMeta({
  name: 'game',
  path: '/game/game',
  alias: ['/game/game'],
  requiresAuth: true,
})

const entryPage = ref(null);
const gameContainer = ref(null);
const gameCanvas = ref(null);
const pauseLabel = ref('Pausa');
const gameInstance = ref(null);
const isAuthenticated = ref(false); // Nuevo estado para mostrar advertencia
const router = useRouter();

// --- Funciones de Autenticación y Token (dejadas como estaban) ---

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  try {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      }
    }
    return null;
  } catch (error) {
  
    return null;
  }
}

function getAccessToken() {
  const cookieToken = getCookie('access_token');
  if (cookieToken) return cookieToken;
  const localStorageToken = localStorage.getItem('access_token');
  if (localStorageToken) return localStorageToken;
  return null;
}

async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token') || getCookie('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    const response = await api.post(
      ROUTES.AUTH.REFRESH,
      { refresh_token: refreshToken },
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      return response.data.access_token;
    }
  } catch (error) {
    console.error('❌ Error al refrescar token:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userId');
    router.push('/login');
    throw error;
  }
}

const checkAuthentication = async () => {
  const token = getAccessToken();
  const userId = localStorage.getItem('userId');
  
  const hasCredentials = !!token && !!userId;
  isAuthenticated.value = hasCredentials; // Actualizar estado reactivo
  
  if (hasCredentials) {
   
    return true;
  }
  

  return false;
};

// --- Clase CarRacing Mejorada ---

class CarRacing {
  constructor(canvas, router) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.router = router;
    this.base_width = 800;
    this.base_height = 1510;
    this.scale = 1;
    this.resizeCanvas();
    this.black = "#000000";
    this.white = "#FFFFFF";
    this.red = "#FF0000";
    this.green = "#000000";
    this.gray = "#808080";
    this.fps = 90;
    this.paused = false;
    this.gameLoopId = null;
    this.userId = null;
    this.scoreSent = false;
    this.songPool = Array.from({length: this.songs.length}, (_, i) => i);
    this.shuffleSongs();
    this.currentSongIndex = 0;
    this.backgroundMusic = new Audio(this.songs[this.songPool[this.currentSongIndex]]);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;

    // Sistema de carriles
    this.lanes = [];
    this.initializeLanes();

    this.backgrounds = [fondo1, fondo2, fondo3];
    this.currentBackgroundIndex = 0;
    this.backgroundImages = this.backgrounds.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    this.playerCarImage = new Image();
    this.playerCarImage.src = carMotocle;

    this.enemyCarImages = [new Image(), new Image(), new Image(), new Image(), new Image()];
    this.enemyCarImages[0].src = combi;
    this.enemyCarImages[1].src = carro;
    this.enemyCarImages[2].src = hinfinitum;
    this.enemyCarImages[3].src = moto;
    this.enemyCarImages[4].src = bici;

    this.crashImages = [new Image(), new Image(), new Image(), new Image(), new Image()];
    this.crashImages[0].src = Pedraza;
    this.crashImages[1].src = Elvis;
    this.crashImages[2].src = Julio;
    this.crashImages[3].src = Victor;
    this.crashImages[4].src = bici;

    this.elitLogo = new Image();
    this.elitLogo.src = Elit;
    this.congresoLogo = new Image();
    this.congresoLogo.src = LogoCongreso;

    this.enemyPool = [0, 1, 2, 3, 4];
    this.shuffleEnemies();

    // Sistema de dificultad progresiva
    this.lastSpawnTime = 0;
    this.baseSpawnInterval = 1300;
    this.minSpawnInterval = 350;
    this.difficultyLevel = 1;
    this.maxDifficulty = 10;

    this.initialize();
    this.loadUserId();
    this.keys = {};

    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      // Atajo global para pausar/reanudar con la tecla P
      if (e.key === 'p' || e.key === 'P') {
        this.setPauseState(!this.paused);
      }
      // Intentar reproducir música al presionar cualquier tecla (para Chrome/autodesplazamiento)
      if (this.backgroundMusic && this.backgroundMusic.paused) {
        const p = this.backgroundMusic.play();
        if (p && p.catch) p.catch(() => {});
      }
    });
    window.addEventListener("keyup", (e) => this.keys[e.key] = false);

    // Eventos Táctiles (dejados como estaban)
    this.touchStartX = null;
    this.touchStartY = null;
    this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e));
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    this.canvas.addEventListener("touchend", (e) => this.handleTouchEnd(e));
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  // MÉTODO MEJORADO PARA CONTROL DE PAUSA/REANUDACIÓN
  setPauseState(state) {
    this.paused = !!state;

    // Emitir evento para actualizar la etiqueta del botón en Vue
    if (this.canvas) {
        this.canvas.dispatchEvent(new CustomEvent('updatePauseLabel', { detail: this.paused }));
    }

    try {
      if (this.backgroundMusic) {
        if (this.paused) {
          this.backgroundMusic.pause();
        } else {
          // Promise para manejar el error de reproducción automática
          const p = this.backgroundMusic.play();
          if (p && p.catch) p.catch((e) => console.warn('Música no pudo reanudar, se requiere interacción:', e));
        }
      }
    } catch (e) {
      console.warn('Error controlando background music en setPauseState:', e);
    }
  }

  // --- Música y Dificultad ---
  
  shuffleSongs() {
      for (let i = this.songPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.songPool[i], this.songPool[j]] = [this.songPool[j], this.songPool[i]];
      }
  }

  updateDifficulty() {
    // Aumenta el nivel cada 10 puntos, con un máximo de 10
    this.difficultyLevel = Math.min(this.maxDifficulty, Math.floor(this.score / 10) + 1);
    
    // Aumenta la velocidad del enemigo con el nivel (p. ej., cuadráticamente para más dificultad)
    this.enemy_speed = 4 + Math.pow(this.difficultyLevel, 1.5);
    
    // La velocidad del fondo debe ir acorde, pero puede ser ligeramente más rápida para un efecto de movimiento rápido
    this.bg_speed = this.enemy_speed * 1.5;

    // Reduce el intervalo de aparición progresivamente
    const spawnReductionFactor = (this.difficultyLevel - 1) / (this.maxDifficulty - 1); // 0 a 1
    const reducedInterval = this.baseSpawnInterval - (this.baseSpawnInterval - this.minSpawnInterval) * spawnReductionFactor;
    
    // Añadir un poco de aleatoriedad
    this.currentSpawnInterval = Math.max(
      this.minSpawnInterval,
      reducedInterval + (Math.random() * 200) // Un poco de variación
    );

    // Aumenta el número máximo de enemigos en pantalla
    this.maxEnemiesOnScreen = Math.min(10, 2 + Math.floor(this.difficultyLevel / 2));
  }

  // ... (otros métodos como initializeLanes, loadUserId, sendScoreToBackend, etc. no han sido modificados significativamente y se mantienen) ...

  drawPauseScreen() {
    // Dibuja una overlay semi-transparente y texto de pausa
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const offsetX = (this.canvas.width - this.base_width * this.scale) / 2;
    const offsetY = (this.canvas.height - this.base_height * this.scale) / 2;
    this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY);
    this.ctx.font = `bold 72px Comic Sans MS`;
    this.ctx.fillStyle = this.white;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Pausa', this.base_width / 2, this.base_height / 2 - 20);
    this.ctx.font = `28px Comic Sans MS`;
    this.ctx.fillText('Presiona P o Pausa para reanudar', this.base_width / 2, this.base_height / 2 + 30);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // Métodos de inicialización de la lógica del juego (mantener el resto de la clase CarRacing)
  initializeLanes() {
      const roadWidth = this.base_width / 2;
      const roadX = this.base_width / 4;
      const laneWidth = roadWidth / 3;
      const carOffset = (this.enemy_width || 120) * 0.5;

      this.lanes = [
          roadX + laneWidth * 0.5 - carOffset,
          roadX + laneWidth * 1.5 - carOffset,
          roadX + laneWidth * 2.5 - carOffset
      ];
  }

  loadUserId() {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
          this.userId = storedUserId;
      }
  }

  // Lógica para enviar puntaje al backend (Mantenida)
  async sendScoreToBackend() {
      if (this.scoreSent || this.score <= 0) {
          return;
      }

      let accessToken = getAccessToken();
      const userId = localStorage.getItem('userId');

      if (!userId) {
          console.error('userId no encontrado');
          return;
      }

      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
          try {
              attempts++;

              if (!accessToken && attempts === 1) {
                  accessToken = await refreshAccessToken();
              }

              if (!accessToken) {
                  throw new Error('No hay token disponible después del refresh');
              }

              const requestData = { 
                  value: this.score
              };

              await api.post(
                  ROUTES.SCORES.CREATE,
                  requestData,
                  { 
                      timeout: 10000,
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${accessToken}`
                      }
                  }
              );

              this.scoreSent = true;
             
              return;

          } catch (error) {
              if (error.response?.status === 401 && attempts < maxAttempts) {
                  accessToken = null;
                  continue;
              }

              this.scoreSent = false;
              
              if (error.response?.status === 401) {
                  setTimeout(() => this.router.push('/login'), 2000);
              }
              break;
          }
      }
  }

  async ensureScoreSent() {
      if (this.scoreSent || this.score <= 0) return;
      
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts && !this.scoreSent) {
          try {
              await this.sendScoreToBackend();
              
              if (this.scoreSent) {
                  break;
              }
              
          } catch (error) {
              // Manejo de errores ya en sendScoreToBackend
          }
          
          attempts++;
          
          if (!this.scoreSent && attempts < maxAttempts) {
              const delay = Math.min(1000 * Math.pow(2, attempts), 5000);
              await new Promise(resolve => setTimeout(resolve, delay));
          }
      }
      
      if (!this.scoreSent) {
          console.error('No se pudo enviar el puntaje después de', maxAttempts, 'intentos');
      }
  }

  draw_objects() {
      // ... (Resto de la función draw_objects, asegurando que llama a updateDifficulty)
      const offsetX = (this.canvas.width - this.base_width * this.scale) / 2;
      const offsetY = (this.canvas.height - this.base_height * this.scale) / 2;
      this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY);

      const bgImage = this.backgroundImages[this.currentBackgroundIndex];
      if (bgImage.complete && bgImage.naturalWidth !== 0) {
          this.ctx.drawImage(bgImage, 0, this.bg_y, this.base_width, this.base_height);
          this.ctx.drawImage(bgImage, 0, this.bg_y - this.base_height, this.base_width, this.base_height);
      } else {
          this.ctx.fillStyle = this.green;
          this.ctx.fillRect(0, 0, this.base_width, this.base_height);
      }

      if (this.playerCarImage.complete && this.playerCarImage.naturalWidth !== 0) {
          this.ctx.drawImage(this.playerCarImage, this.car_x, this.car_y, this.car_width, this.car_height);
      } else {
          this.ctx.fillStyle = this.red;
          this.ctx.fillRect(this.car_x, this.car_y, this.car_width, this.car_height);
      }

      for (let i = this.enemies.length - 1; i >= 0; i--) {
          const enemy = this.enemies[i];
          const img = this.enemyCarImages[enemy.designIndex];
          if (img && img.complete && img.naturalWidth !== 0) {
              this.ctx.drawImage(img, enemy.x, enemy.y, this.enemy_width, this.enemy_height);
          } else {
              this.ctx.fillStyle = this.white;
              this.ctx.fillRect(enemy.x, enemy.y, this.enemy_width, this.enemy_height);
          }

          if (enemy.y > this.base_height + this.enemy_height) {
              this.enemies.splice(i, 1);
              this.score++;
              this.updateDifficulty(); // <-- Llama a la función de dificultad aquí
              
              if (this.score % 10 === 0) {
                  this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgroundImages.length;
              }
          }
      }

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      const hudX = Math.round(offsetX + 10 * this.scale);
      const hudY = Math.round(offsetY + 40 * this.scale);
      const hudFontPx = Math.max(12, Math.round(30 * this.scale));
      this.ctx.font = `${hudFontPx}px Comic Sans MS`;
      this.ctx.fillStyle = this.white;
      this.ctx.textAlign = "left";
      this.ctx.fillText(`Puntaje: ${this.score}`, hudX, hudY);

      const levelX = Math.round(offsetX + 10 * this.scale);
      const levelY = Math.round(offsetY + 80 * this.scale);
      this.ctx.fillText(`Nivel: ${this.difficultyLevel}`, levelX, levelY);
  }

  // --- Método Update Corregido para Pausa y Spawn ---
  update() {
    if (!this.game_over) {
      if (this.paused) {
        this.draw_objects(); 
        this.drawPauseScreen();
        return;
      }
      
      // Movimiento del fondo
      this.bg_y += this.bg_speed;
      if (this.bg_y >= this.base_height) this.bg_y = 0;

      // Movimiento del jugador (Teclas)
      if (this.keys["ArrowLeft"] || this.keys["a"] || this.keys["A"]) this.car_x -= this.car_speed;
      if (this.keys["ArrowRight"] || this.keys["d"] || this.keys["D"]) this.car_x += this.car_speed;
      if (this.keys["ArrowUp"] || this.keys["w"] || this.keys["W"]) this.car_y -= this.car_speed;
      if (this.keys["ArrowDown"] || this.keys["s"] || this.keys["S"]) this.car_y += this.car_speed;

      // Limitar posición del jugador
      this.car_x = Math.max(this.road_x, Math.min(this.car_x, this.road_x + this.road_width - this.car_width));
      this.car_y = Math.max(0, Math.min(this.car_y, this.base_height - this.car_height));

      // Movimiento de enemigos
      for (let enemy of this.enemies) enemy.y += this.enemy_speed;

      // Spawn de enemigos (usando el intervalo progresivo)
      const currentTime = Date.now();
      if (currentTime - this.lastSpawnTime > this.currentSpawnInterval) {
        this.spawnEnemy();
      }

      // Colisión
      if (this.check_collision()) {
        this.display_message("¡Choque! Fin del juego");
        return;
      }

      this.draw_objects();
    } else {
      // Si ya terminó, solo redibujar el mensaje de fin de juego (que maneja el envío de puntaje)
      this.drawGameOverScreen("¡Choque! Fin del juego");
    }

    // Reiniciar
    if (this.game_over && (this.keys["f"] || this.keys["F"])) {
      this.initialize();
      this.game_over = false;
      this.setPauseState(false); // Asegurar que no quede en pausa al reiniciar
    }
  }

  // --- El resto de los métodos se mantienen igual (resizeCanvas, initialize, spawnEnemy, etc.) ---
  
  // ... (otros métodos como drawGameOverScreen, check_collision, run) ...
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.scale = Math.min(window.innerWidth / this.base_width, window.innerHeight / this.base_height);
    this.initializeLanes();
  }

  initialize() {
      this.car_width = 120;
      this.car_height = 240;
      this.car_x = this.base_width / 2 - this.car_width / 2;
      this.car_y = this.base_height - this.car_height - 20;
      this.car_speed = 4;
      this.enemies = [];
      this.enemy_width = 120;
      this.enemy_height = 240;
      this.enemy_speed = 4;
      this.bg_y = 0;
      this.bg_speed = this.enemy_speed;
      this.score = 0;
      this.game_over = false;
      this.scoreSent = false;
      this.road_width = this.base_width / 2;
      this.road_x = this.base_width / 4;
      this.currentBackgroundIndex = 0;
      this.lastSpawnTime = 0;
      this.difficultyLevel = 1;
      this.maxEnemiesOnScreen = 2;
      this.baseSpawnInterval = 1300;
      this.minSpawnInterval = 350;
      this.currentSpawnInterval = this.baseSpawnInterval;
      this.paused = false;

      this.initializeLanes();
      this.updateDifficulty();
  }
  
  spawnEnemy() {
      if (this.enemies.length >= this.maxEnemiesOnScreen) return;
      if (this.enemyPool.length === 0) {
          this.enemyPool = [0, 1, 2, 3, 4];
          this.shuffleEnemies();
      }

      const designIndex = this.enemyPool.pop();
      // Las posiciones x ya están centradas en el carril gracias a initializeLanes
      const availableLanes = [...this.lanes]; 
      const safeDistance = this.enemy_height * 1.5;

      // Filtrar carriles donde ya hay un enemigo muy cerca de aparecer
      for (let i = availableLanes.length - 1; i >= 0; i--) {
          const laneX = availableLanes[i];
          for (const enemy of this.enemies) {
              // Comparar solo la posición x del carril con la posición x del enemigo
              // Si la distancia horizontal es mínima y el enemigo está en la parte superior, bloquear el carril
              const isSameLane = Math.abs(enemy.x - laneX) < 20; // 20px de tolerancia
              const isNearTop = enemy.y < safeDistance;
              
              if (isSameLane && isNearTop) {
                  availableLanes.splice(i, 1);
                  break;
              }
          }
      }

      if (availableLanes.length === 0) {
          this.enemyPool.push(designIndex);
          return;
      }

      const randomLaneX = availableLanes[Math.floor(Math.random() * availableLanes.length)];

      this.enemies.push({ 
          x: randomLaneX, 
          y: -this.enemy_height, 
          designIndex
      });

      this.lastSpawnTime = Date.now();
  }

  check_collision() {
      const hitboxScale = 0.5;
      const car_rect = {
          x: this.car_x + this.car_width * (1 - hitboxScale) / 2,
          y: this.car_y + this.car_height * (1 - hitboxScale) / 2,
          width: this.car_width * hitboxScale,
          height: this.car_height * hitboxScale
      };
      for (let enemy of this.enemies) {
          const enemy_rect = {
              x: enemy.x + this.enemy_width * (1 - hitboxScale) / 2,
              y: enemy.y + this.enemy_height * (1 - hitboxScale) / 2,
              width: this.enemy_width * hitboxScale,
              height: this.enemy_height * hitboxScale
          };
          if (car_rect.x < enemy_rect.x + enemy_rect.width &&
              car_rect.x + car_rect.width > enemy_rect.x &&
              car_rect.y < enemy_rect.y + enemy_rect.height &&
              car_rect.y + car_rect.height > enemy_rect.y) {
              this.crashEnemy = enemy.designIndex;
              return true;
          }
      }
      return false;
  }
  
  run() {
      const gameLoop = () => {
          this.update();
          setTimeout(() => requestAnimationFrame(gameLoop), 1000 / this.fps);
      };
      requestAnimationFrame(gameLoop);
  }
}

// --- Lógica de Vue (setup) ---

const startGame = async () => {
  await checkAuthentication(); // Actualiza isAuthenticated.value

  if (!isAuthenticated.value) {
    alert('Debes iniciar sesión para guardar tu puntaje. Serás redirigido al login.');
    router.push('/login');
    return;
  }

  if (entryPage.value) {
    entryPage.value.style.display = 'none';
  }
  if (gameContainer.value) {
    gameContainer.value.style.display = 'block';
  }

  if (!gameInstance.value && gameCanvas.value) {
    gameInstance.value = new CarRacing(gameCanvas.value, router);
    
    // Listener para actualizar la etiqueta de pausa desde la clase
    gameCanvas.value.addEventListener('updatePauseLabel', (e) => {
        pauseLabel.value = e.detail ? 'Reanudar' : 'Pausa';
    });

    // Reproducir música al iniciar
    if (gameInstance.value.backgroundMusic) {
        const p = gameInstance.value.backgroundMusic.play();
        if (p && p.catch) p.catch(() => console.warn("La música necesita interacción del usuario para reproducirse."));
    }

    gameInstance.value.run();
  }
};

const togglePause = () => {
  if (gameInstance.value) {
    // La clase CarRacing se encarga de cambiar el estado y emitir el evento para actualizar pauseLabel
    gameInstance.value.setPauseState(!gameInstance.value.paused);
  }
};

const nextSong = () => {
  if (gameInstance.value) {
    if (gameInstance.value.backgroundMusic) {
      try {
        gameInstance.value.backgroundMusic.pause();
      } catch (e) {}
      
      gameInstance.value.currentSongIndex++;
      
      // Barajar y reiniciar si llegamos al final de la lista
      if (gameInstance.value.currentSongIndex >= gameInstance.value.songPool.length) {
        gameInstance.value.shuffleSongs();
        gameInstance.value.currentSongIndex = 0;
      }
      
      const nextSongSrc = gameInstance.value.songs[gameInstance.value.songPool[gameInstance.value.currentSongIndex]];
      gameInstance.value.backgroundMusic.src = nextSongSrc;

      // Reanudar la música
      if (!gameInstance.value.paused) {
        const p = gameInstance.value.backgroundMusic.play();
        if (p && p.catch) p.catch(() => {});
      }
    }
  }
};

const navigateToLeaderboard = () => {
  router.push('/game/leaderboard');
};

onMounted(() => {
  checkAuthentication(); // Verificar estado al cargar
});

onUnmounted(() => {
  if (gameInstance.value) {
    // Detener el bucle del juego y la música
    gameInstance.value.game_over = true;
    if (gameInstance.value.backgroundMusic) {
      gameInstance.value.backgroundMusic.pause();
    }
    gameInstance.value = null; // Liberar la instancia
  }
});
</script>

<style scoped>
/* Estilos específicos para este componente si es necesario */
#gameContainer {
    position: relative;
    width: 100vw;
    height: 100vh;
}

#gameCanvas {
    display: block;
}

#musicControls {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
    z-index: 10; /* Asegurar que esté encima del canvas */
}

/* ... Mantén o añade aquí el CSS de los botones (Btn, svgIcon, etc.) y la página de inicio (entry-page) ... */
.auth-warning {
    margin-top: 20px;
    color: yellow;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 5px;
}
</style>