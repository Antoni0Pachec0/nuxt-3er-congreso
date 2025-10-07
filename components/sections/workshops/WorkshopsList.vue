<template>
  <section class="workshops-section">
    <!-- Encabezado general -->
    <header class="ws-header">
      <h2 class="ws-title">Talleres Prácticos</h2>
      <div class="ws-underline"></div>
      <p class="ws-subtitle">
        Cada día reúne actividades diseñadas para impulsar la innovación, el
        aprendizaje y el networking entre estudiantes, docentes y profesionales
        del sector tecnológico.
      </p>
    </header>

    <!-- Lista de talleres -->
    <div class="ws-grid">
      <article v-for="(w, i) in workshops" :key="i" class="ws-card">
        <!-- Header -->
        <div class="ws-card-header" :style="{ background: w.gradient }">
          <div class="ws-header-top">
            <component :is="w.icon" class="ws-header-icon" />
            <span class="ws-badge">{{ w.level }}</span>
          </div>
          <div class="ws-header-info">
            <h3 class="ws-name">{{ w.name }}</h3>
            <p class="ws-category">{{ w.category }}</p>
          </div>
        </div>

        <!-- Contenido -->
        <div class="ws-card-body">
          <p class="ws-desc">{{ w.description }}</p>

          <ul class="ws-info">
            <li><User class="info-icon" /> {{ w.instructor }}</li>
            <li><Clock class="info-icon" /> {{ w.duration }}</li>
            <li><Calendar class="info-icon" /> {{ w.date }}</li>
            <li><MapPin class="info-icon" /> {{ w.location }}</li>
          </ul>

          <!-- 🔹 Barra de disponibilidad dinámica e invertida -->
          <div class="ws-availability">
            <p>
              Cupo disponible:
              <span :class="availabilityClass(w)">
                {{
                  remainingSlots(w) > 0
                    ? `${remainingSlots(w)} lugares disponibles`
                    : "Agotado"
                }}
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

          <button
            class="ws-btn"
            :disabled="remainingSlots(w) === 0"
            @click="openDetails(w)"
          >
            <User class="btn-icon" />
            {{
              remainingSlots(w) === 0 ? "Cupo Lleno" : "Inscribirse al Taller"
            }}
          </button>
        </div>
      </article>
    </div>
  </section>

  <WorkshopDetails
    :show="selectedWorkshop !== null"
    :workshop="selectedWorkshop"
    @close="closeDetails"
  />
</template>

<script setup>
import {
  User,
  Clock,
  Calendar,
  MapPin,
  Code2,
  Cpu,
  PenTool,
} from "lucide-vue-next";
import WorkshopDetails from "@/components/sections/workshops/WorkshopDetails.vue"; // ✅ correcto

const MAX_PLACES = 20;

const remainingSlots = (workshop) =>
  Math.max(0, MAX_PLACES - workshop.occupied);
const getFillWidth = (workshop) => {
  const filled = (workshop.occupied / MAX_PLACES) * 100;
  return Math.min(100, filled);
};
const availabilityClass = (workshop) => {
  const remaining = remainingSlots(workshop);
  if (remaining === 0) return "full";
  if (remaining <= 4) return "low";
  if (remaining <= 10) return "medium";
  return "high";
};

