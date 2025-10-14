<script setup>
import ScheduleHero from '@/components/sections/schedule/schedule-hero.vue'
import Timetable from '@/components/sections/schedule/time-table.vue'

definePageMeta({
  name: 'schedule',
  path: '/schedule',
  guestOnly: true, 
})
</script>

<template>
  <ScheduleHero />
  <Timetable />
</template>
