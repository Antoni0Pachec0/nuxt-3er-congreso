<template>
  <section class="sc-hero-section">
    <div class="sc-hero-container">
      <!-- Texto -->
      <div class="sc-hero-text">
        <h4 class="sc-hero-subtitle">Agenda Oficial del Congreso TI.</h4>
        <h1 class="sc-hero-title">Tu guía hacia la innovación</h1>
        <p class="sc-hero-description">
          Descubre la agenda completa de conferencias, talleres y actividades
          que se llevarán a cabo durante los tres días del evento. Planifica tu
          tiempo y aprovecha al máximo cada momento de innovación y aprendizaje.
        </p>
        <v-btn
          class="sc-hero-btn"
          variant="outlined"
          @click="scrollToSection('timetable')"
        >
          <ArrowDown class="sc-icon" />
          Ver cronograma
        </v-btn>
      </div>

      <!-- Imagen -->
      <div class="sc-hero-img-wrapper">
        <img
          src="@/assets/img/pages/schedule/schedule-hero.png"
          alt="Cronograma del Congreso"
          class="sc-hero-img"
        />
      </div>
    </div>

    <!-- Ola decorativa -->
    <svg
      class="sc-wave"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 180"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill="#ffffff"
        d="M0,150 C220,55 500,100 740,150 C980,185 1220,175 1440,90 L1440,180 L0,180 Z"
      />
    </svg>
  </section>
</template>

<script setup lang="ts">
import { ArrowDown } from "lucide-vue-next";
import "@/assets/css/styles/pages/schedule/schedule-hero.css";

const scrollToSection = (id: string) => {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>
