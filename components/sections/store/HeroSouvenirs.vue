<template>
  <div class="hero">
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
        <button class="hero-btn" @click="goProducts">
          <span class="icon">🛒</span> Ver productos
        </button>
      </div>
    </div>

    <!-- Imagen decorativa detrás de la ola -->
    <div class="bg-graphic">
      <img
        src="~/assets/images/store/heroStore.png"
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
import "/assets/css/styles/store/HeroSouvenirs.css";
</script>
