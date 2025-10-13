<!-- components/SupportWhatsAppCard.vue -->
<template>
  <v-card class="wa-card mx-auto" elevation="1" rounded="xl">
    <div class="wa-content">
      <h3 class="wa-title">¿Problemas para comprar en línea?</h3>
      <p class="wa-subtitle">
        Si no logras completar tu pedido, contacta directamente con el
        administrador de ventas y realiza tu compra por WhatsApp.
      </p>
      <a
        class="wa-btn"
        :href="waLink"
        target="_blank"
        rel="noopener"
        :aria-label="`Abrir WhatsApp con ${displayPhone}`"
      >
        <v-icon size="18" class="wa-btn__icon">mdi-whatsapp</v-icon>
        <span>Enviar mensaje por WhatsApp</span>
      </a>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import "@/assets/css/styles/pages/store/support-whatsapp-card.css";

// Personaliza aquí:
const phone = "+521234567890"; // Coloca tu número con código de país (ej. México: +52)
const text = "Hola, tengo dudas para finalizar mi compra."; // Mensaje que se precarga

const waLink = computed(() => {
  const t = encodeURIComponent(text);
  // wa.me funciona con + o sin, pero a veces es más estable sin signos:
  const clean = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${t}`;
});
</script>