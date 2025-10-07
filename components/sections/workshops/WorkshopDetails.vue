<template>
  <transition name="fade">
    <div v-if="show && workshop" class="overlay">
      <div class="register-card">
        <!-- Header -->
        <header class="card-header" :style="{ background: workshop.gradient }">
          <h2 class="card-title">{{ workshop.name }}</h2>
          <button class="close-btn" @click="close">✖</button>
        </header>

        <!-- Contenido -->
        <section class="card-body">
          <p><strong>Categoría:</strong> {{ workshop.category }}</p>
          <p><strong>Tallerista:</strong> {{ workshop.instructor }}</p>
          <p><strong>Duración:</strong> {{ workshop.duration }}</p>
          <p><strong>Fecha:</strong> {{ workshop.date }}</p>
          <p><strong>Ubicación:</strong> {{ workshop.location }}</p>
          <p><strong>Descripción:</strong></p>
          <p class="desc">{{ workshop.description }}</p>

          <!-- Alerta -->
          <div class="alert-warning">
            ⚠️ Solo puedes inscribirte a <strong>un taller</strong>. Una vez
            registrado, <strong>no podrás cambiarlo</strong>.
          </div>
        </section>

        <!-- Footer -->
        <footer class="card-footer">
          <button
            class="btn-register"
            :disabled="isRegistered"
            @click="register"
          >
            <span v-if="isRegistered">Ya estás inscrito</span>
            <span v-else>Confirmar inscripción</span>
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Props
const props = defineProps({
  show: Boolean,
  workshop: Object,
});
const emits = defineEmits(["close", "registered"]);

const isRegistered = ref(false);

function close() {
  emits("close");
}

/**
 * Simula registro y muestra alerta
 */
function register() {
  if (isRegistered.value) return;
  alert(
    "✅ Inscripción completada.\n⚠️ Recuerda: Solo puedes estar en un taller y no se puede cambiar después."
  );
  isRegistered.value = true;
  emits("registered");
}
</script>

<style scoped>
/* Fondo oscuro */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

/* Card */
.register-card {
  background: #fff;
  border-radius: 18px;
  width: 520px;
  max-width: 95%;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  font-family: "Sora", sans-serif;
}

/* Header */
.card-header {
  color: #fff;
  padding: 1.2rem 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-title {
  font-size: 1.4rem;
  font-weight: 800;
}
.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
}

/* Body */
.card-body {
  padding: 1.6rem;
}
.card-body p {
  margin-bottom: 6px;
  color: #333;
}
.desc {
  color: #555;
  line-height: 1.5;
  margin-top: 10px;
}

/* Alerta */
.alert-warning {
  background: #fff4e5;
  color: #92400e;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.92rem;
  margin-top: 16px;
  font-weight: 500;
}

/* Footer */
.card-footer {
  padding: 1.2rem 1.6rem;
  border-top: 1px solid #eee;
}
.btn-register {
  background: #1e66ff;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
}
.btn-register:hover {
  background: #10308b;
}
.btn-register:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Transición */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
