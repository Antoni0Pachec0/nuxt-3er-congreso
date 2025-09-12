<!-- pages/index.vue -->
<template>
  <main>
    <Header />
    <Hero />
    <Description />
    <LogosUni />
    <Mapa />
  </main>
</template>

<script setup>
  import Hero from '~/components/sections/Hero.vue'
  import Header from '~/components/layout/Header.vue'
  import  Description from '~/components/sections/Description.vue'
  import LogosUni from '~/components/sections/Logos-uni.vue'
  import Mapa from '~/components/sections/Mapa.vue'
</script>
