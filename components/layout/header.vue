<template>
  <div>
    <header :class="['app-header', { 'scrolled-header': isScrolled }]">
      <div class="logo">
        <NuxtLink :to="R.path('home')">
          <img
            :src="logoUrl"
            alt="Logo"
            :class="{ 'scrolled-logo': isScrolled }"
          />
        </NuxtLink>
      </div>

      <!-- 🌐 NAV DESKTOP -->
      <nav class="desktop-nav">
        <div
          class="menu-item-with-submenu"
          @mouseenter="isSubmenuOpen = true"
          @mouseleave="isSubmenuOpen = false"
        >
          <NuxtLink :to="R.path('home')" @click="closeAllMenus">
            Inicio
            <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="m7 10l5 5l5-5z" />
            </svg>
          </NuxtLink>

          <!-- Submenú -->
          <div class="submenu" :class="{ active: isSubmenuOpen }">
            <NuxtLink :to="`${R.path('home')}#Enfoque`" @click="closeAllMenus">Enfoque</NuxtLink>
            <NuxtLink :to="`${R.path('home')}#Galeria`" @click="closeAllMenus">Galería</NuxtLink>
            <NuxtLink :to="`${R.path('home')}#Ubicacion`" @click="closeAllMenus">Ubicación</NuxtLink>
            <NuxtLink :to="`${R.path('home')}#PregFrec`" @click="closeAllMenus">Preguntas</NuxtLink>
          </div>
        </div>

        <NuxtLink :to="R.path('schedule')" @click="closeAllMenus">Cronograma</NuxtLink>
        <NuxtLink :to="R.path('conferees')" @click="closeAllMenus">Conferencistas</NuxtLink>
        <NuxtLink :to="R.path('workshops')" @click="closeAllMenus">Talleres</NuxtLink>

        <NuxtLink :to="R.path('register')" class="desktop-nav-btn">
          Registro
        </NuxtLink>
        <NuxtLink :to="R.path('login')" class="desktop-nav-btn login-btn">
          Inicio de Sesión
        </NuxtLink>
      </nav>

      <!-- 🍔 Botón hamburguesa -->
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

    <!-- 🔳 Overlay -->
    <div class="overlay" :class="{ active: isMenuOpen }" @click="closeAllMenus"></div>

    <!-- 📱 Sidebar móvil -->
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

      <NuxtLink :to="R.path('home')" @click="closeAllMenus">
        Inicio
        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="m7 10l5 5l5-5z" />
        </svg>
      </NuxtLink>

      <NuxtLink :to="R.path('schedule')" @click="closeAllMenus">Cronograma</NuxtLink>
      <NuxtLink :to="R.path('conferees')" @click="closeAllMenus">Conferencistas</NuxtLink>
      <NuxtLink :to="R.path('workshops')" @click="closeAllMenus">Talleres</NuxtLink>

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
import { R } from "@/utils/app-routes";
import logoUrl from "@/assets/img/pages/logo.png";
import "@/assets/css/header.css";

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const isSubmenuOpen = ref(false);

// 🔒 Cierra ambos menús
const closeAllMenus = () => {
  isMenuOpen.value = false;
  isSubmenuOpen.value = false;
};

// 📱 Alternar menú principal
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (!isMenuOpen.value) isSubmenuOpen.value = false;
};

// 🔄 Detectar scroll
const handleScroll = () => {
  if (typeof window === "undefined") return;
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
