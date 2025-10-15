<template>
    <button class="insc-cta" :aria-disabled="disabled || loading ? 'true' : 'false'" :disabled="disabled || loading"
        @click="$emit('click')">
        <span v-if="!loading">{{ label }}</span>
        <span v-else class="insc-spinner" aria-live="polite">Procesando…</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{ label?: string; loading?: boolean; disabled?: boolean }>()
defineEmits<{ (e: 'click'): void }>()
</script>
