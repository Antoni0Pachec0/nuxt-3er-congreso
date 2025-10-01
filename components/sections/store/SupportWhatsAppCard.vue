<!-- components/SupportWhatsAppCard.vue -->
<template>
  <v-card class="wa-card mx-auto" elevation="1" rounded="xl">
    <div class="wa-content">
      <h3 class="wa-title">¿Problemas para comprar en línea?</h3>
      <p class="wa-subtitle">
        Si no logras completar tu pedido, contacta directamente con el
        administrador de ventas y realiza tu compra por WhatsApp.
      </p>

      <a class="wa-btn" :href="waLink" target="_blank" rel="noopener">
        <Icon icon="simple-icons:whatsapp" width="18" class="wa-btn__icon" />
        <span>Enviar mensaje por WhatsApp</span>
      </a>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";

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

<style scoped>
/* Card contenida y centrada */
.wa-card {
  max-width: clamp(320px, 92vw, 1150px); /* evita que ocupe todo el ancho */
  background: #f3f4f6; /* gris claro */
  padding: clamp(16px, 3vw, 28px);
}

/* Contenido centrado con línea de lectura más corta */
.wa-content {
  max-width: 680px; /* reduce la longitud de línea para mejorar legibilidad */
  margin: 0 auto;
  text-align: center;
}

/* Título (ligeramente más chico) */
.wa-title {
  margin: 0 0 6px 0;
  font-weight: 700;
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  color: #111827; /* gray-900 */
}

/* Subtítulo */
.wa-subtitle {
  margin: 0 0 18px 0;
  color: #6b7280; /* gray-500 */
  font-size: clamp(0.85rem, 1.4vw, 0.95rem);
}

/* Botón estilo "pill" con borde azul y leve sombra en hover */
.wa-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #2563eb; /* azul */
  border-radius: 999px;
  background: #ffffff;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.08);
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.wa-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(37, 99, 235, 0.16);
  background: #f8fbff;
}

.wa-btn__icon {
  margin-left: 2px;
}

.wa-btn__icon {
  margin-left: 2px;
}
</style>
