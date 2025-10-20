<template>
  <div class="activity-flow-container">
    <h2 class="activity-flow-title">Flujo de Actividades</h2>
    <div class="activity-flow-line"></div>

    <div class="activity-flow-wrapper" ref="wrapperRef">
      <svg class="activity-flow-svg-connector">
        <path :d="svgPath" />
      </svg>

      <template v-for="(activity, index) in activities" :key="activity.title">
        <div
          :ref="
            (el) => {
              if (el) cardRefs[index] = el;
            }
          "
          :class="[
            'activity-flow-card',
            index % 2 === 0
              ? 'activity-flow-card--top'
              : 'activity-flow-card--bottom',
          ]"
        >
          <div class="activity-flow-icon-circle">
            <component
              :is="activity.icon"
              class="activity-flow-icon"
              :size="32"
              stroke-width="2"
            />
          </div>
          <h3 class="activity-flow-card-title">{{ activity.title }}</h3>
          <p class="activity-flow-card-description">
            {{ activity.description }}
          </p>
        </div>
      </template>
    </div>

    <NuxtLink
      :to="R.path('schedule')"
      @click="closeAllMenus"
      class="activity-flow-button"
    >
      <Calendar class="button-icon" :size="20" />
      Ver Cronograma Completo
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import {
  ClipboardCheck,
  Presentation,
  Coffee,
  Wrench,
  Calendar,
} from "lucide-vue-next";
import "@/assets/css/styles/pages/activity-flow.css";

// --- Lógica del Componente ---
const activities = ref([
  {
    title: "Registro",
    description: "Acreditación y entrega de materiales.",
    icon: ClipboardCheck,
  },
  {
    title: "Conferencias",
    description: "Sesiones con expertos y su visión.",
    icon: Presentation,
  },
  {
    title: "Pausa / Café",
    description: "Momento de descanso con bocadillos.",
    icon: Coffee,
  },
  {
    title: "Talleres",
    description: "Actividades prácticas para colaborar.",
    icon: Wrench,
  },
]);

// --- Lógica para dibujar el conector SVG ---
const wrapperRef = ref(null); // Ref para el contenedor principal
const cardRefs = ref([]); // Refs para cada una de las tarjetas
const svgPath = ref(""); // Ref para guardar los datos de la línea SVG

// onMounted se asegura de que el código se ejecute después de que el HTML exista
onMounted(() => {
  // nextTick espera a que Vue termine de renderizar todo
  nextTick(() => {
    // Verificamos que tengamos las referencias necesarias
    if (!wrapperRef.value || cardRefs.value.length === 0) return;

    // Obtenemos las coordenadas del centro de cada círculo de ícono
    const points = cardRefs.value.map((card) => {
      const wrapperRect = wrapperRef.value.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      // Calculamos el centro X de la tarjeta, relativo al contenedor
      const x = cardRect.left - wrapperRect.left + cardRect.width / 2;
      // Calculamos el centro Y del ícono (30px es la mitad del alto del círculo)
      const y = cardRect.top - wrapperRect.top + 30;

      return { x, y };
    });

    // Construimos el atributo 'd' para la línea SVG
    // "M x1 y1" mueve el lápiz al primer punto
    // "L x2 y2" dibuja una línea al siguiente punto
    const pathData = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");

    svgPath.value = pathData;
  });
});
</script>
