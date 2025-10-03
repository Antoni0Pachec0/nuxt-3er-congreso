<template>
  <span
    :class="['fi', computedFlagClass]"
    style="display:inline-block;width:1.4rem;height:1rem;"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Tipado TS correcto (y <script setup lang="ts">):
const props = defineProps<{ country: string }>()

// Asegura fallback y minúsculas
const computedFlagClass = computed(() => {
  const code = (props.country || 'mx').toLowerCase()
  return `fi-${code}`
})
</script>

<style>
@import 'flag-icons/css/flag-icons.min.css';
</style>
