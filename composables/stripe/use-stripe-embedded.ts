import { useRuntimeConfig } from '#app'

type LineItem = { price: string; quantity: number }

export function useStripeEmbedded() {
    const config = useRuntimeConfig()

    // ✔️ CORRECCIÓN: Accede a las variables en camelCase
    const apiBase = config.public.apiBase as string
    const returnUrl = config.public.returnUrl as string

    const createSession = async (items: LineItem[]) => {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }

        // Ahora la URL se construirá correctamente
        const res = await $fetch<{ sessionId: string; clientSecret: string }>(
            `${apiBase}/payment-stripe/create-checkout-session`,
            {
                method: 'POST',
                headers,
                body: {
                    items,
                    // Asegúrate que tu DTO en el backend espera 'returnUrl'
                    returnUrl: returnUrl 
                }
            }
        )

        return res
    }

    const verifySession = async (sessionId: string) => {
        // CORRECCIÓN aplicada aquí también
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