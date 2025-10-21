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

      <article
        v-for="ev in items"
        :key="ev.id"
        class="tt-card"
        :data-type="ev.type"
      >
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
  | "Feria"
  | "Apertura" 
  | "Convenio" 
  | "Charla" 
  | "Cultural"; 

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
  // <-- AGREGADOS
  Apertura: Flag, // Usar Flag o Mic, por ejemplo.
  Convenio: ClipboardCheck, // Usar ClipboardCheck o un ícono de firma.
  Charla: Mic, // Charla es similar a Conferencia.
  Cultural: Users, // Usar Users o MapPin, por ejemplo.
};
const iconFor = (t: EventType) => iconMap[t] ?? Code2;

/* Datos: 12–14 de noviembre de 2025 */
const schedule: Record<string, ScheduleItem[]> = {
  // --- DÍA 1: MIÉRCOLES 12 DE NOVIEMBRE ---
  "2025-11-12": [
    {
      id: "d1-01",
      date: "2025-11-12",
      start: "08:00",
      end: "09:00",
      title: "Registro de Asistentes",
      type: "Registro",
      location: "Cancha Techada",
      speaker: "Comité Organizador",
      description: "Acreditación y entrega de material de bienvenida.",
      tag: "Registro",
    },
    {
      id: "d1-02",
      date: "2025-11-12",
      start: "09:00",
      end: "09:20",
      title: "Apertura del Evento",
      type: "Apertura",
      location: "Cancha Techada",
      speaker: "Rector",
      description: "Palabras de bienvenida e inauguración oficial del congreso.",
      tag: "Apertura",
    },
    {
      id: "d1-03",
      date: "2025-11-12",
      start: "09:20",
      end: "09:40",
      title: "Firma de Convenio",
      type: "Convenio",
      location: "Cancha Techada",
      speaker: "Autoridades",
      description: "Firma de convenio estratégico interinstitucional.",
      tag: "Convenio",
    },
    {
      id: "d1-04",
      date: "2025-11-12",
      start: "09:40",
      end: "10:30",
      title: "Los juegos del hambre y los 6 Distritos de la Ciberseguridad",
      type: "Conferencia",
      location: "Cancha Techada",
      speaker: "Nazly Borrero",
      description: "Conferencia sobre estrategias, amenazas y alianzas en la defensa tecnológica.",
      tag: "Conferencia",
    },
    {
      id: "d1-05",
      date: "2025-11-12",
      start: "10:30",
      end: "11:00",
      title: "La práctica real del desarrollador de software",
      type: "Charla",
      location: "Cancha Techada",
      speaker: "Benjamín Guzmán",
      description: "Una visión desde la industria sobre el día a día del desarrollo de software.",
      tag: "Charla",
    },
    {
      id: "d1-06",
      date: "2025-11-12",
      start: "11:00",
      end: "11:20",
      title: "Coffee Break y Evento Cultural",
      type: "Pausa",
      location: "Cancha Techada",
      description: "Receso para café, networking y una presentación cultural.",
      tag: "Pausa",
    },
    {
      id: "d1-07",
      date: "2025-11-12",
      start: "11:20",
      end: "12:00",
      title: "Temática en la Inteligencia Artificial",
      type: "Conferencia",
      location: "Cancha Techada",
      speaker: "Miguel Angel Vargas Lomeli",
      description: "Exploración de los temas actuales y futuros en el campo de la IA.",
      tag: "Conferencia",
    },
    {
      id: "d1-08",
      date: "2025-11-12",
      start: "12:00",
      end: "12:30",
      title: "Blockchain y Tecnologías de Privacidad",
      type: "Conferencia",
      location: "Cancha Techada",
      speaker: "Diana Reynoso",
      description: "Un análisis sobre la seguridad y privacidad en la era del blockchain.",
      tag: "Conferencia",
    },
    {
      id: "d1-09",
      date: "2025-11-12",
      start: "12:30",
      end: "13:00",
      title: "Asistentes virtuales con IA local usando Ollama",
      type: "Charla",
      location: "Cancha Techada",
      speaker: "Adolfo Mateos",
      description: "Cómo crear asistentes inteligentes con modelos de IA de código abierto.",
      tag: "Charla",
    },
    {
      id: "d1-10",
      date: "2025-11-12",
      start: "13:00",
      end: "14:00",
      title: "Comida",
      type: "Pausa",
      location: "Área de Comida",
      description: "Espacio para la comida y el descanso.",
      tag: "Pausa",
    },
    {
      id: "d1-11",
      date: "2025-11-12",
      start: "14:00",
      end: "18:00",
      title: "Talleres Simultáneos",
      type: "Taller",
      location: "Edificio K",
      description: "Diversos talleres prácticos en las aulas designadas.",
      tag: "Taller",
    },
  ],
  // --- DÍA 2: JUEVES 13 DE NOVIEMBRE ---
  "2025-11-13": [
    {
      id: "d2-01",
      date: "2025-11-13",
      start: "08:30",
      end: "09:00",
      title: "Registro",
      type: "Registro",
      location: "Cancha Techada",
      description: "Registro para asistentes del segundo día.",
      tag: "Registro",
    },
    {
      id: "d2-02",
      date: "2025-11-13",
      start: "09:00",
      end: "09:50",
      title: "Más allá del título: Resiliencia y aprendizaje continuo",
      type: "Conferencia",
      location: "Cancha Techada",
      speaker: "Benjamín Guzmán (Amazon)",
      description: "Claves para el crecimiento profesional en la industria tecnológica.",
      tag: "Conferencia",
    },
    {
      id: "d2-03",
      date: "2025-11-13",
      start: "09:50",
      end: "10:40",
      title: "La liga de justicia en la Ciberseguridad y sus riesgos míticos",
      type: "Conferencia",
      location: "Cancha Techada",
      speaker: "Nazly Borrero",
      description: "Una analogía sobre los perfiles y amenazas en ciberseguridad.",
      tag: "Conferencia",
    },
    {
      id: "d2-04",
      date: "2025-11-13",
      start: "10:40",
      end: "11:10",
      title: "Coffee Break y Evento Cultural",
      type: "Pausa",
      location: "Cancha Techada",
      description: "Receso para café, networking y una presentación cultural.",
      tag: "Pausa",
    },
    {
      id: "d2-05",
      date: "2025-11-13",
      start: "11:10",
      end: "12:00",
      title: "Alguien fuera de serie",
      type: "Conferencia",
      location: "Cancha Techada",
      speaker: "Zoreyda Jara Ramos",
      description: "Charla sobre innovación y cómo destacar en el ámbito profesional.",
      tag: "Conferencia",
    },
    {
      id: "d2-06",
      date: "2025-11-13",
      start: "12:00",
      end: "12:30",
      title: "PyGame y su poder Arcade",
      type: "Charla",
      location: "Cancha Techada",
      speaker: "Alumnos de IDGS",
      description: "Demostración del potencial de PyGame para el desarrollo de videojuegos.",
      tag: "Charla",
    },
    {
      id: "d2-07",
      date: "2025-11-13",
      start: "12:30",
      end: "13:00",
      title: "Uso de librerías de IA para análisis de archivos",
      type: "Charla",
      location: "Cancha Techada",
      speaker: "Natividad Turán",
      description: "Aplicaciones prácticas de IA para procesar y analizar documentos.",
      tag: "Charla",
    },
    {
      id: "d2-08",
      date: "2025-11-13",
      start: "13:00",
      end: "14:00",
      title: "Comida",
      type: "Pausa",
      location: "Área de Comida",
      description: "Espacio para la comida y el descanso.",
      tag: "Pausa",
    },
    {
      id: "d2-09",
      date: "2025-11-13",
      start: "14:00",
      end: "18:00",
      title: "Talleres Simultáneos",
      type: "Taller",
      location: "Edificio K",
      description: "Segunda sesión de talleres prácticos en diversas áreas.",
      tag: "Taller",
    },
  ],
  // --- DÍA 3: VIERNES 14 DE NOVIEMBRE ---
  "2025-11-14": [
    {
      "id": "d3-01",
      "date": "2025-11-14",
      "start": "08:30",
      "end": "09:00",
      "title": "Registro",
      "type": "Registro",
      "location": "Cancha Techada",
      "description": "Registro para asistentes del último día.",
      "tag": "Registro"
    },
    {
      "id": "d3-02",
      "date": "2025-11-14",
      "start": "09:00",
      "end": "09:30",
      "title": "Blindaje digital: Construyendo la resiliencia de su empresa en la era de la Ciberseguridad y los datos.",
      "type": "Charla",
      "location": "Cancha Techada",
      "speaker": "Nazly Borrero",
      "description": "Charla empresarial 4.",
      "tag": "Charla"
    },
    {
      "id": "d3-03",
      "date": "2025-11-14",
      "start": "09:30",
      "end": "10:30",
      "title": "Conferencia 7",
      "type": "Conferencia",
      "location": "Cancha Techada",
      "speaker": "Ponente de UTTECAM",
      "description": "Por parte de UTTECAM.",
      "tag": "Conferencia"
    },
    {
      "id": "d3-04",
      "date": "2025-11-14",
      "start": "10:30",
      "end": "11:00",
      "title": "Coffee-break y Evento cultural baile moderno",
      "type": "Pausa",
      "location": "Cancha Techada",
      "description": "Receso para café, networking y presentación de Baile Moderno.",
      "tag": "Pausa"
    },
    {
      "id": "d3-05",
      "date": "2025-11-14",
      "start": "11:00",
      "end": "11:30",
      "title": "Ciber Riesgo: Una Variable Estratégica para la Toma de Decisiones.",
      "type": "Charla",
      "location": "Cancha Techada",
      "speaker": "Ing. Iván Rosales",
      "description": "Charla empresarial 5. Speaker: Solutions Architect.",
      "tag": "Charla"
    },
    {
      "id": "d3-06",
      "date": "2025-11-14",
      "start": "11:30",
      "end": "12:00",
      "title": "Conferencia de inteligencia artificial de las cosas (IA embebida)",
      "type": "Charla",
      "location": "Cancha Techada",
      "speaker": "Casimiro Gómez González",
      "description": "Charla empresarial 5.",
      "tag": "Charla"
    },
    {
      "id": "d3-07",
      "date": "2025-11-14",
      "start": "12:00",
      "end": "12:30",
      "title": "Cardano BlockChain Masterclass",
      "type": "Conferencia",
      "location": "Cancha Techada",
      "speaker": "Erick Valadez Hernández",
      "description": "Conferencia 8. Embajador de Cardano en México.",
      "tag": "Conferencia"
    },
    {
      "id": "d3-08",
      "date": "2025-11-14",
      "start": "12:30",
      "end": "13:00",
      "title": "Evento cultural RONDALLA 3",
      "type": "Cultural",
      "location": "Cancha Techada",
      "description": "Presentación cultural de la Rondalla 3.",
      "tag": "Cultural"
    },
    {
      "id": "d3-09",
      "date": "2025-11-14",
      "start": "13:00",
      "end": "13:30",
      "title": "Evento de Cierre",
      "type": "Clausura",
      "location": "Cancha Techada",
      "speaker": "Comité Organizador",
      "description": "Agradecimientos, premiaciones y clausura oficial del congreso.",
      "tag": "Clausura"
    }
  ]

};

const days = [
  { key: "2025-11-12", label: "Miércoles", chip: "12 de Noviembre" },
  { key: "2025-11-13", label: "Jueves", chip: "13 de Noviembre" },
  { key: "2025-11-14", label: "Viernes", chip: "14 de Noviembre" },
];

const activeDay = ref<string>(days[0]?.key ?? '');
const items = computed<ScheduleItem[]>(() =>
  (schedule[activeDay.value] || [])
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
);
</script>
