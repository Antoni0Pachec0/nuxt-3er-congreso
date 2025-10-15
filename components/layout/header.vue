<template>
  <div>
    <header :class="['app-header', { 'scrolled-header': isScrolled }]">
      <div class="logo">
        <!-- Mantener el enlace de ancla para la home/sección de inicio -->
        <a href="#Inicio">
          <img :src="logoUrl" alt="Logo" :class="{ 'scrolled-logo': isScrolled }" />
        </a>
      </div>
      <nav class="desktop-nav">
        <!-- Navegación a secciones internas -->
        <a href="#Inicio" @click="closeMenu">Inicio</a>
        <a href="#Enfoque" @click="closeMenu">Enfoque</a>
        <a href="#Galeria" @click="closeMenu">Galeria</a>
        <a href="#Ubicacion" @click="closeMenu">Ubicacion</a>
        <a href="#Mapa" @click="closeMenu">Mapa</a>
        <a href="#PregFrec" @click="closeMenu">Preguntas</a>
        
        <!-- ✅ CORRECCIÓN: Usar NuxtLink para navegación externa para precarga instantánea -->
        <!-- Uso de R.path('register') para obtener el string del path '/register' -->
        <NuxtLink :to="R.path('register')" class="desktop-nav-btn">
          Registro
        </NuxtLink>
        <NuxtLink :to="R.path('login')" class="desktop-nav-btn login-btn">
          Inicio de Sesión
        </NuxtLink>
      </nav>

      <div class="hamburger-menu" :class="[{ active: isMenuOpen }, { 'scrolled-hamburger': isScrolled }]"
        @click="toggleMenu">
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
      <!-- Navegación interna en Sidebar -->
      <a href="#Inicio" @click="closeMenu">Inicio</a>
      <a href="#Enfoque" @click="closeMenu">Enfoque</a>
      <a href="#Galeria" @click="closeMenu">Galeria</a>
      <a href="#Ubicacion" @click="closeMenu">Ubicacion</a>
      <a href="#Mapa" @click="closeMenu">Mapa</a>
      <a href="#PregFrec" @click="closeMenu">Preguntas</a>
      
      <!-- ✅ CORRECCIÓN: Usar NuxtLink en Sidebar -->
      <NuxtLink :to="R.path('register')" class="sidebar_button" @click="closeMenu">
        Registro
      </NuxtLink>
      <NuxtLink :to="R.path('login')" class="sidebar_button login-btn-sidebar" @click="closeMenu">
        Inicio de Sesión
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// Asegúrate de que logoUrl esté correctamente importado o definido
import logoUrl from '@/assets/img/pages/logo.png' 
import '@/assets/css/header.css'
import { R } from '@/utils/app-routes'
// Ya no necesitamos useRouter/router.push para los enlaces de login/registro
// import { useRouter } from 'vue-router'

// const router = useRouter() // Ya no es necesario
const logo = logoUrl
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const closeMenu = () => { isMenuOpen.value = false }
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }

// ✅ Eliminamos las funciones goToRegister y goToLogin ya que usamos NuxtLink.
// const goToRegister = () => { router.push(R.to('register')); closeMenu() }
// const goToLogin = () => { router.push(R.to('login')); closeMenu() }

const handleScroll = () => {
  if (typeof window === 'undefined') return
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  if (typeof window === 'undefined') return
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', handleScroll)
})
</script>
