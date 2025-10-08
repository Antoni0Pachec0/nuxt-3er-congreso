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
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
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

const entryPage = ref(null);
const gameContainer = ref(null);
const gameCanvas = ref(null);
const router = useRouter();

// Función para obtener cookies
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

// Función para obtener token de acceso
function getAccessToken() {
  // 1. Intentar desde cookies
  const cookieToken = getCookie('access_token');
  if (cookieToken) {
    return cookieToken;
  }

  // 2. Intentar desde localStorage
  const localStorageToken = localStorage.getItem('access_token');
  if (localStorageToken) {
    return localStorageToken;
  }

  // 3. Intentar desde sessionStorage
  const sessionStorageToken = sessionStorage.getItem('access_token');
  if (sessionStorageToken) {
    return sessionStorageToken;
  }

  return null;
}

// Verificar autenticación
const checkAuthentication = async () => {
  // 1. Verificar token de acceso
  const accessToken = getAccessToken();
  if (accessToken && accessToken !== 'COOKIE_TOKEN_AVAILABLE') {
    try {
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      if (decoded && decoded.userId) {
        localStorage.setItem('userId', decoded.userId.toString());
        return true;
      }
    } catch (error) {
      // Token inválido, continuar con otros métodos
    }
  }

  // 2. Verificar si ya tenemos userId en localStorage
  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    const tokenResult = await getTokenForExistingUser();
    if (tokenResult) {
      return true;
    }
    return true; // Permitir jugar pero no guardar score
  }

  return false;
};

