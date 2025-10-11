<script setup>
import ScheduleHero from '@/components/sections/schedule/schedule-hero.vue'
import Timetable from '@/components/sections/schedule/time-table.vue'

definePageMeta({
  name: 'schedule',
  path: '/schedule',
  guestOnly: true, // 🧍 solo accesible si NO hay sesión
})
</script>

<template>
  <ScheduleHero />
  <Timetable />
</template>
