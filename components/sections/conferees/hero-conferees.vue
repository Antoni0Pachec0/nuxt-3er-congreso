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
        <v-btn class="hero-btn" variant="outlined" @click="goTo('workshops')">
          <ArrowDown class="icon" />
          Ver ponentes
        </v-btn>
      </div>

      <!-- Imagen -->
      <div class="hero-img-wrapper">
        <img
          src="@/assets/img/pages/conferees/confereens.png"
          alt="Ponentes líderes"
          class="hero-img"
        />
      </div>
      
    </div>
        <svg class="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180" preserveAspectRatio="none"
      aria-hidden="true">
      <path fill="#ffffff" d="M0,150 C220,55 500,100 740,150 C980,185 1220,175 1440,90 L1440,180 L0,180 Z" />
    </svg>
  </section>
  
</template>
<script setup lang="ts">
import { ArrowDown } from "lucide-vue-next";
import '@/assets/css/styles/pages/conferees/hero-conferees.css'
const goTo = (id: string) => {
  
  if (typeof window === 'undefined') return
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>