// types/payment.ts
export type PlanSlug = 'CONGRESO' | 'PAQUETE' | 'SOUVENIR' | string
export type PaymentStatus = 'paid' | 'unpaid' | 'no_payment_required' | 'pending' | string

export interface LineItem {
    price: string;
    quantity: number;
}

export interface CreateSessionResponse {
    sessionId: string;
    clientSecret: string | null;
}

export interface VerifyPaymentResponse {
    isComplete: boolean;
    paymentStatus: PaymentStatus;
    customerId: string | null;
    amount: number;
    currency: string;
    sessionId: string;
    userId?: string;
    clientReferenceId?: string;
}

export interface CreateStripeSessionDto {
    items: LineItem[];
    returnUrl?: string;
    customerEmail?: string;
    clientReferenceId?: string;
    metadata?: Record<string, string>;
}