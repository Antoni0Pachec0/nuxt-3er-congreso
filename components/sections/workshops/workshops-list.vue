<template>
  <section class="workshops-section" id="workshops">
    <transition name="toast">
      <div
        v-if="toast.show"
        class="toast"
        :class="`toast--${toast.type}`"
        role="status"
        aria-live="polite"
      >
        <strong class="toast-title">{{
          toast.type === "success" ? "¡Listo!" : "Aviso"
        }}</strong>
        <p class="toast-msg">{{ toast.message }}</p>
        <button
          class="toast-close"
          @click="toast.show = false"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </transition>

    <header class="workshop-header">
      <h2 class="workshop-title">Talleres Prácticos</h2>
      <div class="workshop-underline"></div>
      <p class="workshop-subtitle">
        Actividades diseñadas para impulsar la innovación, el aprendizaje y el
        networking entre estudiantes, docentes y profesionales del sector
        tecnológico.
      </p>
    </header>

    <div class="workshop-grid">
      <article
        v-for="w in workshops"
        :key="w.id"
        class="workshop-card"
        :class="levelClass(w)"
      >
        <div class="workshop-card-header" :style="{ background: w.gradient }">
          <div class="workshop-header-top">
            <div class="workshop-header-icon-wrap" :class="levelClass(w)">
              <component :is="w.icon" class="workshop-header-icon" />
            </div>
            <span class="workshop-badge" :class="levelClass(w)">{{
              w.level
            }}</span>
          </div>
          <div class="workshop-header-info">
            <h3 class="workshop-name">{{ w.name }}</h3>
            <p class="workshop-category">{{ w.category }}</p>
          </div>
        </div>

        <div class="workshop-card-body">
          <p class="workshop-desc">{{ w.description }}</p>
          <ul class="workshop-info">
            <li><User class="infoiconw" /> {{ w.instructor }}</li>
            <li><Clock class="infoiconw" /> {{ w.duration }}</li>
            <li><Calendar class="infoiconw" /> {{ w.date }}</li>
            <li><MapPin class="infoiconw" /> {{ w.location }}</li>
          </ul>
          <div class="workshop-tools">
            <span v-for="t in w.tools" :key="t" class="tool">{{ t }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>

  <transition name="fade">
    <div
      v-if="confirm.show"
      class="confirm-backdrop"
      @click.self="closeConfirm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmTitle"
    >
      </div>
  </transition>
</template>

<script setup>
import "@/assets/css/styles/pages/workshops/workshops-list.css";
import { ref } from "vue";
import {
  User,
  Clock,
  Calendar,
  MapPin,
  Code2,
  Cpu,
  Database,
  Smartphone,
  Shield,
  Network,
  Wrench,
  GitBranchPlus,
} from "lucide-vue-next";

// --- State ---
const toast = ref({ show: false, type: "success", message: "" });
const confirm = ref({ show: false, workshop: null });

// --- Computed & Methods ---
const levelClass = (w) => {
  const lvl = (w.level || "").toLowerCase();
  if (lvl.includes("avanz")) return "level-advanced";
  if (lvl.includes("inter")) return "level-intermediate";
  return "level-beginner";
};

// --- Data ---
const workshops = ref([
  {
    id: 1,
    name: "Construcción de un sistema distribuido de pruebas",
    instructor: "Benjamín Guzmán",
    category: "Calidad de Software",
    description:
      "Diseña un sistema para ejecutar pruebas en paralelo, reduciendo tiempos y mejorando la eficiencia del ciclo de desarrollo.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K1",
    level: "Avanzado",
    gradient: "linear-gradient(135deg, #EF4444, #2563EB, #111827)",
    icon: Code2,
    //tools: ["Docker", "RabbitMQ", "Selenium"],
  },
  {
    id: 2,
    name: "Blockchain: más allá de las criptomonedas",
    instructor: "Diana Reynoso e Ing. Irwing Durán",
    category: "Desarrollo Backend",
    description:
      "Explora los fundamentos de blockchain y sus aplicaciones en contratos inteligentes y sistemas distribuidos.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K3",
    level: "Intermedio",
    gradient: "linear-gradient(135deg, #EAB308, #2563EB, #111827)",
    icon: Code2,
   // tools: ["Solidity", "Ethereum", "Truffle"],
  },
  {
    id: 3,
    name: "Como crear un asistente de IA con Ollama",
    instructor: "Adolfo López Mateo",
    category: "Inteligencia Artificial",
    description:
      "Aprende a implementar modelos de lenguaje locales para crear asistentes inteligentes sin depender de la nube.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K11",
    level: "Principiante",
    gradient: "linear-gradient(135deg, #22C55E, #2563EB, #111827)",
    icon: Cpu,
    //tools: ["Ollama", "Python", "LangChain"],
  },
  {
    id: 4,
    name: "Integrando IA en tu primera PWA",
    instructor: "Gustavo Andrade",
    category: "Desarrollo Web",
    description:
      "Combina el poder de las Progressive Web Apps con APIs de IA para crear aplicaciones web inteligentes.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K4",
    level: "Intermedio",
    gradient: "linear-gradient(135deg, #EAB308, #2563EB, #111827)",
    icon: Smartphone,
    //tools: ["Vue.js", "Vite", "OpenAI API"],
  },
  {
    id: 5,
    name: "Reparación de PC y Laptops",
    instructor: "Edgar Bravo",
    category: "Hardware y Soporte",
    description:
      "Diagnostica y soluciona problemas comunes de hardware en equipos de cómputo, desde el ensamblaje hasta el mantenimiento.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K7",
    level: "Principiante",
    gradient: "linear-gradient(135deg, #22C55E, #2563EB, #111827)",
    icon: Wrench,
    //tools: ["Diagnóstico", "Ensamblaje", "Soporte"],
  },
  {
    id: 6,
    name: "Gestión del Ciber Riesgo con IA",
    instructor: "Ivan Rosales",
    category: "Ciberseguridad",
    description:
      "Utiliza herramientas de IA para identificar, evaluar y reducir la superficie de ataque de una organización.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K5",
    level: "Avanzado",
    gradient: "linear-gradient(135deg, #EF4444, #2563EB, #111827)",
    icon: Shield,
    //tools: ["IA", "Análisis", "Pentesting"],
  },
  {
    id: 7,
    name: "Desarrollo de apps móviles con .NET MAUI",
    instructor: "Héctor Reyes Armenta",
    category: "Desarrollo Móvil",
    description:
      "Crea aplicaciones nativas para iOS y Android desde una única base de código con C# y .NET MAUI.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K6",
    level: "Intermedio",
    gradient: "linear-gradient(135deg, #EAB308, #2563EB, #111827)",
    icon: Smartphone,
    //tools: [".NET MAUI", "C#", "XAML"],
  },
  {
    id: 8,
    name: "Arquitectura VRF centralizada",
    instructor: "Ing. Karina Vázquez",
    category: "Redes",
    description:
      "Aprende a diseñar e implementar redes escalables y seguras utilizando Virtual Routing and Forwarding (VRF).",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K9",
    level: "Avanzado",
    gradient: "linear-gradient(135deg, #EF4444, #2563EB, #111827)",
    icon: Network,
    //tools: ["VRF", "Cisco", "BGP"],
  },
{
   id: 9,
   name: "Programación con Clean Architecture",
   instructor: "Natividad Terán",
   category: "Inteligencia Artificial", 
   description:
     "Descubre cómo las librerías de IA permiten interpretar, clasificar y extraer información valiosa de grandes volúmenes de documentos de manera automatizada.",
   duration: "4 horas",
   date: "12 y 13 de noviembre · 14:00 - 18:00",
   location: "Edificio K - Laboratorio K10",
   level: "Avanzado",
   gradient: "linear-gradient(135deg, #EF4444, #2563EB, #111827)",
   icon: GitBranchPlus,
   //tools: ["Python", "NPL", "Scikit-learn"], // Sugerencia de herramientas
 },
  {
    id: 10,
    name: "La forencia en los tiempos académicos",
    instructor: "Nazly Borrero",
    category: "Ciberseguridad",
    description:
      "Analiza técnicas de informática forense aplicadas al entorno académico para la detección y respuesta a incidentes.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K2",
    level: "Intermedio",
    gradient: "linear-gradient(135deg, #EAB308, #2563EB, #111827)",
    icon: Shield,
    //tools: ["Análisis Forense", "OSINT"],
  },
  {
    id: 11,
    name: "Fibra Óptica: Fusión y Pruebas",
    instructor: "Julio Yair Román",
    category: "Redes",
    description:
      "Aprende de forma práctica el proceso de fusión de fibra óptica y la utilización de OTDR para la certificación de enlaces.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio F - Medios Telemáticos",
    level: "Principiante",
    gradient: "linear-gradient(135deg, #22C55E, #2563EB, #111827)",
    icon: Network,
    //tools: ["Fibra Óptica", "OTDR", "Fusión"],
  },
  {
    id: 12,
    name: "Bases de Datos con MongoDB",
    instructor: "Marisol Manica Bronca",
    category: "Bases de Datos",
    description:
      "Introduce los conceptos de bases de datos NoSQL y aprende a modelar, consultar y administrar datos con MongoDB.",
    duration: "4 horas",
    date: "12 y 13 de noviembre · 14:00 - 18:00",
    location: "Edificio K - Laboratorio K12",
    level: "Principiante",
    gradient: "linear-gradient(135deg, #22C55E, #2563EB, #111827)",
    icon: Database,
    //tools: ["MongoDB", "NoSQL", "Compass"],
  },
]);
</script>
