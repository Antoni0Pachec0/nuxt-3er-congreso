  <script setup lang="ts">
import HeroSouvenirs from '@/components/sections/store/HeroSouvenirs.vue'
import ProductCard from '@/components/sections/store/ProductCard.vue'



</script>

<template>
  <HeroSouvenirs
    logo-src="/logos/congreso-mark.svg"
    hero-img="/images/hero-modelos.png"
    @go-cart="() => $router.push('/cart')"
    @go-register="() => $router.push('/register')",

  />

  <ProductCard/>
  
  

</template>
