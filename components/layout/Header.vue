<template>
  <div>
    <header :class="['app-header', { 'scrolled-header': isScrolled }]">
      <div class="logo">
        <img :src="Logo" alt="Logo" :class="{ 'scrolled-logo': isScrolled }" />
      </div>

            <nav class="desktop-nav">
            <a href="#Inicio" @click="closeMenu">Inicio</a>
            <a href="#Enfoque" @click="closeMenu">Enfoque</a>
            <a href="#Galeria" @click="closeMenu">Galeria</a>
            <a href="#Ubicacion" @click="closeMenu">Ubicacion</a>
            <a href="#Mapa" @click="closeMenu">Mapa</a>
            <a href="#PregFrec" @click="closeMenu">Preguntas</a>
<!-- <button @click="closeMenu" class="sidebar_button">Registro</button>
            <button @click="closeMenu" class="sidebar_button">Inicio de Sesión</button> -->
            </nav>

      <div
        class="hamburger-menu"
        :class="[{ active: isMenuOpen }, { 'scrolled-hamburger': isScrolled }]"
        @click="toggleMenu"
      >
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </header>

    <div class="overlay" :class="{ active: isMenuOpen }" @click="closeMenu"></div>

        <nav class="sidebar" :class="{ active: isMenuOpen }">
            <button class="close-sidebar" @click="closeMenu" aria-label="Cerrar menú">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            <a href="#Inicio" @click="closeMenu">Inicio</a>
            <a href="#Enfoque" @click="closeMenu">Enfoque</a>
            <a href="#Galeria" @click="closeMenu">Galeria</a>
            <a href="#Ubicacion" @click="closeMenu">Ubicacion</a>
            <a href="#Mapa" @click="closeMenu">Mapa</a>
            <a href="#PregFrec" @click="closeMenu">Preguntas</a>
            <!-- <button @click="closeMenu" class="sidebar_button">Registro</button>
            <button @click="closeMenu" class="sidebar_button">Inicio de Sesión</button> -->
        </nav>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import logo from '@/assets/images/Logo.png';
import '@/assets/css/styles/Header.css';

const Logo = logo
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const closeMenu = () => { isMenuOpen.value = false }
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

const handleScroll = () => {
  if (typeof window === 'undefined') return
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  if (typeof window === 'undefined') return
  handleScroll() // set estado inicial
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', handleScroll)
})
</script>
