<template>
    <main class="insc" aria-labelledby="insc-title">
        <GiftsIncluded cta-text="Inscríbete" @cta="goCheckout" />
    </main>
</template>

<script setup lang="ts">
import '@/assets/css/styles/user/inscription.css'
import GiftsIncluded from '@/components/sections/inscription/gift-include.vue'
// 1. IMPORTA EL STORE DE PINIA
import { useAuthStore } from '@/security/stores/auth'

definePageMeta({
    middleware: []
})

const router = useRouter()
// 2. USA EL STORE DIRECTAMENTE
const authStore = useAuthStore()

// Debug info
const showDebug = ref(false)
const debugInfo = ref({
    token: '',
    authenticated: false
})

onMounted(() => {
    // 3. USA LOS DATOS DEL STORE (YA CARGADOS POR EL MIDDLEWARE GLOBAL)
    debugInfo.value = {
        token: authStore.accessToken ? authStore.accessToken.substring(0, 20) + '...' : 'No token',
        authenticated: authStore.isAuthenticated
    }

})

// CTA → checkout
const PLAN_SLUG = 'CONGRESO'
const goCheckout = () => {
    router.push({ path: '/stripe/checkout', query: { plan: PLAN_SLUG } })
}
</script>