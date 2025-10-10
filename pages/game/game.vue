<template>
  <div>
    <!-- Pantalla de entrada -->
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

    <!-- Contenedor de juego -->
    <div id="gameContainer" ref="gameContainer" style="display:none">
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
import { definePageMeta } from '#imports'
import { useGame } from '@/composables/game/use-game'
import '@/assets/css/styles/game/game.css'

definePageMeta({
  name: 'game',
  path: '/game',          // ← corrige el path para no duplicar /game/game
  alias: ['/game/game'],
  requiresAuth: true
})

const {
  // refs de template
  entryPage,
  gameContainer,
  gameCanvas,

  // acciones UI
  startGame,
  togglePause,
  nextSong,
  navigateToLeaderboard,
} = useGame()
</script>
