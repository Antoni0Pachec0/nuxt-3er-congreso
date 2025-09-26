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
import fondo1 from '@/assets/images/images/funds/fondo.png';
import fondo2 from '@/assets/images/images/funds/fondoTarde.png';
import fondo3 from '@/assets/images/images/funds/fondoNoche.png';
import carMotocle from '@/assets/images/images/cars/motocle.png';
import combi from '@/assets/images/images/cars/combi.png';
import carro from '@/assets/images/images/cars/carro.png';
import hinfinitum from '@/assets/images/images/cars/hinfinitum.png';
import moto from '@/assets/images/images/cars/moto.png';
import bici from '@/assets/images/images/cars/bici.png';
import Pedraza from '@/assets/images/images/professors/Pedraza.png';
import Elvis from '@/assets/images/images/professors/Elvis.png';
import Julio from '@/assets/images/images/professors/Julio.png';
import Victor from '@/assets/images/images/professors/Victor.png';
import Elit from '@/assets/images/images/logos/elit.png';
import LogoCongreso from '@/assets/images/images/logos/LogoCongreso.png';


const entryPage = ref(null);
const gameContainer = ref(null);
const gameCanvas = ref(null);
const router = useRouter();

// --- Lógica del juego ---
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
    this.lastSpawnTime = 0;
    this.minSpawnInterval = 500;
    this.initialize();
    this.loadUserIdFromLogin();
    if (this.userId === null) {
      this.fetchUserId();
    }
    this.keys = {};
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      if (this.backgroundMusic && this.backgroundMusic.paused) this.backgroundMusic.play();
    });
    window.addEventListener("keyup", (e) => this.keys[e.key] = false);
    this.touchStartX = null;
    this.touchStartY = null;
    this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e));
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    this.canvas.addEventListener("touchend", (e) => this.handleTouchEnd(e));
    window.addEventListener("resize", () => this.resizeCanvas());
    this.songs = ["../assets/sounds/elAmordeSuVida.mp3", "../assets/sounds/hablamedeti.mp3", "../assets/sounds/coqueta.mp3", "../assets/sounds/lasnoches.mp3", "../assets/sounds/MALPORTA.mp3", "../assets/sounds/SabanasBlancas.mp3", "../assets/sounds/Secunena.mp3", "../assets/sounds/MIÉNTELE.mp3", "../assets/sounds/TUSANCHO.mp3", "../assets/sounds/CAPERUZA.mp3", "../assets/sounds/SERPIENTE.mp3", "../assets/sounds/goosebumps.mp3", "../assets/sounds/ENALTAVOZ.mp3"];
    this.songPool = Array.from({ length: this.songs.length }, (_, i) => i);
    this.shuffleSongs();
    this.currentSongIndex = 0;
    this.backgroundMusic = new Audio(this.songs[this.songPool[this.currentSongIndex]]);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
  }

  loadUserIdFromLogin() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
      return;
    }
    const sessionUserId = sessionStorage.getItem('userId');
    if (sessionUserId) {
      this.userId = parseInt(sessionUserId, 10);
      return;
    }
    if (window.currentUserId) {
      this.userId = parseInt(window.currentUserId, 10);
      return;
    }
    const gameContainer = document.getElementById('gameContainer') || document.body;
    if (gameContainer.dataset.userId) {
      this.userId = parseInt(gameContainer.dataset.userId, 10);
      return;
    }
  }
  
  fetchUserId() {
    fetch('http://localhost:3000/auth/user-id', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken') || ''}` },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.userId) {
          this.userId = parseInt(data.userId, 10);
          localStorage.setItem('userId', this.userId.toString());
        } else {
         
          this.userId = Date.now() + Math.floor(Math.random() * 1000);
        
        }
      })
      .catch(err => {
       
        this.userId = Date.now() + Math.floor(Math.random() * 1000);

      });
  }
  
  shuffleSongs() {
    for (let i = this.songPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.songPool[i], this.songPool[j]] = [this.songPool[j], this.songPool[i]];
    }
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
    this.road_width = this.base_width / 2;
    this.road_x = this.base_width / 4;
    this.currentBackgroundIndex = 0;
    this.lastSpawnTime = 0;
    this.spawnEnemy();
  }
  
  spawnEnemy() {
    if (this.enemyPool.length === 0) {
      this.enemyPool = [0, 1, 2, 3, 4];
      this.shuffleEnemies();
    }
    const designIndex = this.enemyPool.pop();
    const hitboxScale = 0.5;
    const maxAttempts = 10;
    const verticalBuffer = this.enemy_height * 2;
    let attempts = 0;
    let enemy_x, validPosition;
    do {
      validPosition = true;
      enemy_x = Math.floor(Math.random() * (this.road_width - this.enemy_width)) + this.road_x;
      const newEnemyRect = {
        x: enemy_x + this.enemy_width * (1 - hitboxScale) / 2,
        y: -this.enemy_height + this.enemy_height * (1 - hitboxScale) / 2,
        width: this.enemy_width * hitboxScale,
        height: this.enemy_height * hitboxScale + verticalBuffer
      };
      for (let existingEnemy of this.enemies) {
        const existingRect = {
          x: existingEnemy.x + this.enemy_width * (1 - hitboxScale) / 2,
          y: existingEnemy.y + this.enemy_height * (1 - hitboxScale) / 2,
          width: this.enemy_width * hitboxScale,
          height: this.enemy_height * hitboxScale + verticalBuffer
        };
        if (newEnemyRect.x < existingRect.x + existingRect.width &&
          newEnemyRect.x + newEnemyRect.width > existingRect.x &&
          newEnemyRect.y < existingRect.y + existingRect.height &&
          newEnemyRect.y + newEnemyRect.height > existingRect.y) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    } while (!validPosition && attempts < maxAttempts);
    if (validPosition) {
      this.enemies.push({ x: enemy_x, y: -this.enemy_height, designIndex });
      this.lastSpawnTime = Date.now();
    } else {
      this.enemyPool.push(designIndex);
    }
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
  }
  
  display_message(msg) {
    this.game_over = true;
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
    if (this.crashEnemy !== undefined) {
      const crashImg = this.crashImages[this.crashEnemy];
      if (crashImg && crashImg.complete) {
        this.ctx.drawImage(crashImg, this.base_width / 2 - 200, baseY + 180, 400, 500);
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
    if (this.userId !== null) {
      fetch('http://localhost:3001/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken') || ''}`
        },
        body: JSON.stringify({ value: this.score })
      })
      .then(res => res.json())

    } else {
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
      if (this.keys["ArrowLeft"]) this.car_x -= this.car_speed;
      if (this.keys["ArrowRight"]) this.car_x += this.car_speed;
      if (this.keys["ArrowUp"]) this.car_y -= this.car_speed;
      if (this.keys["ArrowDown"]) this.car_y += this.car_speed;
      if (this.paused) return;
      this.car_x = Math.max(this.road_x, Math.min(this.car_x, this.road_x + this.road_width - this.car_width));
      this.car_y = Math.max(0, Math.min(this.car_y, this.base_height - this.car_height));
      for (let enemy of this.enemies) enemy.y += this.enemy_speed;
      const currentTime = Date.now();
      if (Math.random() < 0.01 && currentTime - this.lastSpawnTime >= this.minSpawnInterval) {
        this.enemy_speed += 0.1;
        this.spawnEnemy();
      }
      this.bg_y += this.bg_speed;
      if (this.bg_y >= this.base_height) this.bg_y = 0;
      if (this.check_collision()) {
        this.display_message("¡Choque! Fin del juego");
        return;
      }
      this.draw_objects();
    } else {
      this.display_message("¡Choque! Fin del juego");
    }
    if (this.game_over && (this.keys["f"] || this.keys["F"])) {
      this.initialize();
      this.game_over = false;
    }
  }
  
  run() {
    const gameLoop = () => {
      if (!this.game_over && !this.paused) {
        this.update();
      } else if (this.game_over) {
        this.update();
      }
      setTimeout(() => requestAnimationFrame(gameLoop), 1000 / this.fps);
    };
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop() { this.run(); }
}
let gameInstance = null;

const startGame = () => {
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
    if (gameInstance.paused) {
      if (gameInstance.backgroundMusic) gameInstance.backgroundMusic.pause();
    } else {
      if (gameInstance.backgroundMusic) gameInstance.backgroundMusic.play();
    }
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

const navigateToLeaderboard = () => {
  router.push('/leaderboard');
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

<style scoped>
#entry-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  z-index: 10;
}
#entry-page h1 {
  color: white;
  font-size: 3rem;
  font-family: Arial, sans-serif;
  font-weight: bold;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
#gameContainer {
  display: none;
}
#gameCanvas {
  max-width: 100%;
  max-height: 100%;
  touch-action: manipulation;
}
.button.leaderboard-btn {
  position: relative;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.3s;
}
.button.leaderboard-btn:hover {
  background-color: #45a049;
}
#gameContainer .leaderboard-btn {
  margin: 10px;
  align-self: center;
}
.Btn {
  width: 100px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(15, 15, 15);
  border-radius: 10px;
  border: none;
  color: white;
  font-weight: 600;
  gap: 8px;
  cursor: pointer;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.103);
  position: relative;
  overflow: hidden;
  transition-duration: 0.3s;
}
.Btn:before {
  width: 100px;
  height: 50px;
  content: "";
  position: absolute;
  border-radius: 50%;
  left: -100%;
  top: 0;
  background-color: rgb(27, 27, 27);
  transition-duration: 0.3s;
  transform: scale(0.7);
}
.Btn:hover:before {
  transition-duration: 0.3s;
  transform: scale(1.5);
}
.Btn:active {
  transform: scale(0.96);
  transition-duration: 0.3s;
}
body {
  margin: 0;
  overflow: hidden;
  background: black;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#gameCanvas {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}

/* Contenedor de los botones en la esquina superior derecha */
#musicControls {
  position: absolute;
  top: 1rem;
  right: 1rem; /* 👈 Mueve al lado derecho */
  z-index: 999;
  display: flex;
  flex-direction: column; /* 👈 botones uno debajo del otro */
  gap: 0.5rem;
}

/* Estilo de los botones */
.Btn {
  width: 5.5rem;   /* 👈 más pequeño */
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(15, 15, 15);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  gap: 0.4rem;
  cursor: pointer;
  box-shadow: 0.15rem 0.15rem 0.3rem rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  transition-duration: 0.3s;
  border-radius: 0.3rem;
}

.svgIcon {
  width: 0.9rem;
}

.svgIcon path {
  fill: white;
}

.Btn::before {
  width: 5.5rem;
  height: 5.5rem;
  position: absolute;
  content: "";
  background-color: white;
  border-radius: 50%;
  left: -100%;
  top: 0;
  transition-duration: 0.3s;
  mix-blend-mode: difference;
}

.Btn:hover::before {
  transition-duration: 0.3s;
  transform: translate(100%, -50%);
  border-radius: 0;
}

.Btn:active {
  transform: translate(0.15rem, 0.15rem);
  transition-duration: 0.3s;
}

/* Media query para pantallas pequeñas (móviles) */
@media (max-width: 600px) {
  #musicControls {
    top: 0.5rem;
    right: 0.5rem;
    gap: 0.4rem;
  }

  .Btn {
    width: 4.5rem;
    height: 1.8rem;
    font-size: 0.75rem;
    gap: 0.3rem;
    box-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.3);
  }

  .svgIcon {
    width: 0.8rem;
  }

  .Btn::before {
    width: 4.5rem;
    height: 4.5rem;
  }
}

/* From Uiverse.io by narmesh_sah */ 
.button {
  width: 100%;
  height: 100%;
  height: 500px;
  position: relative;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.text {
  opacity: 0;
  position: absolute;
  color: #e8e8e8;
  font-size: 4rem;
  z-index: 5;
  pointer-events: none;
  transition: opacity 0.5s ease;
  animation: fuse 2s infinite;
}
@keyframes fuse {
  20%,
  80% {
    opacity: 0.6;
  }
  40% {
    opacity: 0.2;
  }
  60% {
    opacity: 0;
  }
  70% {
    opacity: 0.4;
  }
  75% {
    opacity: 0;
  }
}

.button:hover .text,
.button:active .text {
  opacity: 1;
  animation-play-state: paused;
}

.katana-container {
  width: 100%;
  height: 100%;
  position: absolute;
  margin: 50px auto;
  background: none;
  transform: rotate(90deg);
  border-radius: 50%;
  cursor: pointer;
}

.katana {
  position: absolute;
  width: 400px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform-origin: center;
  transition: transform 0.8s cubic-bezier(0.15, 1.15, 0.35, 1.15);
}

.blade {
  width: 75%;
  height: 6px;
  background: linear-gradient(
    90deg,
    #c0c0c0 0%,
    #e8e8e8 20%,
    #ffffff 50%,
    #e8e8e8 80%,
    #c0c0c0 100%
  );
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 0 50% 50% 0;
  box-shadow: 0 0 10px rgba(200, 200, 200, 0.5);
}

/* Curved blade effect */
.blade::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 30%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0.2) 70%,
    transparent 100%
  );
  border-radius: 0 50% 50% 0;
  transform: translateY(-1px);
}

.handle {
  width: 25%;
  height: 28px;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(139, 69, 19, 0.5) 4px,
    rgba(139, 69, 19, 0.5) 8px
  );
  position: absolute;
  left: 0px;
  border-radius: 15px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.guard {
  width: 40px;
  height: 40px;
  background: radial-gradient(
    circle at center,
    #2b2b2b 0%,
    #1a1a1a 60%,
    #000000 100%
  );
  position: absolute;
  left: 20%;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.guard::after {
  content: "";
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-radius: 50%;
  background: repeating-radial-gradient(
    circle at center,
    #2b2b2b 0%,
    #1a1a1a 20%,
    #000000 40%
  );
}

.katana-1 {
  transform: translate(-60%, -60%) rotate(150deg) translateX(-100%);
}

.katana-2 {
  transform: translate(-60%, -60%) rotate(-150deg) translateX(-100%);
}

.katana-container:hover .katana-1,
.katana-container:active .katana-1 {
  transform: translate(-60%, -60%) rotate(150deg) translateX(0);
  animation: katanaClash1 0.8s cubic-bezier(0.15, 1.15, 0.35, 1.15) forwards;
}

.katana-container:hover .katana-2,
.katana-container:active .katana-2 {
  transform: translate(-60%, -60%) rotate(-150deg) translateX(0);
  animation: katanaClash2 0.8s cubic-bezier(0.15, 1.15, 0.35, 1.15) forwards;
}

@keyframes katanaClash1 {
  0% {
    transform: translate(-60%, -60%) rotate(150deg) translateX(-100%);
  }
  40% {
    transform: translate(-60%, -60%) rotate(125deg) translateX(-20%);
  }
  70% {
    transform: translate(-60%, -60%) rotate(140deg) translateX(10%);
  }
  100% {
    transform: translate(-60%, -60%) rotate(150deg) translateX(0%);
  }
}

@keyframes katanaClash2 {
  0% {
    transform: translate(-60%, -60%) rotate(-150deg) translateX(100%);
  }
  40% {
    transform: translate(-60%, -60%) rotate(-125deg) translateX(20%);
  }
  70% {
    transform: translate(-60%, -60%) rotate(-140deg) translateX(-10%);
  }
  100% {
    transform: translate(-60%, -60%) rotate(-150deg) translateX(0%);
  }
}

.katana-container::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: transparent;
  transform: translate(-70%, -70%);
  pointer-events: none;
}

.katana-container:hover::after,
.katana-container:active::after {
  animation: clashSpark 0.8s cubic-bezier(0.15, 1.15, 0.35, 1.15);
}

@keyframes clashSpark {
  0%,
  100% {
    width: 0;
    height: 0;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.9) 0%,
      transparent 70%
    );
  }
  40% {
    width: 100px;
    height: 100px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.9) 0%,
      transparent 70%
    );
  }
}

</style>