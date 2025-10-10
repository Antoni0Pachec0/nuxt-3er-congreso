<template>
  <section class="workshops-section" id="workshops">
    <!-- ✅ TOAST -->
    <transition name="toast">
      <div
        v-if="toast.show"
        class="toast"
        :class="`toast--${toast.type}`"
        role="status"
        aria-live="polite"
      >
        <strong class="toast-title">{{ toast.type === 'success' ? '¡Listo!' : 'Aviso' }}</strong>
        <p class="toast-msg">{{ toast.message }}</p>
        <button class="toast-close" @click="toast.show = false" aria-label="Cerrar">×</button>
      </div>
    </transition>

    <!-- Encabezado -->
    <header class="ws-header">
      <h2 class="ws-title">Talleres Prácticos</h2>
      <div class="ws-underline"></div>
      <p class="ws-subtitle">
        Cada día reúne actividades diseñadas para impulsar la innovación, el
        aprendizaje y el networking entre estudiantes, docentes y profesionales
        del sector tecnológico.
      </p>
    </header>

    <!-- Lista -->
    <div class="ws-grid">
      <article
        v-for="(w, i) in workshops"
        :key="i"
        class="ws-card"
        :class="levelClass(w)"
      >
        <!-- Header -->
        <div class="ws-card-header" :style="{ background: w.gradient }">
          <div class="ws-header-top">
            <div class="ws-header-icon-wrap" :class="levelClass(w)">
              <component :is="w.icon" class="ws-header-icon" />
            </div>
            <span class="ws-badge" :class="levelClass(w)">{{ w.level }}</span>
          </div>
          <div class="ws-header-info">
            <h3 class="ws-name">{{ w.name }}</h3>
            <p class="ws-category">{{ w.category }}</p>
          </div>
        </div>

        <!-- Cuerpo -->
        <div class="ws-card-body">
          <p class="ws-desc">{{ w.description }}</p>

          <ul class="ws-info">
            <li><User class="info-icon" /> {{ w.instructor }}</li>
            <li><Clock class="info-icon" /> {{ w.duration }}</li>
            <li><Calendar class="info-icon" /> {{ w.date }}</li>
            <li><MapPin class="info-icon" /> {{ w.location }}</li>
          </ul>

          <!-- Disponibilidad -->
          <div class="ws-availability">
            <p>
              Cupo disponible:
              <span :class="availabilityClass(w)">
                {{ remainingSlots(w) > 0 ? `${remainingSlots(w)} lugares disponibles` : "Agotado" }}
              </span>
            </p>
            <div class="bar">
              <div
                class="fill"
                :class="availabilityClass(w)"
                :style="{ width: getFillWidth(w) + '%' }"
              ></div>
            </div>
          </div>

          <div class="ws-tools">
            <span v-for="(t, j) in w.tools" :key="j" class="tool">{{ t }}</span>
          </div>

          <!-- Botón (con confirmación) -->
          <button
            class="ws-btn"
            :class="[ levelClass(w), { 'is-full': remainingSlots(w) === 0 } ]"
            :disabled="isButtonDisabled(w)"
            :aria-disabled="isButtonDisabled(w)"
            @click="requestEnroll(w)"
          >
            <User class="btn-icon" />
            <template v-if="remainingSlots(w) === 0">Cupo Lleno</template>
            <template v-else-if="enrolledWorkshopId && enrolledWorkshopId !== w.id">No disponible</template>
            <template v-else-if="enrolledWorkshopId === w.id">Ya inscrito</template>
            <template v-else>Inscribirse al Taller</template>
          </button>
        </div>
      </article>
    </div>
  </section>

  <!-- Modal de confirmación -->
  <transition name="fade">
    <div
      v-if="confirm.show"
      class="confirm-backdrop"
      @click.self="closeConfirm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmTitle"
    >
      <div class="confirm-card">
        <h3 id="confirmTitle" class="confirm-title">Confirmar registro</h3>
        <p class="confirm-text">
          ¿Seguro que quieres registrarte al taller
          <strong v-if="confirm.workshop">"{{ confirm.workshop.name }}"</strong>?
        </p>
        <p class="confirm-note">
          <strong>Después de registrarte ya no podrás inscribirte a otro taller.</strong>
        </p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="closeConfirm">Cancelar</button>
          <button class="btn-confirm" @click="confirmEnroll">Confirmar</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { User, Clock, Calendar, MapPin, Code2, Cpu, PenTool } from "lucide-vue-next";
import "~/assets/css/styles/workshops/WorkshopsList.css";


const MAX_PLACES = 20;

/* ===== Estado: 1 sola inscripción ===== */
const enrolledWorkshopId = ref(null);

/* ===== Toast ===== */
const toast = ref({ show: false, type: "success", message: "" });
function showToast(type, message, ms = 3500) {
  toast.value = { show: true, type, message };
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.value.show = false), ms);
}

/* ===== Confirmación ===== */
const confirm = ref({ show: false, workshop: null });
function requestEnroll(workshop) {
  if (remainingSlots(workshop) === 0) return;

  // Ya inscrito en otro -> aviso
  if (enrolledWorkshopId.value && enrolledWorkshopId.value !== workshop.id) {
    showToast("warning", "Solo puedes inscribirte a un taller.");
    return;
  }

  // Ya inscrito en el mismo
  if (enrolledWorkshopId.value === workshop.id) {
    showToast("warning", "Ya estás inscrito en este taller.");
    return;
  }

  confirm.value = { show: true, workshop };
}
function closeConfirm() {
  confirm.value = { show: false, workshop: null };
}
function onEsc(e) {
  if (e.key === "Escape" && confirm.value.show) closeConfirm();
}
onMounted(() => window.addEventListener("keydown", onEsc));
onBeforeUnmount(() => window.removeEventListener("keydown", onEsc));

