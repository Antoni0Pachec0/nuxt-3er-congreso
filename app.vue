<template>
  <div>
    <!-- Header solo si NO es login o register -->
    <Header v-if="
      $route.path !== '/login' &&
      $route.path !== '/register' &&
      $route.path !== '/verify' &&
      $route.path !== '/reset' &&
      $route.path !== '/forgot' &&
      $route.path !== '/home' &&
      $route.path !== '/game'

    " />

    <NuxtPage />

    <!-- Notificaciones globales -->
    <Notivue v-slot="item">
      <Notification
        :item="item"
        class="rounded-xl shadow-lg p-4 flex flex-col gap-1"
        :class="{
          'bg-green-600 text-white': item.type === 'success',
          'bg-red-600 text-white': item.type === 'error',
          'bg-yellow-500 text-black': item.type === 'warning',
          'bg-blue-500 text-white animate-pulse': item.type === 'loading'
        }"
      >
        <h3 class="font-bold">{{ item.title }}</h3>
        <p v-if="item.message">{{ item.message }}</p>
      </Notification>
    </Notivue>
    <Footer v-if="
      $route.path !== '/login' &&
      $route.path !== '/register' &&
      $route.path !== '/verify' &&
      $route.path !== '/reset' &&
      $route.path !== '/forgot' &&
      $route.path !== '/home' &&
      $route.path !== '/game'

    " />
  </div>
</template>

<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import { Notivue, Notification } from "notivue";
import 'notivue/notifications.css';
import 'notivue/animations.css';
import '@/assets/css/notifications.css';

import { useRoute } from '#app'
import { computed } from 'vue'

const route = useRoute()

// Ocultar header/footer en estas rutas (por path y por name)
const HIDE_PATHS = new Set([
  '/login',
  '/register',
  '/verify',
  '/forgot',
  '/reset',
  '/user-home',
  '/game/game', 
  '/game/leaderboard'
])

const HIDE_NAMES = new Set([
  'login',
  'register',
  'verify',
  'forgot',
  'reset',
  'user-home',
  'game',
  'leaderboard'
])

// También puedes ocultarlos por meta en cualquier página con: definePageMeta({ hideChrome: true })
const shouldHideChrome = computed(() =>
  route.meta?.hideChrome === true ||
  HIDE_PATHS.has(route.path) ||
  HIDE_NAMES.has((route.name ?? '').toString())
)

const shouldShowChrome = computed(() => !shouldHideChrome.value)
</script>
