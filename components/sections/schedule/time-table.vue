<template>
  <section class="timetable" id="timetable">
    <header class="tt-header">
      <h2 class="tt-title">Cronograma del Evento</h2>
      <div class="tt-underline"></div>
      <p class="tt-subtitle">
        Cada día reúne actividades diseñadas para impulsar la innovación, el
        aprendizaje y el networking entre estudiantes, docentes y profesionales
        del sector tecnológico.
      </p>

      <div class="tt-tabs" role="tablist" aria-label="Selecciona un día">
        <button
          v-for="d in days"
          :key="d.key"
          class="tt-tab"
          :class="{ active: activeDay === d.key }"
          role="tab"
          :aria-selected="activeDay === d.key"
          @click="activeDay = d.key"
        >
          <span class="tt-tab__label">{{ d.label }}</span>
          <span class="tt-tab__chip">{{ d.chip }}</span>
        </button>
      </div>
    </header>

    <div class="tt-timeline">
      <div class="tt-line" aria-hidden="true"></div>

      <article v-for="ev in items" :key="ev.id" class="tt-card">
        <div class="tt-dot">
          <div class="tt-dot__ring" :data-type="ev.type"></div>
          <div class="tt-dot__icon" :data-type="ev.type">
            <component :is="iconFor(ev.type)" :size="28" />
          </div>
        </div>

        <div class="tt-card__content">
          <div class="tt-card__head">
            <h3 class="tt-card__title">{{ ev.title }}</h3>
            <span class="tt-chip" :data-type="ev.type">{{
              ev.tag || ev.type
            }}</span>
          </div>

          <ul class="tt-meta">
            <li class="tt-meta__item">
              <Clock :size="20" aria-hidden="true" />
              <span>{{ ev.start }} - {{ ev.end }}</span>
            </li>
            <li class="tt-meta__item">
              <MapPin :size="20" aria-hidden="true" />
              <span>{{ ev.location }}</span>
            </li>
            <li v-if="ev.speaker" class="tt-meta__item">
              <UserRound :size="20" aria-hidden="true" />
              <span>{{ ev.speaker }}</span>
            </li>
          </ul>

          <p v-if="ev.description" class="tt-desc">{{ ev.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import "@/assets/css/styles/pages/schedule/time-table.css";
import {
  // meta
  Clock,
  MapPin,
  UserRound,
  // programación / redes
  ClipboardCheck, // registro
  Mic, // conferencia
  Users, // panel
  Coffee, // pausa
  Wrench, // taller
  Network, // networking
  Code2, // hackatón
  Flag, // clausura
  ShoppingBag, // feria
} from "lucide-vue-next";

type EventType =
  | "Registro"
  | "Conferencia"
  | "Pausa"
  | "Taller"
  | "Panel"
  | "Networking"
  | "Hackatón"
  | "Clausura"
  | "Feria";

interface ScheduleItem {
  id: string;
  date: string; // yyyy-mm-dd
  start: string; // HH:mm
  end: string; // HH:mm
  title: string;
  type: EventType;
  location: string;
  speaker?: string;
  description?: string;
  tag?: string;
}

/* Íconos por tipo (burbuja) */
const iconMap: Record<EventType, any> = {
  Registro: ClipboardCheck,
  Conferencia: Mic,
  Panel: Users,
  Pausa: Coffee,
  Taller: Wrench,
  Networking: Network,
  Hackatón: Code2,
  Clausura: Flag,
  Feria: ShoppingBag,
};
const iconFor = (t: EventType) => iconMap[t] ?? Code2;

/* Datos: 12–14 de noviembre de 2025 */
const schedule: Record<string, ScheduleItem[]> = {
  "2025-11-12": [
    {
      id: "d1-01",
      date: "2025-11-12",
      start: "08:00",
      end: "09:00",
      title: "Registro y Bienvenida",
      type: "Registro",
      location: "Lobby Auditorio",
      speaker: "Comité Organizador",
      description: "Acreditación y entrega de gafetes.",
      tag: "Registro",
    },
    {
      id: "d1-02",
      date: "2025-11-12",
      start: "09:00",
      end: "10:30",
      title: "Inteligencia Artificial en el Futuro",
      type: "Conferencia",
      location: "Auditorio Central",
      speaker: "Dra. María González",
      description:
        "Explorando las tendencias emergentes en IA y su impacto en la sociedad.",
      tag: "Conferencia",
    },
    {
      id: "d1-03",
      date: "2025-11-12",
      start: "10:30",
      end: "11:00",
      title: "Pausa para el café",
      type: "Pausa",
      location: "Área de Networking",
      description: "Pausa para networking y refrigeradores",
      tag: "Pausa",
    },
    {
      id: "d1-04",
      date: "2025-11-12",
      start: "11:00",
      end: "12:30",
      title: "Blockchain y Criptomonedas",
      type: "Conferencia",
      location: "Sala Beta",
      speaker: "Ing. Carlos Rodríguez",
      description:
        "Fundamentos y aplicaciones prácticas de la tecnología blockchain.",
      tag: "Conferencia",
    },
  ],
  "2025-11-13": [
    {
      id: "d2-01",
      date: "2025-11-13",
      start: "09:00",
      end: "09:30",
      title: "Apertura del Día 2",
      type: "Conferencia",
      location: "Auditorio Central",
      speaker: "Comité Organizador",
      description: "Agenda y avisos generales.",
      tag: "Apertura",
    },
    {
      id: "d2-02",
      date: "2025-11-13",
      start: "09:30",
      end: "10:30",
      title: "Ciberseguridad en la Nube",
      type: "Conferencia",
      location: "Auditorio Central",
      speaker: "Mtro. Luis Herrera",
      description: "Amenazas y mejores prácticas en cloud.",
      tag: "Conferencia",
    },
    {
      id: "d2-03",
      date: "2025-11-13",
      start: "10:30",
      end: "11:00",
      title: "Coffee break",
      type: "Pausa",
      location: "Área de Networking",
      description: "Descanso y convivencia.",
      tag: "Pausa",
    },
    {
      id: "d2-04",
      date: "2025-11-13",
      start: "11:00",
      end: "12:30",
      title: "Panel: IA Responsable",
      type: "Panel",
      location: "Sala Alfa",
      speaker: "Invitados",
      description: "Ética, sesgos y regulación.",
      tag: "Panel",
    },
    {
      id: "d2-05",
      date: "2025-11-13",
      start: "14:00",
      end: "17:00",
      title: "Taller: AR/VR con WebXR",
      type: "Taller",
      location: "Lab Computación B",
      speaker: "Equipo XR Lab",
      description: "Experiencias inmersivas en web.",
      tag: "Taller",
    },
  ],
  "2025-11-14": [
    {
      id: "d3-01",
      date: "2025-11-14",
      start: "08:30",
      end: "12:30",
      title: "Mini-Hackatón: Soluciones Smart City",
      type: "Hackatón",
      location: "Sala Maker",
      description: "Equipos, retos y prototipos.",
      tag: "Hackatón",
    },
    {
      id: "d3-02",
      date: "2025-11-14",
      start: "12:30",
      end: "13:00",
      title: "Refrigerio",
      type: "Pausa",
      location: "Área de Networking",
      description: "Snack + networking.",
      tag: "Pausa",
    },
    {
      id: "d3-03",
      date: "2025-11-14",
      start: "13:00",
      end: "14:00",
      title: "Data Engineering en Producción",
      type: "Conferencia",
      location: "Sala Beta",
      speaker: "Ing. Sofía Díaz",
      description: "Pipelines, orquestación y calidad.",
      tag: "Conferencia",
    },
    {
      id: "d3-04",
      date: "2025-11-14",
      start: "16:00",
      end: "17:30",
      title: "Cloud-Native: Kubernetes Essentials",
      type: "Conferencia",
      location: "Auditorio Central",
      speaker: "Arq. Daniel Pineda",
      description: "Microservicios, CI/CD y observabilidad.",
      tag: "Conferencia",
    },
  ],
};

const days = [
  { key: "2025-11-12", label: "Miércoles", chip: "12 de Noviembre" },
  { key: "2025-11-13", label: "Jueves", chip: "13 de Noviembre" },
  { key: "2025-11-14", label: "Viernes", chip: "14 de Noviembre" },
];

const activeDay = ref<string>(days[0].key);
const items = computed<ScheduleItem[]>(() =>
  (schedule[activeDay.value] || [])
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
);
</script>

