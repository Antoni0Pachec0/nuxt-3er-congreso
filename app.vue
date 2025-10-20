<template>
  <div>
    <component
      :is="isAdmin ? AdminHeader : Header"
      v-if="shouldShowChrome"
    />

    <NuxtPage />

    <Footer v-if="shouldShowChrome && !isAdmin" />

    <Notivue v-slot="item">
      <Notification
        :item="item"
        class="rounded-xl shadow-lg p-4 flex flex-col gap-1"
        :class="{
          'bg-green-600 text-white': item.type === 'success',
          'bg-red-600 text-white': item.type === 'error',
          'bg-yellow-500 text-black': item.type === 'warning',
          'bg-blue-500 text-white animate-pulse': item.type === 'loading',
        }"
      >
        <h3 class="font-bold">{{ item.title || item.type.toUpperCase() }}</h3>
        <p v-if="item.message">{{ item.message }}</p>
      </Notification>
    </Notivue>
  </div>
</template>

<script setup>
import Header from "@/components/layout/header.vue";
import Footer from "@/components/layout/footer.vue";
// Asegúrate de que esta ruta sea correcta
import AdminHeader from "@/components/admin/admin-header.vue"; 
import { Notivue, Notification } from "notivue";

// Importaciones de CSS de Notivue
import "notivue/notifications.css";
import "notivue/animations.css"; // opcional
import "@/assets/css/notifications.css"; // tu hoja de estilos (opcional)

import { useRoute } from "#app"; // Usar '#app' en Nuxt 3 para useRoute
import { computed } from "vue";

const route = useRoute();

/**
 * Lógica de ocultamiento.
 * Mantenemos la lista centralizada de rutas que deben ocultar el Header/Footer (la "chrome").
 * La lista de rutas es más extensa y precisa que la de tu segundo ejemplo.
 */
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

/**
 * Determina si se deben ocultar los elementos de layout (Header/Footer).
 * Se oculta si:
 * 1. La meta de la página tiene `hideChrome: true`
 * 2. El path de la ruta está incluido en la lista HIDE_PATHS
 */
const shouldHideChrome = computed(
  () =>
    route.meta?.hideChrome === true ||
    HIDE_PATHS.has(route.path)
    // Opcional: Podrías añadir la lógica por 'route.name' si lo necesitas, como en tu primer ejemplo
);

// Muestra la "chrome" si no debe estar oculta.
const shouldShowChrome = computed(() => !shouldHideChrome.value);
</script>