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
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" class="wave">
      <path
        d="M0,224 L60,212 C120,200 240,176 360,176 
           C480,176 600,200 720,200 
           C840,200 960,176 1080,170 
           C1200,164 1320,176 1380,184 
           L1440,192 L1440,320 L0,320 Z"
        fill="#ffffff"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import "/assets/css/styles/store/HeroSouvenirs.css";

</script>
