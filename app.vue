<template>
  <div>
    <!-- Header / Admin Header -->
    <component
      :is="isAdmin ? AdminHeader : Header"
      v-if="shouldShowChrome"
    />

    <!-- Página actual -->
    <NuxtPage />

    <!-- Footer (oculto en admin y en páginas sin chrome) -->
    <Footer v-if="shouldShowChrome && !isAdmin" />

    <!-- Notivue stream global (sin clases personalizadas para respetar estilos oficiales) -->
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/header.vue'
import Footer from '@/components/layout/footer.vue'
import AdminHeader from '@/components/admin/admin-header.vue'

// Con el módulo `notivue/nuxt` normalmente puedes omitir imports,
// pero si prefieres explícito, descomenta:
// import { Notivue, Notification } from 'notivue'

import { useRoute } from '#app'
import { computed } from 'vue'

const route = useRoute()

// Rutas donde ocultas el “chrome” (header/footer)
const HIDE_PATHS = new Set([
  "/login",
  "/register",
  "/verify",
  "/forgot",
  "/reset",
  "/user-home", // Si esta es la ruta de inicio del usuario, puede que quieras ocultar ahí
  "/game/game",
  "/game/leaderboard",
  "/stripe/checkout",
  "/stripe/success",
]);

const HIDE_NAMES = new Set([
  "login",
  "register",
  "verify",
  "forgot",
  "reset",
  "user-home",
  "game",
  "leaderboard",
  "stripe-checkout",
]);
// Detectar si la ruta actual es una ruta de administración
const isAdmin = computed(() => route.path.startsWith("/admin"));

// ¿Ocultamos chrome?
const shouldHideChrome = computed(() =>
  route.meta?.hideChrome === true || HIDE_PATHS.has(route.path)
)

// Mostrar chrome si NO está oculto
const shouldShowChrome = computed(() => !shouldHideChrome.value)
</script>

<!--
⚠️ IMPORTANTE:
No importes aquí los CSS de Notivue. Ya los cargamos globalmente en `nuxt.config.ts`:
  - notivue/notification.css
  - notivue/animations.css
Cualquier CSS adicional tuyo puede ir en assets globales.
-->
