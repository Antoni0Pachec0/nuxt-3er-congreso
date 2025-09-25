<template>
  <v-alert
    v-if="show"
    :type="type"
    dismissible
    @input="closeAlert"
    class="notification-alert"
  >
    {{ message }}
  </v-alert>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'success', // puede ser 'success', 'error', 'info', 'warning'
  },
  message: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:show']);

// Cerrar la alerta
const closeAlert = () => {
  emit('update:show', false); // Actualizamos el valor para ocultar la alerta en el padre
};
</script>

<style scoped>
.notification-alert {
  font-size: 1rem;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.v-alert.success {
  background-color: #4caf50;
  color: white;
}

.v-alert.error {
  background-color: #f44336;
  color: white;
}

.v-alert.warning {
  background-color: #ff9800;
  color: white;
}

.v-alert.info {
  background-color: #2196f3;
  color: white;
}
</style>
