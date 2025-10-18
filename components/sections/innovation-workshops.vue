<template>
  <section class="iw-section fade-in-section">
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

        <!-- Botón (redirige a workshops) -->
        <button class="iw-btn" @click="goWorkshops">
          <Wrench class="iw-btn-icon" />
          Ver Todos los Talleres
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Wrench } from "lucide-vue-next";
import { R } from "@/utils/app-routes";

import aws from "@/assets/img/pages/innovation-workshops/aws.webp";
import git from "@/assets/img/pages/innovation-workshops/git.webp";
import react from "@/assets/img/pages/innovation-workshops/react.webp";
import figma from "@/assets/img/pages/innovation-workshops/figma.webp";
import python from "@/assets/img/pages/innovation-workshops/python.webp";
import vscode from "@/assets/img/pages/innovation-workshops/vscode.webp";
import node from "@/assets/img/pages/innovation-workshops/node.webp";
import firebase from "@/assets/img/pages/innovation-workshops/firebase.webp";

import "@/assets/css/styles/innovation-workshops.css";

const icons = [aws, git, react, figma, python, vscode, node, firebase];
const activeIndex = ref(2);
const router = useRouter();

// 🔁 Animación de íconos
onMounted(() => {
  setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % icons.length;
  }, 3000);
});

// 🔗 Redirigir a la ruta de talleres
const goWorkshops = () => {
  router.push(R.to("workshops"));
};
</script>
