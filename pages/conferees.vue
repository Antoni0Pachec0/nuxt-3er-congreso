<script setup>
import Heroconferees from '@/components/sections/conferees/hero-conferees.vue'
import Speakers from '@/components/sections/conferees/speakers.vue'

definePageMeta({
  name: 'conferees',
  path: '/conferees',
  guestOnly: true, // 🧍 solo accesible si NO hay sesión
})
</script>
<template>
    <Heroconferees/>
    <Speakers/>
    
</template>