// Lógica del juego
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
    this.baseSpawnInterval = 2000;
    this.minSpawnInterval = 500;
    this.difficultyLevel = 1;
    this.maxDifficulty = 10;
    
    this.initialize();
    this.loadUserId();
    this.keys = {};
    
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });
    window.addEventListener("keyup", (e) => this.keys[e.key] = false);
    
    this.touchStartX = null;
    this.touchStartY = null;
    this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e));
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    this.canvas.addEventListener("touchend", (e) => this.handleTouchEnd(e));
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  initializeLanes() {
    const roadWidth = this.base_width / 2;
    const roadX = this.base_width / 4;
    const laneWidth = roadWidth / 3;
    
    this.lanes = [
      roadX + laneWidth * 0.5 - this.enemy_width * 0.5,
      roadX + laneWidth * 1.5 - this.enemy_width * 0.5,
      roadX + laneWidth * 2.5 - this.enemy_width * 0.5
    ];
  }

  updateDifficulty() {
    const previousLevel = this.difficultyLevel;
    
    this.difficultyLevel = Math.min(this.maxDifficulty, Math.floor(this.score / 10) + 1);
    
    this.enemy_speed = 4 + (this.difficultyLevel * 0.5);
    this.bg_speed = this.enemy_speed;
    
    const spawnReduction = (this.difficultyLevel - 1) * 0.15;
    this.currentSpawnInterval = Math.max(
      this.minSpawnInterval, 
      this.baseSpawnInterval * (1 - spawnReduction)
    );
    
    this.maxEnemiesOnScreen = Math.min(6, 2 + Math.floor(this.difficultyLevel / 2));
  }

  loadUserId() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
      return;
    }

    const token = getAccessToken();
    if (token) {
      this.extractUserIdFromToken(token);
    }
  }

  extractUserIdFromToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      if (decoded) {
        this.userId = decoded.userId || decoded.user_id || decoded.id || decoded.sub;
        
        if (this.userId) {
          this.userId = parseInt(this.userId, 10);
          localStorage.setItem('userId', this.userId.toString());
        }
      }
    } catch (error) {
      // Error silencioso al extraer userId del token
    }
  }

  // Enviar puntaje al backend
  async sendScoreToBackend() {
    if (this.scoreSent) {
      return;
    }

    this.scoreSent = true;

    if (!this.userId) {
      this.loadUserId();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!this.userId) {
      this.displayAuthMessage();
      this.scoreSent = false;
      return;
    }

    if (this.score <= 0) {
      this.scoreSent = false;
      return;
    }

    try {
      const accessToken = getAccessToken();
      
      if (!accessToken || accessToken === 'COOKIE_TOKEN_AVAILABLE') {
        const response = await api.post(ROUTES.SCORES.CREATE, {
          value: this.score
        }, {
          timeout: 10000,
          withCredentials: true
        });

        this.displaySuccessMessage();
        return;
      }

      const payload = {
        value: this.score
      };

      const response = await api.post(ROUTES.SCORES.CREATE, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true
      });

      this.displaySuccessMessage();
      
    } catch (error) {
      this.scoreSent = false;
      
      if (error.response?.status === 401) {
        this.handleTokenExpired();
      } else if (error.response?.status === 400) {
        this.displayErrorMessage('Error en los datos enviados');
      } else if (error.code === 'ECONNABORTED') {
        this.displayErrorMessage('Tiempo de espera agotado');
      } else {
        this.displayErrorMessage('Error de conexión');
      }
    }
  }

  // Manejar token expirado
  async handleTokenExpired() {
    localStorage.removeItem('userId');
    this.userId = null;
    
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    
    this.displayAuthErrorMessage();
  }

  displayAuthMessage() {
    this.drawMessage("⚠️ Inicia sesión para guardar tu puntaje", "#FF6B6B");
  }

  displaySuccessMessage() {
    this.drawMessage("✅ Puntaje guardado exitosamente", "#4ECDC4");
  }

  displayAuthErrorMessage() {
    this.drawMessage("🔐 Sesión expirada. Vuelve a iniciar sesión", "#FF6B6B");
  }

  displayErrorMessage(customMessage = "⚠️ Error al guardar puntaje") {
    this.drawMessage(customMessage, "#FFA500");
  }

  drawMessage(message, color) {
    const offsetX = (this.canvas.width - this.base_width * this.scale) / 2;
    const offsetY = (this.canvas.height - this.base_height * this.scale) / 2;
    
    this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY);
    this.ctx.font = `bold 24px Comic Sans MS`;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(message, this.base_width / 2, this.base_height / 2 + 250);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  
  shuffleEnemies() {
    for (let i = this.enemyPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.enemyPool[i], this.enemyPool[j]] = [this.enemyPool[j], this.enemyPool[i]];
    }
  }
  
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
    this.currentSpawnInterval = this.baseSpawnInterval;
    
    this.initializeLanes();
    this.updateDifficulty();
  }
  
  spawnEnemy() {
    if (this.enemies.length >= this.maxEnemiesOnScreen) {
      return;
    }

    if (this.enemyPool.length === 0) {
      this.enemyPool = [0, 1, 2, 3, 4];
      this.shuffleEnemies();
    }
    
    const designIndex = this.enemyPool.pop();
    const availableLanes = this.getAvailableLanes();
    if (availableLanes.length === 0) {
      this.enemyPool.push(designIndex);
      return;
    }
    
    const randomLaneIndex = Math.floor(Math.random() * availableLanes.length);
    const enemy_x = availableLanes[randomLaneIndex];
    
    this.enemies.push({ 
      x: enemy_x, 
      y: -this.enemy_height, 
      designIndex,
      lane: availableLanes.indexOf(enemy_x)
    });
    
    this.lastSpawnTime = Date.now();
  }
  
  getAvailableLanes() {
    const availableLanes = [...this.lanes];
    const safeDistance = this.enemy_height * 1.5;
    
    for (let i = availableLanes.length - 1; i >= 0; i--) {
      const laneX = availableLanes[i];
      
      for (const enemy of this.enemies) {
        if (Math.abs(enemy.x - laneX) < 10 && enemy.y > -safeDistance) {
          availableLanes.splice(i, 1);
          break;
        }
      }
    }
    
    return availableLanes;
  }
  
  handleTouchStart(e) {
    e.preventDefault();
    if (this.game_over) {
      this.initialize();
      this.game_over = false;
    } else {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  }
  
  handleTouchMove(e) {
    e.preventDefault();
    if (this.touchStartX !== null && this.touchStartY !== null && !this.game_over) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = (touchX - this.touchStartX) / this.scale;
      const deltaY = (touchY - this.touchStartY) / this.scale;
      this.car_x += deltaX * 0.8;
      this.car_y += deltaY * 0.8;
      this.touchStartX = touchX;
      this.touchStartY = touchY;
    }
  }
  
  handleTouchEnd(e) {
    e.preventDefault();
    this.touchStartX = null;
    this.touchStartY = null;
  }
  
  draw_objects() {
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
        this.updateDifficulty();
        
        if (this.score % 15 === 0) {
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
  
  display_message(msg) {
    if (this.game_over && this.scoreSent) {
      this.drawGameOverScreen(msg);
      return;
    }

    this.game_over = true;
    this.drawGameOverScreen(msg);
    
    if (!this.scoreSent) {
      this.sendScoreToBackend();
    }
  }

  drawGameOverScreen(msg) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = this.black;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const offsetX = (this.canvas.width - this.base_width * this.scale) / 2;
    const offsetY = (this.canvas.height - this.base_height * this.scale) / 2;
    this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY);
    const baseY = this.base_height / 2 - 400;
    this.ctx.font = `bold 72px Comic Sans MS`;
    this.ctx.fillStyle = this.white;
    this.ctx.textAlign = "center";
    this.ctx.fillText(msg, this.base_width / 2, baseY);
    this.ctx.font = `40px Comic Sans MS`;
    this.ctx.fillText(`Puntaje final: ${this.score}`, this.base_width / 2, baseY + 70);
    this.ctx.font = `30px Comic Sans MS`;
    this.ctx.fillText("Toca la pantalla o F para reiniciar", this.base_width / 2, baseY + 130);
    this.ctx.fillText(`Nivel alcanzado: ${this.difficultyLevel}`, this.base_width / 2, baseY + 180);
    
    if (this.crashEnemy !== undefined) {
      const crashImg = this.crashImages[this.crashEnemy];
      if (crashImg && crashImg.complete) {
        this.ctx.drawImage(crashImg, this.base_width / 2 - 200, baseY + 220, 400, 500);
      }
    }
    if (this.elitLogo && this.elitLogo.complete) {
      const logoSize = 100;
      this.ctx.drawImage(this.elitLogo, this.base_width - logoSize - 10, this.base_height - logoSize - 10, logoSize, logoSize);
    }
    if (this.congresoLogo && this.congresoLogo.complete) {
      const logoSize = 120;
      this.ctx.drawImage(this.congresoLogo, 10, this.base_height - logoSize - 10, logoSize, logoSize);
    }
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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
  
  update() {
    if (!this.game_over) {
      this.bg_y += this.bg_speed;
      if (this.bg_y >= this.base_height) {
        this.bg_y = 0;
      }
      
      if (this.keys["ArrowLeft"] || this.keys["a"] || this.keys["A"]) {
        this.car_x -= this.car_speed;
      }
      if (this.keys["ArrowRight"] || this.keys["d"] || this.keys["D"]) {
        this.car_x += this.car_speed;
      }
      if (this.keys["ArrowUp"] || this.keys["w"] || this.keys["W"]) {
        this.car_y -= this.car_speed;
      }
      if (this.keys["ArrowDown"] || this.keys["s"] || this.keys["S"]) {
        this.car_y += this.car_speed;
      }
      
      this.car_x = Math.max(this.road_x, Math.min(this.car_x, this.road_x + this.road_width - this.car_width));
      this.car_y = Math.max(0, Math.min(this.car_y, this.base_height - this.car_height));
      
      for (let enemy of this.enemies) {
        enemy.y += this.enemy_speed;
      }
      
      const currentTime = Date.now();
      if (currentTime - this.lastSpawnTime > this.currentSpawnInterval) {
        this.spawnEnemy();
      }
      
      if (this.check_collision()) {
        this.display_message("¡Choque! Fin del juego");
        return;
      }
      
      this.draw_objects();
    } else {
      this.drawGameOverScreen("¡Choque! Fin del juego");
    }
    
    if (this.game_over && (this.keys["f"] || this.keys["F"])) {
      this.initialize();
      this.game_over = false;
    }
  }
  
  run() {
    const gameLoop = () => {
      this.update();
      setTimeout(() => requestAnimationFrame(gameLoop), 1000 / this.fps);
    };
    requestAnimationFrame(gameLoop);
  }
}

