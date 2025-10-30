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

definePageMeta({
    middleware: ['auth']
})

const router = useRouter()
const auth = useAuth()

// ✅ MIDDLEWARE ACTIVADO

// Debug info

const showDebug = ref(false)
const debugInfo = ref({
    token: '',
    authenticated: false
})

onMounted(() => {
    debugInfo.value = {
        token: auth.getToken() ? auth.getToken()!.substring(0, 20) + '...' : 'No token',
        authenticated: auth.isAuthenticated()
    }

    console.log('Página de inscripción cargada:')
    console.log('Token:', auth.getToken())
    console.log('Autenticado:', auth.isAuthenticated())
})



/**
const PLAN_SLUG = 'CONGRESO'
const goCheckout = () => {
    console.log('Navegando a checkout...')
    router.push({ path: '/stripe/checkout', query: { plan: PLAN_SLUG } })
} */

// CTA → checkout (dejamos plan en query para usarlo después en Stripe)
const PLAN_SLUG = 'CONGRESO'
const goCheckout = () => {
    router.push({ path: '/stripe/checkout', query: { plan: PLAN_SLUG } })
}
</script>
