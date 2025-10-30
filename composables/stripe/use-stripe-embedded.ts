// composables/stripe/use-stripe-embedded.ts
import type { LineItem, CreateSessionResponse, VerifyPaymentResponse } from '~/types/payment'

export function useStripeEmbedded() {
    const { public: pub } = useRuntimeConfig()
    const { post, get } = useApi()

    const createSession = async (items: LineItem[]) => {
        return await post('/payment-stripe/create-checkout-session', {
            items, 
            returnUrl: pub.returnUrl
        })
    }

    const verifySession = async (sessionId: string) => {
        return await get(`/payment-stripe/verify-payment/${sessionId}`)
    }

    return { createSession, verifySession }
}
    /**customerId: string | null
    amount: number
}

export function useStripeEmbedded() {
    const { public: pub } = useRuntimeConfig()
    const { post, get } = useApi()

    const createSession = async (items: LineItem[]) => {
        return await post('/payment-stripe/create-checkout-session', {
            items, 
            returnUrl: pub.returnUrl
        })
    }

    const verifySession = async (sessionId: string) => {
        return await get(`/payment-stripe/verify-payment/${sessionId}`)
    }

    return { createSession, verifySession }
} */