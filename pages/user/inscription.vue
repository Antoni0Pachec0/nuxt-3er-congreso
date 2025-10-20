<!-- pages/inscripcion/index.vue -->
<template>
    <main class="insc" aria-labelledby="insc-title">
        <GiftsIncluded cta-text="Inscríbete" @cta="goCheckout" />
    </main>
</template>

<script setup lang="ts">
// Si AÚN no agregas el CSS global en nuxt.config, descomenta esta línea:
import '@/assets/css/styles/user/inscription.css'

import GiftsIncluded from '@/components/sections/inscription/gift-include.vue'
const router = useRouter()

// Solo usuarios logueados
//definePageMeta({ middleware: ['auth'] })

// CTA → checkout (dejamos plan en query para usarlo después en Stripe)
const PLAN_SLUG = 'CONGRESO'
const goCheckout = () => {
    router.push({ path: '/stripe/checkout', query: { plan: PLAN_SLUG } })
}
</script>
