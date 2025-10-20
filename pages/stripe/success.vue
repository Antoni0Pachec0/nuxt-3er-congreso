<script setup lang="ts">
import { useRoute, useRouter } from '#app'
import { useStripeEmbedded } from '~/composables/stripe/use-stripe-embedded'

//definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const router = useRouter()
const { verifySession } = useStripeEmbedded()

const status = ref<'loading' | 'paid' | 'unpaid' | 'error'>('loading')
const amount = ref<number | null>(null)
const msg = ref<string>('')

onMounted(async () => {
    const sessionId = (route.query.session_id as string) || ''
    if (!sessionId) {
        status.value = 'error'; msg.value = 'Falta session_id'
        return
    }
    try {
        const res = await verifySession(sessionId)
        // Ajusta según tu respuesta real
        if (res.isComplete && res.paymentStatus === 'paid') {
            status.value = 'paid'
            amount.value = res.amount ?? null
        } else {
            status.value = 'unpaid'
            msg.value = 'Pago no completado'
        }
    } catch (e: any) {
        status.value = 'error'
        msg.value = e?.message || 'Error al verificar el pago'
    }
})
</script>

<template>
    <main class="container mx-auto py-10">
        <div v-if="status === 'loading'">Verificando pago…</div>

        <div v-else-if="status === 'paid'" class="p-4 border rounded text-green-700 border-green-500">
            ¡Pago confirmado! 🎉
            <div v-if="amount">Monto: {{ (amount / 100).toFixed(2) }}</div>
            <!-- aquí puedes mostrar botón a /user/home -->
        </div>

        <div v-else-if="status === 'unpaid'" class="p-4 border rounded text-yellow-700 border-yellow-500">
            El pago no se completó. {{ msg }}
            <!-- botón para intentar de nuevo -->
        </div>

        <div v-else class="p-4 border rounded text-red-700 border-red-500">
            Ocurrió un error. {{ msg }}
        </div>
    </main>
</template>
