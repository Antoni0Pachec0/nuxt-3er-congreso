<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    v-bind="attrs"
  >
    <!-- Si viene una ruta 'path' (p. ej. de mdi/js) la dibujamos; si no, renderizamos slot -->
    <path v-if="path" :d="path" />
    <slot v-else />
  </svg>
</template>

<script setup>
import { useAttrs } from 'vue'

const props = defineProps({
  path: { type: String, default: '' },
  size: { type: [String, Number], default: 22 },
  type: { type: String, default: 'mdi' }
})

const attrs = useAttrs()
</script>

<style scoped>
svg { display: inline-block; vertical-align: middle; fill: currentColor }
</style>