/* ✅ Sumar un lugar ocupado (sin pasar de 20) */
function incrementOccupied(id) {
  const idx = workshops.value.findIndex(w => w.id === id);
  if (idx === -1) return;
  const w = workshops.value[idx];
  if (w.occupied >= MAX_PLACES) return; // ya lleno
  w.occupied += 1;
}

/* ✅ Confirmar inscripción: marca inscrito y aumenta ocupados */
function confirmEnroll() {
  const w = confirm.value.workshop;
  if (!w) return;

  // Re-checar cupo por si cambió
  if (remainingSlots(w) === 0) {
    closeConfirm();
    showToast("warning", "Este taller se llenó mientras confirmabas.");
    return;
  }

  // Respetar la regla de 1 taller
  if (enrolledWorkshopId.value && enrolledWorkshopId.value !== w.id) {
    closeConfirm();
    showToast("warning", "Solo puedes inscribirte a un taller.");
    return;
  }

  // Asignar inscripción y aumentar ocupación
  enrolledWorkshopId.value = w.id;
  incrementOccupied(w.id);

  closeConfirm();
  showToast("success", `Inscrito en "${w.name}". Ya no podrás inscribirte en otro taller.`);
  // Opcional: abrir detalles
  // selectedWorkshop.value = w;
}

/* ===== Helpers ===== */
const remainingSlots = (workshop) => Math.max(0, MAX_PLACES - workshop.occupied);
const getFillWidth = (workshop) => Math.min(100, (workshop.occupied / MAX_PLACES) * 100);
const availabilityClass = (workshop) => {
  const remaining = remainingSlots(workshop);
  if (remaining === 0) return "full";
  if (remaining <= 4) return "low";
  if (remaining <= 10) return "medium";
  return "high";
};
const levelClass = (w) => {
  const lvl = (w.level || "").toLowerCase();
  if (lvl.includes("avanz")) return "level-advanced";
  if (lvl.includes("inter")) return "level-intermediate";
  return "level-beginner";
};
const isButtonDisabled = (w) =>
  remainingSlots(w) === 0 || (enrolledWorkshopId.value && enrolledWorkshopId.value !== w.id);

/* ===== 🔁 Workshops REACTIVOS (para que el UI se actualice) ===== */
const workshops = ref([
  {
    id: 1,
    name: "React Avanzado con TypeScript",
    category: "Interfaz",
    description: "Domina conceptos avanzados de React incluyendo hooks personalizados, API de contexto y optimización de rendimiento.",
    instructor: "Ana Martínez",
    duration: "4 horas",
    date: "15 de marzo de 2025 · 14:00 - 18:00",
    location: "Laboratorio A",
    level: "Avanzado",
    gradient: "linear-gradient(135deg, #3b82f6, #ef4444)",
    occupied: 16,
    tools: ["React", "TypeScript", "Vite", "+2"],
    icon: Code2,
  },
  {
    id: 2,
    name: "Aprendizaje Automático con Python",
    category: "IA y ML",
    description: "Aprende los fundamentos del aprendizaje automático y crea tu primer modelo predictivo usando scikit-learn y pandas.",
    instructor: "Dr. Carlos Rodríguez",
    duration: "6 horas",
    date: "16 de marzo de 2025 · 09:00 - 15:00",
    location: "Laboratorio B",
    level: "Intermedio",
    gradient: "linear-gradient(135deg, #fde047, #2563eb)",
    occupied: 1,
    tools: ["Python", "Scikit-learn", "Pandas", "+3"],
    icon: Cpu,
  },
  {
    id: 3,
    name: "Diseño UX/UI Moderno",
    category: "Diseño",
    description: "Descubre los principios del diseño de experiencia de usuario y crea interfaces atractivas y funcionales desde cero.",
    instructor: "Sofía López",
    duration: "5 horas",
    date: "17 de marzo de 2025 · 10:00 - 15:00",
    location: "Estudio de Diseño",
    level: "Principiante",
    gradient: "linear-gradient(135deg, #10b981, #1d4ed8)",
    occupied: 20,
    tools: ["Figma", "Adobe XD", "Bosquejo", "+2"],
    icon: PenTool,
  },
  {
    id: 4,
    name: "Diseño UX/UI Moderno",
    category: "Diseño",
    description: "Descubre los principios del diseño de experiencia de usuario y crea interfaces atractivas y funcionales desde cero.",
    instructor: "Sofía López",
    duration: "5 horas",
    date: "17 de marzo de 2025 · 10:00 - 15:00",
    location: "Estudio de Diseño",
    level: "Principiante",
    gradient: "linear-gradient(135deg, #10b981, #1d4ed8)",
    occupied: 2,
    tools: ["Figma", "Adobe XD", "Bosquejo", "+2"],
    icon: PenTool,
  },
]);

const selectedWorkshop = ref(null);
function closeDetails() { selectedWorkshop.value = null; }
</script>




