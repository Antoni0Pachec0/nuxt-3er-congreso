<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNuxtApp } from '#app'
import { useStripeEmbedded } from '~/composables/useStripeEmbedded'

// SIMULADO: reemplázalo con tu carrito real
const items = ref([{ price: 'CONGRESO', quantity: 1 }])

const clientSecret = ref<string | null>(null)
const sessionId = ref<string | null>(null)
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)

const { $stripe } = useNuxtApp()
const { createSession } = useStripeEmbedded()

onMounted(async () => {
  try {
    // 1) Crear la sesión en tu backend
    const { sessionId: sid, clientSecret: cs } = await createSession(items.value)
    sessionId.value = sid
    clientSecret.value = cs
    
    // 2) Inicializar Embedded Checkout y montarlo en el contenedor
    const stripe = await $stripe()
    if (!stripe) throw new Error('No se pudo cargar Stripe')

    const checkout = await stripe.initEmbeddedCheckout({
      clientSecret: clientSecret.value as string
    })
    checkout.mount('#embedded-checkout')

    isLoading.value = false
  } catch (e: any) {
    errorMsg.value = e?.message || 'Error al iniciar el checkout'
    isLoading.value = false
  }
})
</script>

<template>
  <main class="container mx-auto py-10">
    <h1 class="text-2xl font-bold mb-4">Pago con Stripe (Embedded)</h1>

    <div v-if="isLoading" class="p-4 border rounded">Cargando checkout…</div>
    <div v-if="errorMsg" class="p-4 border border-red-500 text-red-600 rounded">
      {{ errorMsg }}
    </div>

    <!-- Aquí se renderiza el formulario embebido -->
    <div id="embedded-checkout" class="min-h-[540px] border rounded p-4"></div>

    <!-- Quita esto si no quieres mostrar el ID -->
    <p v-if="sessionId" class="text-xs text-gray-500 mt-3">Session ID: {{ sessionId }}</p>
  </main>
</template>
