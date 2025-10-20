// composables/stripe/use-stripe-embedded.ts
import { useRuntimeConfig } from '#app'

type LineItem = { price: string; quantity: number }
type CreateSessionRes = { sessionId: string; clientSecret: string }
type VerifyRes = {
    isComplete: boolean
    paymentStatus: string
    customerId: string | null
    amount: number
}

export function useStripeEmbedded() {
    const { public: pub } = useRuntimeConfig()

    const createSession = async (items: LineItem[]) => {
        return await $fetch<CreateSessionRes>('/payment-stripe/create-checkout-session', {
            baseURL: pub.apiBase,     // 👈 toma host desde runtimeConfig
            method: 'POST',
            credentials: 'include',   // 👈 cookies
            body: { items, returnUrl: pub.returnUrl }
        })
    }

    const verifySession = async (sessionId: string) => {
        return await $fetch<VerifyRes>(`/payment-stripe/verify-payment/${sessionId}`, {
            baseURL: pub.apiBase,
            method: 'POST',
            credentials: 'include'
        })
    }

    return { createSession, verifySession }
}
