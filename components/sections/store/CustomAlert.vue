<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: "¡Aviso!" },
  message: { type: String, required: true },
  alertType: { type: String, default: "info" }, // success, warning, error, info
  autoHide: { type: Number, default: 2500 },
});

const emit = defineEmits(["update:show"]);

let hideTimer: number | null = null;

// Cierra la alerta
function close() {
  emit("update:show", false);
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

// Muestra la alerta y configura auto-hide
function showAlert() {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = window.setTimeout(close, props.autoHide);
}

// Pausar auto-hide al pasar el cursor
function pauseHide() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

// Reanudar auto-hide
function resumeHide() {
  if (!hideTimer) hideTimer = window.setTimeout(close, props.autoHide);
}

// Computed para clase según tipo
const alertClass = computed(() => {
  switch (props.alertType) {
    case "success": return "alert-success";
    case "warning": return "alert-warning";
    case "error": return "alert-error";
    default: return "alert-info";
  }
});

// Cuando la propiedad show cambia a true, iniciamos el timer
onMounted(() => {
  if (props.show) showAlert();
});

// Limpiar timer al desmontar
onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer);
});
</script>


<style scoped>
.custom-alert {
  position: fixed;
  top: 50%; /* centrado vertical */
  transform: translateY(-50%);
  left: 20px; /* lado izquierdo */
  max-width: 360px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  color: #fff;
  z-index: 10000;
  transition: all 0.3s ease;
}

/* Tipos de alerta */
.alert-success { background-color: #28a745; }
.alert-warning { background-color: #ffc107; color: #1a1a1a; }
.alert-error { background-color: #dc3545; }
.alert-info { background-color: #17a2b8; }

/* Icono */
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.2);
}
.icon {
  width: 20px;
  height: 20px;
}

/* Contenido */
.content {
  flex: 1;
}
.title { font-weight: 700; font-size: 0.95rem; margin: 0; }
.message { font-size: 0.85rem; margin: 0; line-height: 1.2; }

/* Botón cerrar */
.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
}

/* Animación */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive */
@media (max-width: 600px) {
  .custom-alert {
    top: 55%;
    left: 10px;
    max-width: 90%;
    gap: 8px;
    padding: 10px 12px;
  }
  .title { font-size: 0.9rem; }
  .message { font-size: 0.8rem; }
}
</style>
