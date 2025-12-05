<template>
  <div class="heroSouvenirs">
    <!-- Contenedor Principal -->
    <div class="hero-inner">
      <!-- Texto del Hero -->
      <div class="hero-text">
        <p class="hero-subtitle">Souvenirs oficiales</p>
        <h1 class="hero-title">Innovación que trasciende</h1>
        <p class="hero-description">
          Playeras, termos y accesorios del Congreso de TI. Un detalle para
          recordar la experiencia más allá del evento.
        </p>
        <v-btn class="hero-btn" variant="outlined" @click="goTo('productos')">
          <ArrowDown class="icon" />
          Ver productos
        </v-btn>
      </div>
    </div>

    <!-- Imagen decorativa detrás de la ola -->
    <div class="bg-graphic">
      <img
        src="@/assets/img/pages/store/hero-store.png"
        alt="Decoración"
        class="bg-img"
        loading="eager"
      />
    </div>

    <!-- Ola en la parte inferior -->
    <svg
      class="wave"
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
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from "lucide-vue-next";
import "@/assets/css/styles/pages/store/hero-souvenirs.css";

const goTo = (id: string) => {
  if (typeof window === 'undefined') return
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>