// Obtener token para usuarios existentes
const getTokenForExistingUser = async () => {
  const userId = localStorage.getItem('userId');
  
  if (!userId) {
    return null;
  }

  const existingToken = localStorage.getItem('access_token');
  if (existingToken) {
    return existingToken;
  }

  try {
    const response = await api.get(ROUTES.AUTH.ME, {
      withCredentials: true
    });
    
    if (response.data) {
      return 'COOKIE_TOKEN_AVAILABLE';
    }
  } catch (error) {
    // Error silencioso
  }

  return null;
};

let gameInstance = null;

const startGame = async () => {
  const isAuthenticated = await checkAuthentication();
  
  if (!isAuthenticated) {
    alert('🔐 Debes iniciar sesión para jugar');
    router.push('/login');
    return;
  }

  if (entryPage.value) {
    entryPage.value.style.display = 'none';
  }
  if (gameContainer.value) {
    gameContainer.value.style.display = 'block';
  }
  if (!gameInstance && gameCanvas.value) {
    gameInstance = new CarRacing(gameCanvas.value, router);
    gameInstance.run();
  }
};

const togglePause = () => {
  if (gameInstance) {
    gameInstance.paused = !gameInstance.paused;
  }
};

const nextSong = () => {
  if (gameInstance && gameInstance.backgroundMusic) {
    gameInstance.backgroundMusic.pause();
    gameInstance.currentSongIndex++;
    if (gameInstance.currentSongIndex >= gameInstance.songPool.length) {
      gameInstance.shuffleSongs();
      gameInstance.currentSongIndex = 0;
    }
    gameInstance.backgroundMusic.src = gameInstance.songs[gameInstance.songPool[gameInstance.currentSongIndex]];
    gameInstance.backgroundMusic.play();
  }
};

// 🔥 CORREGIDO: Navegación al leaderboard
const navigateToLeaderboard = () => {
  router.push('/game/leaderboard');
};

onMounted(() => {
  if (gameCanvas.value) {
    const resizeHandler = () => {
      if (gameInstance) {
        gameInstance.resizeCanvas();
      }
    };
    window.addEventListener('resize', resizeHandler);
    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler);
    });
  }
});
</script>