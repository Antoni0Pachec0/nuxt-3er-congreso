<template>
  <div>
    <!-- Header dinámico -->
    <component
      :is="isAdmin ? AdminHeader : Header"
      v-if="shouldShowHeader"
    />

    <NuxtPage />

    <!-- Footer solo si NO es admin y la ruta no está en la lista -->
    <Footer v-if="shouldShowFooter && !isAdmin" />

    <!-- Contenedor global de notificaciones -->
    <Notivue v-slot="item">
      <Notification :item="item" class="rounded-xl shadow-lg p-4 flex flex-col gap-1" :class="{
        'bg-green-600 text-white': item.type === 'success',
        'bg-red-600 text-white': item.type === 'error',
        'bg-yellow-500 text-black': item.type === 'warning',
        'bg-blue-500 text-white animate-pulse': item.type === 'loading'
      }">
        <h3 class="font-bold">{{ item.title }}</h3>
        <p v-if="item.message">{{ item.message }}</p>
      </Notification>
    </Notivue>
  </div>
</template>

<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
import { Notivue, Notification } from "notivue";
import 'notivue/notifications.css';
import 'notivue/animations.css';
import '@/assets/css/notifications.css';

import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Rutas donde no se deben mostrar header/footer
const hideOn = new Set(['/login', '/register', '/verify', '/forgot', '/reset', '/home', '/game'])

// Detectar si es admin
const isAdmin = computed(() => route.path.startsWith('/admin'))

const shouldShowHeader = computed(() => !hideOn.has(route.path))
const shouldShowFooter = computed(() => !hideOn.has(route.path))
</script>
