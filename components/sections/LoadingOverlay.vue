<template>
  <transition name="fade-out">
    <div v-if="show" class="loading-overlay">
      <!-- Fondo animado -->
      <div class="bg"></div>

      <!-- Logo central -->
      <div class="logo-wrap">
        <div class="pulse"></div>
        <img src="/assets/images/Logo.png" alt="Logo" class="logo" />
        <div class="flare"></div>
      </div>

      <!-- Cohete orbitando con profundidad -->
      <div class="orbit">
        <div class="rocket-wrap">
          <img src="/assets/images/cohete.png" alt="Cohete" class="rocket" />

          <!-- Motor (flama + humo) -->
          <div class="engine">
            <div class="flame"></div>
            <div class="trail">
              <i v-for="n in 60" :key="n"></i>
            </div>
          </div>

          <!-- Estela luminosa -->
          <div class="light-trail"></div>
        </div>
      </div>

      <p class="loading-text">Cargando...</p>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import { onNuxtReady } from "#app";

const show = ref(true);

onNuxtReady(() => {
  const images = Array.from(document.images);
  const promises = images.map(
    (img) =>
      img.complete ||
      new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      })
  );

  Promise.all(promises).then(() => {
    setTimeout(() => {
      show.value = false;
    }, 3500);
  });
});
</script>

<style scoped>
/* ===== Overlay general ===== */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #0b1534 0%, #040820 90%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  z-index: 999999;
  color: #fff;
}

/* ===== Fondo animado ===== */
.bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(-45deg, #0b1534, #1b295e, #102041, #060b22);
  background-size: 400% 400%;
  animation: gradientMove 14s ease infinite;
  opacity: 0.6;
}
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ===== Logo ===== */
.logo-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}
.logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(36, 161, 228, 0.8));
}
.pulse {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(36, 161, 228, 0.4), transparent 70%);
  filter: blur(25px);
  animation: heartbeat 2s ease-in-out infinite;
}
@keyframes heartbeat {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.25); opacity: 0.4; }
}

/* ===== Flare (destello al frente) ===== */
.flare {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.25), transparent 70%);
  filter: blur(18px);
  animation: flareBlink 7s linear infinite;
  opacity: 0;
}
@keyframes flareBlink {
  45% { opacity: 0; }
  50% { opacity: 0.9; transform: scale(1.2); }
  55% { opacity: 0; transform: scale(1); }
}

/* ===== Órbita con profundidad ===== */
.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: orbit3D 7s linear infinite;
  z-index: 4;
}
@keyframes orbit3D {
  0%   { transform: translate(-50%, -50%) rotate(0deg) scale(1) translateZ(0); }
  25%  { transform: translate(-50%, -50%) rotate(90deg) scale(0.9); filter: brightness(0.85); }
  50%  { transform: translate(-50%, -50%) rotate(180deg) scale(0.8); filter: brightness(0.7); } /* detrás */
  75%  { transform: translate(-50%, -50%) rotate(270deg) scale(0.95); filter: brightness(0.9); }
  100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); filter: brightness(1); }
}

/* ===== Cohete ===== */
.rocket-wrap {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
.rocket {
  width: 120px;
  transform: rotate(90deg);
  transform-origin: center;
  filter: drop-shadow(0 0 10px rgba(36, 161, 228, 1));
}

/* ===== Llama ===== */
.engine {
  position: absolute;
  top: 45%;
  left: -14px;
  transform: translateY(-50%);
}
.flame {
  width: 28px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(90deg, #ffe877, #ff6600, transparent 90%);
  filter: blur(2px);
  animation: flick 0.25s infinite alternate;
}
@keyframes flick {
  from { opacity: 0.8; transform: scaleX(1); }
  to   { opacity: 1; transform: scaleX(1.3); }
}

/* ===== Humo ===== */
.trail {
  position: absolute;
  top: 50%;
  left: -8px;
  transform: translateY(-50%);
  width: 100px;
  height: 60px;
  overflow: visible;
}
.trail i {
  position: absolute;
  top: 50%;
  left: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(210, 230, 255, 0.9), rgba(180, 200, 255, 0.2));
  transform: translate(0, -50%) scale(0.4);
  opacity: 0;
  filter: blur(1.5px);
  animation: smokeTrail 2.2s ease-out infinite;
}
@keyframes smokeTrail {
  0%   { opacity: 0.9; transform: translate(0, -50%) scale(0.4); }
  50%  { opacity: 0.6; }
  100% { opacity: 0; transform: translate(-80px, calc(-50% + var(--dy, 8px))) scale(1.8); }
}
.trail i:nth-child(3n){ top: 40%; }
.trail i:nth-child(5n){ top: 60%; }
.trail i:nth-child(7n){ top: 47%; }
.trail i:nth-child(2n){ top: 53%; }
.trail i:nth-child(n){ animation-delay: calc(var(--i, 1) * 0.06s); }

/* ===== Estela luminosa ===== */
.light-trail {
  position: absolute;
  top: 40%;
  left: -80px;
  width: 160px;
  height: 3px;
  background: linear-gradient(90deg, rgba(100, 220, 255, 0.6), transparent);
  border-radius: 50%;
  filter: blur(4px);
  opacity: 0.7;
  animation: trailGlow 7s linear infinite;
}
@keyframes trailGlow {
  0%, 100% { opacity: 0; }
  48% { opacity: 0; }
  50% { opacity: 1; }
  52% { opacity: 0; }
}

/* ===== Texto ===== */
.loading-text {
  position: relative;
  margin-top: 2rem;
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 1.3px;
  color: #d8e9ff;
  text-shadow: 0 0 10px rgba(100, 200, 255, 0.5);
  animation: glowText 3s ease-in-out infinite alternate;
  z-index: 10;
}
@keyframes glowText {
  0% { text-shadow: 0 0 6px rgba(120, 220, 255, 0.3); opacity: 0.8; }
  100% { text-shadow: 0 0 18px rgba(120, 220, 255, 0.9); opacity: 1; }
}

/* ===== Fade general ===== */
.fade-out-enter-active,
.fade-out-leave-active { transition: all 1s ease; }
.fade-out-leave-to { opacity: 0; transform: scale(1.06); }
</style>