// Talleres de ejemplo
const workshops = [
  {
    id: 1,
    name: "React Avanzado con TypeScript",
    category: "Interfaz",
    description:
      "Domina conceptos avanzados de React incluyendo hooks personalizados, API de contexto y optimización de rendimiento.",
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
    description:
      "Aprende los fundamentos del aprendizaje automático y crea tu primer modelo predictivo usando scikit-learn y pandas.",
    instructor: "Dr. Carlos Rodríguez",
    duration: "6 horas",
    date: "16 de marzo de 2025 · 09:00 - 15:00",
    location: "Laboratorio B",
    level: "Intermedio",
    gradient: "linear-gradient(135deg, #fde047, #2563eb)",
    occupied: 12,
    tools: ["Python", "Scikit-learn", "Pandas", "+3"],
    icon: Cpu,
  },
  {
    id: 3,
    name: "Diseño UX/UI Moderno",
    category: "Diseño",
    description:
      "Descubre los principios del diseño de experiencia de usuario y crea interfaces atractivas y funcionales desde cero.",
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
];

// ✅ Estado reactivo del modal
const selectedWorkshop = ref(null);

// ✅ Funciones
function openDetails(workshop) {
  selectedWorkshop.value = workshop;
}
function closeDetails() {
  selectedWorkshop.value = null;
}
</script>

<style scoped>
.workshops-section {
  background: #ffffff;
  padding: 5rem 1rem;
  font-family: "Inter", sans-serif;
  color: #111827;
}

/* Header general */
.ws-header {
  text-align: center;
  margin-bottom: 3.5rem;
}
.ws-title {
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 800;
}
.ws-underline {
  width: 100px;
  height: 4px;
  background: #2563eb;
  border-radius: 999px;
  margin: 0.75rem auto;
}
.ws-subtitle {
  color: #475569;
  max-width: 700px;
  margin: 0 auto;
  font-size: 1rem;
}

/* Grid */
.ws-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 2.5rem;
}

/* Card base */
.ws-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.ws-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.15);
}

/* Header del card */
.ws-card-header {
  padding: 1.4rem 1.6rem;
  color: #fff;
}
.ws-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}
.ws-header-icon {
  width: 34px;
  height: 34px;
  color: #fff;
}
.ws-badge {
  font-size: 0.85rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}
.ws-header-info h3 {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}
.ws-header-info p {
  font-size: 0.95rem;
  opacity: 0.9;
}

/* Cuerpo */
.ws-card-body {
  padding: 1.6rem;
}
.ws-desc {
  font-size: 0.95rem;
  color: #334155;
  margin-bottom: 1.1rem;
}

/* Info */
.ws-info {
  list-style: none;
  padding: 0;
  margin: 0 0 1.2rem;
  font-size: 0.9rem;
  color: #475569;
}
.ws-info li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}
.info-icon {
  width: 18px;
  height: 18px;
  color: #2563eb;
}

/* 🔹 Barra de disponibilidad invertida */
.ws-availability {
  margin-bottom: 1.2rem;
}
.ws-availability p {
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}
.ws-availability span {
  font-weight: 600;
}
.ws-availability .high {
  color: #16a34a;
}
.ws-availability .medium {
  color: #facc15;
}
.ws-availability .low {
  color: #ef4444;
}
.ws-availability .full {
  color: #b91c1c;
}
.bar {
  height: 14px;
  width: 100%;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}
.fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.8s ease, background 0.4s ease;
  animation: growWidth 1.5s ease forwards;
}

/* Colores dinámicos (inversos) */
.fill.high {
  background: linear-gradient(90deg, #16a34a, #22c55e);
}
.fill.medium {
  background: linear-gradient(90deg, #facc15, #fbbf24);
}
.fill.low,
.fill.full {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
}

/* Animación */
@keyframes growWidth {
  from {
    width: 0;
  }
}

/* Herramientas */
.ws-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.tool {
  background: #e0e7ff;
  color: #1e3a8a;
  font-size: 0.8rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-weight: 500;
}

/* Botón */
.ws-btn {
  width: 100%;
  border-radius: 999px;
  font-weight: 700;
  color: #fff;
  padding: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: none;
  cursor: pointer;
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  transition: all 0.3s ease;
}
.ws-btn:hover {
  filter: brightness(1.15);
}
.btn-icon {
  width: 20px;
  height: 20px;
}
.disabled-btn {
  background: #9ca3af;
  cursor: not-allowed;
  filter: grayscale(0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .workshops-section {
    padding: 3rem 1rem;
  }
}
</style>
