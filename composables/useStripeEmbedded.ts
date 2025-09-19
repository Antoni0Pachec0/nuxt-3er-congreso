// composables/useStripeEmbedded.ts
import { useRuntimeConfig } from '#app'

type LineItem = { price: string; quantity: number }

export function useStripeEmbedded() {
    const config = useRuntimeConfig()
    const apiBase = config.public.API_BASE as string
    const returnUrl = config.public.RETURN_URL as string

    const createSession = async (items: LineItem[]) => {
        // Puedes añadir un Idempotency-Key único si quieres más seguridad
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }

        const res = await $fetch<{ sessionId: string; clientSecret: string }>(
            `${apiBase}/payment-stripe/create-checkout-session`,
            {
                method: 'POST',
                headers,
                body: {
                    items,
                    returnUrl
                }
            }
        )

        return res
    }

    const verifySession = async (sessionId: string) => {
        const res = await $fetch<{
            isComplete: boolean
            paymentStatus: string
            customerId: string | null
            amount: number
        }>(`${apiBase}/payment-stripe/verify-payment/${sessionId}`, { method: 'POST' })
        return res
    }

    return { createSession, verifySession }
}
