export type PlanSlug = 'congreso2025' | string

export interface CreateStripeSessionDto {
    planSlug: PlanSlug
    // (opcional) metadata adicional que te guste persistir
    metadata?: Record<string, string | number | boolean>
}

export interface CreateStripeSessionRes {
    sessionId: string
    clientSecret: string
}

export interface VerifyPaymentRes {
    status: 'paid' | 'unpaid' | 'error'
    amount?: number
    currency?: string
    sessionId?: string
    message?: string
}
