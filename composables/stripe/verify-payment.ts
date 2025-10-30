import type { VerifyPaymentResponse } from '@/types/payment'
import { useRuntimeConfig } from '#app'

export function useVerifyPayment() {
    const config = useRuntimeConfig()

    // estado reactivo
    const data = ref<VerifyPaymentResponse | null>(null)
    const pending = ref(false)
    const error = ref<any>(null)

    // función para cargar cuando YA tengas sessionId
    const load = async (sessionId: string) => {
        if (!sessionId) return
        pending.value = true
        error.value = null
        try {
            // Usa GET o POST según tu backend
            data.value = await $fetch<VerifyPaymentResponse>(
                `/payment-stripe/verify-payment/${sessionId}`,
                {
                    baseURL: config.public.apiBase,   // 👈 usa mismo baseURL que createSession
                    method: 'GET',                    // 👈 recomiendo GET (ver punto 3)
                    credentials: 'include',
                }
            )
        } catch (e) {
            error.value = e
            data.value = null
        } finally {
            pending.value = false
        }
    }

    const amountMXN = computed(() => ((data.value?.amount ?? 0) / 100).toFixed(2))
    const currencyUpper = computed(() => (data.value?.currency || '').toUpperCase())

    return { payment: data, pending, error, load, amountMXN, currencyUpper }
}
