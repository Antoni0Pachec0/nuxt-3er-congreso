<template>
  <div>
    <!-- Header -->
    <Header v-if="shouldShowChrome" />

    <!-- Contenido de la página -->
    <NuxtPage />

    <!-- Notificaciones globales -->
    <Notivue v-slot="item">
      <Notification
        :item="item"
        class="rounded-xl shadow-lg p-4"
        :class="{
          'bg-green-600 text-white': item.type === 'success',
          'bg-red-600 text-white': item.type === 'error',
          'bg-yellow-500 text-black': item.type === 'warning',
          'bg-blue-500 text-white animate-pulse': item.type === 'loading'
        }"
      />
    </Notivue>

    <!-- Footer -->
    <Footer v-if="shouldShowChrome" />
  </div>
</template>

<script setup>
import Header from "@/components/layout/header.vue";
import Footer from "@/components/layout/footer.vue";
import { Notivue, Notification } from "notivue";

// Si prefieres, mueve estos CSS a nuxt.config.ts → css: [...]
import "notivue/notification.css";
import "notivue/animations.css"; // opcional
import "@/assets/css/notifications.css"; // tu hoja de estilos (opcional)

import { useRoute } from "#app";
import { computed } from "vue";

const route = useRoute();

// Ocultar header/footer en estas rutas (por path y por name)
const HIDE_PATHS = new Set([
  "/login",
  "/register",
  "/verify",
  "/forgot",
  "/reset",
  "/user-home",
  "/game/game",
  "/game/leaderboard",
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
]);

// También puedes ocultarlos por meta en cualquier página con: definePageMeta({ hideChrome: true })
const shouldHideChrome = computed(
  () =>
    route.meta?.hideChrome === true ||
    HIDE_PATHS.has(route.path) ||
    HIDE_NAMES.has((route.name ?? "").toString())
);

const shouldShowChrome = computed(() => !shouldHideChrome.value);
</script>
