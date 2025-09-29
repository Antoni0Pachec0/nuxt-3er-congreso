<template>
  <div>
    <!-- Header solo si NO es login o register -->
    <Header v-if="
      $route.path !== '/login' &&
      $route.path !== '/register' &&
      $route.path !== '/verify' &&
      $route.path !== '/reset' &&
      $route.path !== '/forgot' &&
      $route.path !== '/game'
    " />

    <NuxtPage />
    <Footer v-if="shouldShowFooter" />

    <!-- Contenedor global de notificaciones -->
    <Notivue v-slot="item">
      <Notification
        :item="item"
        class="notification-container"
        :class="{
          'bg-green-600 text-white': item.type === 'success',
          'bg-red-600 text-white': item.type === 'error',
          'bg-yellow-500 text-black': item.type === 'warning',
          'bg-blue-500 text-white animate-pulse': item.type === 'loading'
        }"
      >
        <div class="notification-header">
          <span v-if="item.type === 'error'" class="icon">&#9888;</span>
          <span v-if="item.type === 'success'" class="icon">&#9989;</span>
          <span v-if="item.type === 'warning'" class="icon">&#9889;</span>
          <span v-if="item.type === 'loading'" class="icon">&#x1F504;</span>
          <h3 class="font-bold">{{ item.title }}</h3>
        </div>
        <p v-if="item.message" class="message">{{ item.message }}</p>
      </Notification>
    </Notivue>
    <Footer v-if="
      $route.path !== '/login' &&
      $route.path !== '/register' &&
      $route.path !== '/verify' &&
      $route.path !== '/reset' &&
      $route.path !== '/forgot' &&
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
const hideOn = new Set(['/login', '/register', '/verify', '/forgot', '/reset'])
const shouldShowHeader = computed(() => !hideOn.has(route.path))
const shouldShowFooter = computed(() => !hideOn.has(route.path))


</script>
