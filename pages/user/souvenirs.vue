<script setup lang="ts">
import HeroSouvenirs from '@/components/sections/store/hero-souvenirs.vue'
import ProductCard from '@/components/sections/store/product-card.vue'
import SupportWhatsAppCard from '@/components/sections/store/support-whatsapp-card.vue'

definePageMeta({
  name: 'souvenirs',
  path: '/souvenirs',
  guestOnly: true, // 🧍 solo accesible si NO hay sesión
})

</script>

<template>
  <HeroSouvenirs
    logo-src="/logos/congreso-mark.svg"
    hero-img="/images/hero-modelos.png"
    @go-cart="() => $router.push('/cart')"
    @go-register="() => $router.push('/register')"

  />

  <ProductCard/>
  
    <SupportWhatsAppCard />

  

</template>
