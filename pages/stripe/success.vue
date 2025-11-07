<!-- pages/stripe/success.vue -->
<script setup lang="ts">
import { useStripeEmbedded } from '~/composables/stripe/use-stripe-embedded'
import type { VerifyPaymentResponse } from '~/types/payment'

// NUEVO: Importa el store de Pinia y tu API de autenticación
import { useAuthStore } from '@/security/stores/auth'
// Asegúrate de que esta ruta a tu AuthApi sea la correcta
import { AuthApi } from '@/backend/auth/login-api'

// ✅ PROTEGER ESTA PÁGINA
definePageMeta({
    requiresAuth: true
})
const route = useRoute()
const router = useRouter()
const { verifySession } = useStripeEmbedded()
// NUEVO: Obtén la instancia del store
const authStore = useAuthStore()

type PaymentStatus = 'loading' | 'paid' | 'unpaid' | 'error'

const status = ref<PaymentStatus>('loading')
const amount = ref<number | null>(null)
const msg = ref<string>('')
const paymentData = ref<VerifyPaymentResponse | null>(null)

onMounted(async () => {
    const sessionId = (route.query.session_id as string) || ''

    if (!sessionId) {
        status.value = 'error'
        msg.value = 'Falta session_id en la URL'
        return
    }

    try {
        const response = (await verifySession(sessionId)) as VerifyPaymentResponse

        paymentData.value = response

        if (response.isComplete && response.paymentStatus === 'paid') {
            status.value = 'paid'
            amount.value = response.amount

            // --- 💡 INICIO DE LA SOLUCIÓN ---
            // El pago está confirmado, ahora actualizamos la sesión del frontend
            try {
                // Volvemos a llamar a 'getMe' para obtener los datos frescos (ej. status_event: true)
                const me = await AuthApi.getMe();
                if (me?.user_id) {
                    // Actualizamos el store de Pinia con los datos frescos
                    authStore.setUser({
                        id: Number(me.user_id),
                        email: me.email || '',
                        name: me.name_user || '',
                        roleId: me.type_user_id ?? null,
                        roleName: me?.type_user?.name_type ?? null
                    });
                }
            } catch (userError) {
                // Esto no debería fallar ya que la página tiene 'requiresAuth', pero por si acaso
                console.error('Error al re-validar al usuario:', userError);
            }
            // --- FIN DE LA SOLUCIÓN ---

        } else {
            status.value = 'unpaid'
            msg.value = `Estado del pago: ${response.paymentStatus}`
        }
    } catch (error: any) {
        console.error('Error verificando pago:', error)
        status.value = 'error'
        msg.value = error?.message || 'Error al verificar el pago'
    }
})
</script>

<template>
    <main class="container mx-auto py-10">
        <h1 class="text-2xl font-bold mb-6">Resultado del Pago</h1>

        <div v-if="status === 'loading'" class="p-4 border border-blue-500 text-blue-600 rounded">
            <p>Verificando pago…</p>
        </div>

        <div v-else-if="status === 'paid'" class="p-4 border rounded text-green-700 border-green-500 bg-green-50">
            <h2 class="text-xl font-bold mb-2">¡Pago confirmado! 🎉</h2>
            <div v-if="amount" class="mb-2">Monto: ${{ (amount / 100).toFixed(2) }} MXN</div>
            <div v-if="paymentData?.sessionId" class="text-sm opacity-75 mb-4">
                ID de sesión: {{ paymentData.sessionId }}
            </div>
            <button @click="router.push('/workshops')"
                class="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700 transition-colors">
                Ir a Talleres
            </button>
        </div>

        <div v-else-if="status === 'unpaid'" class="p-4 border rounded text-yellow-700 border-yellow-500 bg-yellow-50">
            <h2 class="text-xl font-bold mb-2">Pago pendiente</h2>
            <p class="mb-2">{{ msg }}</p>
            <div v-if="paymentData" class="text-sm opacity-75 mb-4">
                Estado actual: {{ paymentData.paymentStatus }}
            </div>
            <button @click="router.push('/user/inscription')"
                class="bg-yellow-600 text-black px-4 py-2 rounded hover:bg-yellow-700 transition-colors">
                Intentar nuevamente
            </button>
        </div>

        <div v-else class="p-4 border rounded text-red-700 border-red-500 bg-red-50">
            <h2 class="text-xl font-bold mb-2">Error en el pago</h2>
            <p class="mb-4">{{ msg }}</p>
            <button @click="router.push('/user/inscription')"
                class="bg-red-600 text-black px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Volver a Inscripción
            </button>
        </div>
    </main>
</template>