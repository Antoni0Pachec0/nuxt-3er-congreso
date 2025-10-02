<template>
  <transition name="slide-left">
    <div
      v-show="show"
      class="custom-alert"
      :class="alertClass"
      @mouseenter="pauseHide"
      @mouseleave="resumeHide"
    >
      <!-- Botón cerrar -->
      <button class="close-btn" @click="close">✖</button>

      <!-- Contenido -->
      <div class="alert-body">
        <!-- Icono SVG -->
        <div class="icon-container">
          <!-- Success -->
          <svg v-if="alertType === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <path stroke-width="2" d="M9 12l2 2 4-4" />
          </svg>
          <!-- Error -->
          <svg v-else-if="alertType === 'error'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <path stroke-width="2" d="M15 9l-6 6M9 9l6 6" />
          </svg>
          <!-- Warning -->
          <svg v-else-if="alertType === 'warning'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <!-- Info -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <path stroke-width="2" d="M12 16h.01M12 8v4" />
          </svg>
        </div>

        <!-- Texto -->
        <div class="text-container">
          <h3 class="title">{{ title }}</h3>
          <p class="message">{{ message }}</p>
        </div>
      </div>

      <!-- Barra de tiempo -->
      <div class="progress-bar">
        <div class="progress-fill" 
             :style="{ animationDuration: autoHide + 'ms' }">
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: "¡Aviso!" },
  message: { type: String, required: true },
  alertType: { type: String, default: "info" }, // success, warning, error, info
  autoHide: { type: Number, default: 3000 }, // 3s
});

const emit = defineEmits(["update:show"]);

let hideTimer: number | null = null;
let remaining = props.autoHide;
let startTime: number;

function close() {
  emit("update:show", false);
  clearTimer();
}

function clearTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function startTimer() {
  clearTimer();
  startTime = Date.now();
  hideTimer = window.setTimeout(close, remaining);
}

function pauseHide() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
    remaining -= Date.now() - startTime; // resta el tiempo transcurrido
  }
}

function resumeHide() {
  if (!hideTimer && props.show) {
    startTime = Date.now();
    hideTimer = window.setTimeout(close, remaining);
  }
}

const alertClass = computed(() => {
  switch (props.alertType) {
    case "success": return "alert-success";
    case "warning": return "alert-warning";
    case "error": return "alert-error";
    default: return "alert-info";
  }
});

watch(() => props.show, (val) => {
  if (val) {
    remaining = props.autoHide; // reinicia contador
    startTimer();
  } else {
    clearTimer();
  }
});

onBeforeUnmount(() => {
  clearTimer();
});
</script>

<style scoped>
.custom-alert {
  position: fixed;
  top: 90px;    /* un poco más abajo para no tapar el menú */
  left: 20px;
  background: #fff;

  width: auto;
  max-width: 280px;
  min-width: 220px;
  
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  padding: 10px 12px;
  z-index: 10000;

  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;

  overflow: hidden;
  word-break: break-word;
}

/* Animación entrada desde izquierda */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.35s ease;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-120%);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-120%);
}

/* Botón cerrar */
.close-btn {
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #999;
  cursor: pointer;
}
.close-btn:hover { color: #333; }

/* Contenido */
.alert-body {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.icon-container {
  flex-shrink: 0;
  color: currentColor;
}
.icon-container svg {
  width: 28px;
  height: 28px;
}

.text-container {
  flex: 1;
}
.title {
  font-weight: 700;
  font-size: 0.9rem;
  margin: 0;
  color: #222;
}
.message {
  font-size: 0.8rem;
  margin: 2px 0 0;
  color: #555;
}

/* Barra de tiempo */
.progress-bar {
  width: 100%;
  height: 3px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px;
}
.progress-fill {
  height: 100%;
  animation: progress linear forwards;
}
.alert-success .progress-fill { background: #28a745; }
.alert-warning .progress-fill { background: #ff9800; }
.alert-error .progress-fill { background: #dc3545; }
.alert-info .progress-fill { background: #17a2b8; }

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

/* Colores dinámicos */
.alert-success { color: #28a745; }
.alert-warning { color: #ff9800; }
.alert-error { color: #dc3545; }
.alert-info { color: #17a2b8; }

/* Pausa animación en hover */
.custom-alert:hover .progress-fill {
  animation-play-state: paused;
}
</style>
