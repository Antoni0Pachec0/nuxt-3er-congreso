<template>
  <div class="activity-flow-container">
    
    <h2 class="activity-flow-title">Flujo de Actividades</h2>
    <div class="activity-flow-line"></div>

    <div class="activity-flow-wrapper">
      <template v-for="(activity, index) in activities" :key="activity.title">
        
        <div 
          :class="[
            'activity-flow-card', 
            index % 2 === 0 ? 'activity-flow-card--top' : 'activity-flow-card--bottom'
          ]"
        >
          <div class="activity-flow-icon-circle">
            <img 
              :src="getIconUrl(activity.icon)" 
              :alt="'Icono de ' + activity.title"
              class="activity-flow-icon"
            > 
          </div>
          <h3 class="activity-flow-card-title">{{ activity.title }}</h3>
          <p class="activity-flow-card-description">{{ activity.description }}</p>
        </div>
        
        <div 
          v-if="index < activities.length - 1" 
          :class="['activity-flow-connector', `activity-flow-connector--${index + 1}`]">
        </div>

      </template>
    </div>

    <button class="activity-flow-button">Ver Cronograma Completo</button>
  </div>
</template>

<script setup>
import '@/assets/css/styles/pages/activity-flow.css';
import { ref } from 'vue';

const activities = ref([
  {
    title: 'Registro',
    description: 'Acreditación de participantes y entrega de materiales.',
    icon: 'icon-registro.png'
  },
  {
    title: 'Conferencias',
    description: 'Sesiones con expertos compartiendo su conocimiento y visión.',
    icon: 'icon-conferencias.png'
  },
  {
    title: 'Pausa / Café',
    description: 'Momento de descanso con bocadillos y bebida.',
    icon: 'icon-pausa.png'
  },
  {
    title: 'Talleres',
    description: 'Actividades prácticas para desarrollar habilidades y colaborar.',
    icon: 'icon-talleres.png'
  }
]);

const getIconUrl = (name) => {
  return new URL(`../assets/icons/${name}`, import.meta.url).href;
};
</script>