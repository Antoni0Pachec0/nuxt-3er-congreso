// composables/stripe/use-stripe-embedded.ts
import { config } from 'process'
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

    // verifySession AHORA usa $fetch (público)
    const verifySession = async (sessionId: string) => {
        if (!sessionId) {
            throw new Error('No session ID provided to verifySession')
        }

        // 2. Usamos $fetch (nativo de Nuxt)
        return await $fetch(
            `/payment-stripe/verify-payment/${sessionId}`,
            {
                baseURL: pub.apiBase, // 👈 Usamos la URL base de tu API
                method: 'GET',
            }
        )
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