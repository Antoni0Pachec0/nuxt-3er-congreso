<template>
  <section class="ws-hero-section">
    <div class="ws-hero-container">
      <!-- Texto -->
      <div class="ws-hero-text">
        <h4 class="ws-hero-subtitle">Talleres Oficiales del Congreso.</h4>
        <h1 class="ws-hero-title">Aprende con los mejores</h1>
        <p class="ws-hero-description">
          Nuestros talleres combinan innovación y práctica en un entorno
          colaborativo, donde aplicarás habilidades y descubrirás nuevas
          herramientas listas para implementar.
        </p>
        <v-btn
          class="ws-hero-btn"
          variant="outlined"
          @click="scrollToSection('workshops')"
        >
          <ArrowDown class="ws-icon" />
          Ver talleres
        </v-btn>
      </div>

      <!-- Imagen -->
      <div class="ws-hero-img-wrapper">
        <img
          src="~/assets/images/workshops/workshops_hero.png"
          alt="Talleres del Congreso"
          class="ws-hero-img"
        />
      </div>
    </div>

    <!-- Ola decorativa -->
    <svg
      class="ws-wave"
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
import "~/assets/css/styles/workshops/HeroWorkshops.css";

const scrollToSection = (id: string) => {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>
