<script setup lang="ts">
import HeroSouvenirs from '@/components/sections/store/hero-souvenirs.vue'
import ProductCard from '@/components/sections/store/product-card.vue'
import SupportWhatsAppCard from '@/components/sections/store/support-whatsapp-card.vue'

definePageMeta({
  name: 'souvenirs',
  path: '/souvenirs',
  guestOnly: true, // 🧍 solo accesible si NO hay sesión
})

const router = useRouter()
const goCart = () => router.push('/cart')
const goRegister = () => router.push('/register')
</script>

<template>
  <HeroSouvenirs
    @go-cart="goCart"
    @go-register="goRegister"
  />
  <ProductCard />
  <SupportWhatsAppCard />
</template>