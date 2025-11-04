<script setup>
import HeroWorkshops from '@/components/sections/workshops/hero-workshops.vue'
import WorkshopsList from '@/components/sections/workshops/workshops-list.vue'

definePageMeta({
  name: 'workshops',
  path: '/workshops',
})
</script>

<template>
  <HeroWorkshops />
  <WorkshopsList />
</template>
