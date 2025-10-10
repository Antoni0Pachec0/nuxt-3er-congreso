<template>
  <header class="admin-header">
    <!-- Branding -->
    <div class="header-branding">
      <div class="logo-placeholder">
        <img src="~/assets/images/Logo.webp" alt="Logo" class="logo-icon" />
      </div>
      <div class="titles">
        <h1 class="main-title">3er. Congreso Internacional 2025</h1>
        <p class="subtitle_Header">Panel de Administración</p>
      </div>
    </div>

    <!-- Navegación -->
    <nav class="header-nav">
      <NuxtLink to="/admin/users" class="nav-item" exact-active-class="active">
        <SvgIcon type="mdi" :path="mdiAccountGroup" class="icon" />
        <span class="nav-text">Usuarios</span>
      </NuxtLink>

      <NuxtLink to="/admin/badges" class="nav-item" active-class="active">
        <SvgIcon type="mdi" :path="mdiCardAccountDetails" class="icon" />
        <span class="nav-text">Gafetes</span>
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup>
import { onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router"; // 👈 para detectar cambios de ruta
import '~/assets/css/style_admin/AdminHeader.css'
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiAccountGroup,
  mdiCardAccountDetails
} from '@mdi/js'

const route = useRoute(); // 👈 obtenemos la ruta actual

// mover highlight según el botón activo
function moveHighlight() {
  nextTick(() => {
    const active = document.querySelector(".nav-item.active");
    const nav = document.querySelector(".header-nav");

    if (active && nav) {
      const rect = active.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      let hl = document.getElementById("nav-highlight");
      if (!hl) {
        hl = document.createElement("div");
        hl.id = "nav-highlight";
        hl.style.position = "absolute";
        hl.style.top = "0";
        hl.style.bottom = "0";
        hl.style.borderRadius = "8px";
        hl.style.background = "rgba(255,255,255,0.15)";
        hl.style.transition = "all 0.35s ease";
        nav.appendChild(hl);
      }

      // 👇 se mueve con transición
      hl.style.left = rect.left - navRect.left + "px";
      hl.style.width = rect.width + "px";
    }
  });
}

// inicializa cuando carga
onMounted(() => {
  moveHighlight();
  window.addEventListener("resize", moveHighlight);
});

// 👀 cada vez que cambie la ruta, se vuelve a mover
watch(
  () => route.fullPath,
  () => moveHighlight()
);
</script>
