<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStripeEmbedded } from '~/composables/useStripeEmbedded'

const route = useRoute()
const { verifySession } = useStripeEmbedded()

const status = ref<'checking' | 'paid' | 'unpaid' | 'error'>('checking')
const amount = ref<number>(0)
const msg = ref<string>('Verificando pago...')

onMounted(async () => {
    const sessionId = String(route.query.session_id || '')
    if (!sessionId) {
        status.value = 'error'
        msg.value = 'Falta session_id en la URL'
        return
    }

    try {
        const res = await verifySession(sessionId)
        amount.value = res.amount || 0
        if (res.isComplete && res.paymentStatus === 'paid') {
            status.value = 'paid'
            msg.value = '¡Pago completado!'
        } else {
            status.value = 'unpaid'
            msg.value = `Estado: ${res.paymentStatus}`
        }
    } catch (err: any) {
        status.value = 'error'
        msg.value = err?.message || 'Error al verificar el pago'
    }
})
</script>

<template>
    <main class="container mx-auto py-10">
        <h1 class="text-2xl font-bold mb-4">Resultado del pago</h1>

        <div v-if="status === 'checking'" class="p-4 rounded border">
            {{ msg }}
        </div>

        <div v-else-if="status === 'paid'" class="p-4 rounded border border-green-500 text-green-600">
            {{ msg }} Total: {{ (amount / 1).toFixed(2) }}
        </div>

        <div v-else-if="status === 'unpaid'" class="p-4 rounded border border-yellow-500 text-yellow-700">
            {{ msg }}
        </div>

        <div v-else class="p-4 rounded border border-red-500 text-red-600">
            {{ msg }}
        </div>
    </main>
</template>
