<template>
  <div>
    <header :class="['app-header', { 'scrolled-header': isScrolled }]">
      <div class="logo">
        <NuxtLink to="/">
          <img
            :src="logoUrl"
            alt="Logo"
            :class="{ 'scrolled-logo': isScrolled }"
          />
        </NuxtLink>
      </div>

      <nav class="desktop-nav">
        <div
          class="menu-item-with-submenu"
          @mouseenter="isSubmenuOpen = true"
          @mouseleave="isSubmenuOpen = false"
        >
          <NuxtLink to="/#Inicio" @click="closeAllMenus">
            Inicio
            <svg
              class="chevron-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m7 10l5 5l5-5z" />
            </svg>
          </NuxtLink>
          <div class="submenu" :class="{ active: isSubmenuOpen }">
            <NuxtLink to="/#Enfoque" @click="closeAllMenus">Enfoque</NuxtLink>
            <NuxtLink to="/#Galeria" @click="closeAllMenus">Galería</NuxtLink>
            <NuxtLink to="/#Ubicacion" @click="closeAllMenus"
              >Ubicación</NuxtLink
            >
            <NuxtLink to="/#PregFrec" @click="closeAllMenus"
              >Preguntas</NuxtLink
            >
          </div>
        </div>

        <NuxtLink to="/schedule" @click="closeAllMenus">Cronograma</NuxtLink>
        <NuxtLink to="/conferees" @click="closeAllMenus"
          >Conferencistas</NuxtLink
        >
        <NuxtLink to="/workshops" @click="closeAllMenus">Talleres</NuxtLink>

        <NuxtLink :to="R.path('register')" class="desktop-nav-btn">
          Registro
        </NuxtLink>
        <NuxtLink :to="R.path('login')" class="desktop-nav-btn login-btn">
          Inicio de Sesión
        </NuxtLink>
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

    <div
      class="overlay"
      :class="{ active: isMenuOpen }"
      @click="closeAllMenus"
    ></div>

    <nav class="sidebar" :class="{ active: isMenuOpen }">
      <button
        class="close-sidebar"
        @click="closeAllMenus"
        aria-label="Cerrar menú"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>


      <NuxtLink to="/#Inicio" @click="closeAllMenus">
        Inicio
        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="m7 10l5 5l5-5z" />
        </svg>
      </NuxtLink>
      <NuxtLink to="/schedule" @click="closeAllMenus">Cronograma</NuxtLink>
      <NuxtLink to="/conferees" @click="closeAllMenus">Conferencistas</NuxtLink>
      <NuxtLink to="/workshops" @click="closeAllMenus">Talleres</NuxtLink>

      <NuxtLink
        :to="R.path('register')"
        class="sidebar_button"
        @click="closeAllMenus"
      >
        Registro
      </NuxtLink>
      <NuxtLink
        :to="R.path('login')"
        class="sidebar_button login-btn-sidebar"
        @click="closeAllMenus"
      >
        Inicio de Sesión
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import logoUrl from "@/assets/img/pages/logo.png";
import "@/assets/css/Header.css";
import { R } from "@/utils/app-routes";

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const isSubmenuOpen = ref(false); // Estado para el submenú

// Cierra ambos menús
const closeAllMenus = () => {
  isMenuOpen.value = false;
  isSubmenuOpen.value = false;
};

// Abre/cierra el menú principal del móvil
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (!isMenuOpen.value) {
    // Si se cierra el menú principal, también cerrar el submenú
    isSubmenuOpen.value = false;
  }
};

// Abre/cierra el submenú (usado principalmente en móvil)
const toggleSubmenu = () => {
  isSubmenuOpen.value = !isSubmenuOpen.value;
};

const handleScroll = () => {
  if (typeof window === "undefined") return;
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  if (typeof window === "undefined") return;
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  if (typeof window === "undefined") return;
  window.removeEventListener("scroll", handleScroll);
});
</script>
