<template>
  <section class="iw-section">
    <!-- 🔵 círculo inferior derecho -->
    <div class="iw-circle-bottom"></div>

    <div class="iw-container">
      <!-- Íconos -->
      <div class="iw-icons-layout">
        <div
          v-for="(icon, i) in icons"
          :key="i"
          class="iw-icon"
          :class="{ active: i === activeIndex }"
        >
          <img :src="icon" :alt="'Icon ' + i" />
        </div>
      </div>

      <!-- Texto -->
      <div class="iw-text">
        <h2 class="iw-title">Talleres de Innovación</h2>
        <div class="iw-underline"></div>
        <p class="iw-desc">
          Participa en talleres prácticos donde podrás desarrollar nuevas
          habilidades y aplicar tecnologías de vanguardia. Aprende de expertos
          en un entorno interactivo y colaborativo, ideal para potenciar tu
          conocimiento y crecer profesionalmente.
        </p>

        <!-- Botón -->
        <button class="iw-btn" @click="showModal = true">
          <Wrench class="iw-btn-icon" />
          Ver Todos los Talleres
        </button>
      </div>
    </div>

    <!-- 🌙 Modal “Próximamente” -->
    <div v-if="showModal" class="iw-modal-overlay" @click.self="closeModal">
      <div class="iw-modal-content">
        <button class="iw-modal-close" @click="closeModal">&times;</button>
        <h2>Próximamente</h2>
        <p>
          La lista completa de talleres estará disponible muy pronto.<br />
          ¡Mantente atento a las novedades del Congreso!
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Wrench } from "lucide-vue-next";

import aws from "~/assets/images/InnovationWorkshops/aws.png";
import git from "~/assets/images/InnovationWorkshops/git.png";
import react from "~/assets/images/InnovationWorkshops/react.png";
import figma from "~/assets/images/InnovationWorkshops/figma.png";
import python from "~/assets/images/InnovationWorkshops/python.png";
import vscode from "~/assets/images/InnovationWorkshops/vscode.png";
import node from "~/assets/images/InnovationWorkshops/nojs.png";
import firebase from "~/assets/images/InnovationWorkshops/firebase.png";

import "@/assets/css/styles/InnovationWorkshops.css";

const icons = [aws, git, react, figma, python, vscode, node, firebase];
const activeIndex = ref(2);
const showModal = ref(false);

// 🔁 Animación de íconos
onMounted(() => {
  setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % icons.length;
  }, 3000);
});

const closeModal = () => {
  showModal.value = false;
};
</script>
