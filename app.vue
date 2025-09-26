<template>
  <div>
    <!-- Header solo si NO es login o register -->
    <Header v-if="
      $route.path !== '/login' &&
      $route.path !== '/register' &&
      $route.path !== '/verify' &&
      $route.path !== '/game'
    " />

    <NuxtPage />

    
    <!-- Contenedor global de notificaciones -->
    <Notivue v-slot="item">
      <Notification :item="item" class="rounded-xl shadow-lg p-4 flex flex-col gap-1" :class="{
        'bg-green-600 text-white': item.type === 'success',
        'bg-red-600 text-white': item.type === 'error',
        'bg-yellow-500 text-black': item.type === 'warning',
        'bg-blue-500 text-white animate-pulse': item.type === 'loading'
      }">
        <!-- Plantilla personalizada -->
        <h3 class="font-bold">{{ item.title }}</h3>
        <p v-if="item.message">{{ item.message }}</p>
      </Notification>
    </Notivue>
    <Footer v-if="
      $route.path !== '/login' &&
      $route.path !== '/register' &&
      $route.path !== '/verify' &&
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
import '@/assets/css/notifications.css'; // Tu archivo de estilos personalizados

import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const hideOn = new Set(['/login', '/register', '/verify'])
const shouldShowHeader = computed(() => !hideOn.has(route.path))
const shouldShowFooter = computed(() => !hideOn.has(route.path))


</script>
