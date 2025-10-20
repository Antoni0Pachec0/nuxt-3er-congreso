import type { CreateStripeSessionDto, CreateStripeSessionRes, VerifyPaymentRes } from '@/types/payment'

export function usePaymentStripe() {
    const { $api } = useNuxtApp()
    const busy = ref(false)
    const error = ref<string | null>(null)

    const createSession = async (dto: CreateStripeSessionDto): Promise<CreateStripeSessionRes> => {
        busy.value = true; error.value = null
        try {
            // Ajusta el path EXACTO a tu controlador Nest
            // Ejemplo común: POST /payment-stripe/create-session
            return await $api<CreateStripeSessionRes>('/payment-stripe/create-session', {
                method: 'POST',
                body: dto
            })
        } catch (e: any) {
            error.value = e?.data?.message || 'No se pudo crear la sesión de pago'
            throw e
        } finally {
            busy.value = false
        }
    }

    const verifyPayment = async (sessionId: string) => {
        try {
            // Ejemplo común: GET /payment-stripe/verify-payment/:id
            return await $api<VerifyPaymentRes>(`/payment-stripe/verify-payment/${sessionId}`, { method: 'GET' })
        } catch (e: any) {
            return { status: 'error', message: e?.data?.message || 'No se pudo verificar' } as VerifyPaymentRes
        }
    }

    return { busy, error, createSession, verifyPayment }
}
