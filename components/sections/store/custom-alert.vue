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
          <svg v-if="alertType === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path stroke-width="2" d="M9 12l2 2 4-4"/>
          </svg>
          <svg v-else-if="alertType === 'error'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path stroke-width="2" d="M15 9l-6 6M9 9l6 6"/>
          </svg>
          <svg v-else-if="alertType === 'warning'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path stroke-width="2" d="M12 16h.01M12 8v4"/>
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
        <div
          class="progress-fill"
          :style="{ animationDuration: autoHide + 'ms' }"
        ></div>
      </div>
    </div>
  </transition>
</template>


<script setup lang="ts">
import { computed, defineProps, defineEmits, onBeforeUnmount, watch } from "vue";
import "@/assets/css/styles/pages/store/custom-alert.css";

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