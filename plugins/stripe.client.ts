// plugins/stripe.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { loadStripe, type Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    if (!stripePromise) {
        stripePromise = loadStripe(config.public.STRIPE_PUBLISHABLE_KEY as string)
    }

    return {
        provide: {
            stripe: async () => await stripePromise
        }
    }
})
