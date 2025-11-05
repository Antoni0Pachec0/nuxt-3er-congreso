<!-- components/layout/header.vue -->
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

        <!-- 🔁 Condicional por sesión -->
        <template v-if="isAuthenticated">
          <NuxtLink :to="R.path('game')" class="desktop-nav-btn">Game</NuxtLink>

          <NuxtLink
            v-if="authStore.userRole === 5"
            to="/admin/users"
            class="desktop-nav-btn"
          >
            Admin
          </NuxtLink>

          <button class="desktop-nav-btn login-btn" @click="onLogout">
            Cerrar sesión
          </button>
        </template>

        <template v-else>
          <NuxtLink :to="R.path('register')" class="desktop-nav-btn" @click="closeAllMenus">
            Registro
          </NuxtLink>
          <NuxtLink :to="R.path('login')" class="desktop-nav-btn login-btn" @click="closeAllMenus">
            Inicio de Sesión
          </NuxtLink>
        </template>
      </nav>

      <!-- 🍔 Botón hamburguesa -->
      <div
        class="hamburger-menu"
        :class="[{ active: isMenuOpen }, { 'scrolled-hamburger': isScrolled }]"
        @click="toggleMenu"
        aria-label="Abrir menú"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        aria-controls="mobile-sidebar"
      >
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </header>

    <!-- 🔳 Overlay -->
    <div class="overlay" :class="{ active: isMenuOpen }" @click="closeAllMenus"></div>

    <!-- 📱 Sidebar móvil -->
    <nav id="mobile-sidebar" class="sidebar" :class="{ active: isMenuOpen }" role="dialog" aria-modal="true" aria-label="Menú">
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

      <!-- 📱 Acciones auth en móvil -->
      <template v-if="isAuthenticated">
        <NuxtLink :to="R.path('game')" class="sidebar_button" @click="closeAllMenus">
          Game
        </NuxtLink>
        <NuxtLink
          v-if="authStore.userRole === 5"
          to="/admin/users"
          class="sidebar_button"
          @click="closeAllMenus"
        >
          Admin
        </NuxtLink>
        <button class="sidebar_button login-btn-sidebar" @click="onLogoutFromMenu">
          Cerrar sesión
        </button>
      </template>

      <template v-else>
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
      </template>
    </nav>
  </div>
</template>

<!-- components/layout/header.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from '#app'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/security/stores/auth'
import { R } from '@/utils/app-routes'
import logoUrl from '@/assets/img/pages/logo.png'
import '@/assets/css/header.css'

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isSubmenuOpen = ref(false)

const router = useRouter()

// ---- UTIL: scroll lock centralizado
const setScrollLock = (lock) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('no-scroll', !!lock)
  document.body.classList.toggle('no-scroll', !!lock)
}

// Detectar scroll (añade/quita fondo del header)
const handleScroll = () => {
  if (typeof window === 'undefined') return
  isScrolled.value = window.scrollY > 50
}

// 📱 Alternar menú principal
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (!isMenuOpen.value) isSubmenuOpen.value = false
  setScrollLock(isMenuOpen.value)
}

// 🔒 Cerrar todo y liberar scroll
const closeAllMenus = () => {
  isMenuOpen.value = false
  isSubmenuOpen.value = false
  setScrollLock(false)
}

// ---- “Hardening”: desbloqueos defensivos
// 1) Al montar
onMounted(() => {
  // Si por algún motivo quedó bloqueado de un render previo, libera:
  setScrollLock(false)
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 2) Cerrar + liberar al cambiar de viewport a desktop
  const onResize = () => {
    if (window.innerWidth >= 769 && isMenuOpen.value) {
      closeAllMenus()
    }
  }
  window.addEventListener('resize', onResize, { passive: true })

  // 3) Cerrar + liberar con ESC
  const onKey = (e) => {
    if (e.key === 'Escape' && isMenuOpen.value) closeAllMenus()
  }
  window.addEventListener('keydown', onKey)

  // 4) Cerrar + liberar al navegar a otra ruta
  const offAfter = router.afterEach(() => {
    if (isMenuOpen.value) closeAllMenus()
  })

  // Guarda limpiadores en cierre
  cleanupFns.push(() => window.removeEventListener('resize', onResize))
  cleanupFns.push(() => window.removeEventListener('keydown', onKey))
  cleanupFns.push(() => offAfter())
})

const cleanupFns = []
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  cleanupFns.forEach(fn => { try { fn() } catch {} })
  // Limpieza final defensiva
  setScrollLock(false)
})

// ---- Auth
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

onMounted(() => {
  if (!authStore.isAuthenticated) authStore.loadFromStorage()
})

// ---- Navegaciones que cierran menú SIEMPRE
const goAndClose = (to) => {
  closeAllMenus()
  return navigateTo(to)
}

// Logout (desktop)
const onLogout = async () => {
  await authStore.logout()
  closeAllMenus()
  navigateTo(R.path('home'))
}

// Logout (móvil)
const onLogoutFromMenu = async () => {
  await authStore.logout()
  closeAllMenus()
  navigateTo(R.path('home'))
}
</script>
