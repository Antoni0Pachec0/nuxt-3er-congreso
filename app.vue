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

    <!-- Footer -->
    <Footer v-if="shouldShowChrome" />
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

</script>
