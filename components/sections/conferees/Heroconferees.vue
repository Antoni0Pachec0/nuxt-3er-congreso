<template>
  <section class="hero-alt">
    <div class="hero-container">
      <!-- Texto -->
      <div class="hero-text">
        <h4 class="hero-subtitle">Ponentes Magistrales.</h4>
        <h1 class="hero-title">Voces líderes en innovación</h1>
        <p class="hero-description">
          Descubre a los ponentes que marcarán el rumbo de esta edición. Cada
          charla es una oportunidad para aprender de líderes que están cambiando
          la industria tecnológica.
        </p>
        <v-btn class="hero-btn" variant="outlined">
          <ArrowDown class="icon" />
          Ver ponentes
        </v-btn>
      </div>

      <!-- Imagen -->
      <div class="hero-img-wrapper">
        <img
          src="~/assets/images/conferees/confereens.png"
          alt="Ponentes líderes"
          class="hero-img"
        />
      </div>
    </div>

    <!-- Ola decorativa -->
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
  </section>
</template>
<script setup lang="ts">
import { ArrowDown } from "lucide-vue-next";
</script>

<style scoped>
.hero-alt {
  position: relative;
  background: linear-gradient(135deg, #0b1534, #1d4ed8);
  color: #fff;
  overflow: hidden;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem 6rem;
  display: flex;
  flex-direction: column; /* Móvil por defecto */
  align-items: center;
  text-align: center;
  gap: 2rem;
}

.hero-text {
  flex: 1;
}

.hero-img-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}
.hero-img {
  max-width: 380px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.hero-subtitle {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
}
.hero-description {
  font-size: 1rem;
  max-width: 640px;
  margin: 0 auto 2rem;
  color: rgba(255, 255, 255, 0.9);
}
.hero-btn {
  border-radius: 999px;
  border: 2px solid #ffffff; /* borde blanco */
  background: transparent;
  color: #ffffff; /* texto blanco */
  padding: 1.5rem 2.5rem;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 1rem; /* espacio entre icono y texto */
  transition: all 0.3s ease;
}

.hero-btn .icon {
  width: 24px;
  height: 24px;
  stroke-width: 2.2;
  margin-right: 1rem; 
}

.hero-btn:hover {
  background: #ffffff22; /* fondo suave en hover */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

/* Desktop */
@media (min-width: 768px) {
  .hero-container {
    flex-direction: row; /* Imagen a la derecha, texto a la izquierda */
    text-align: left;
  }
  .hero-text {
    align-self: center;
  }
}
</style>
