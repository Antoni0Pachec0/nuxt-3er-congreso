export default defineNuxtPlugin((nuxtApp) => {
    // Este código solo se ejecutará en el navegador
    if (process.client) {
        // Importamos dinámicamente para evitar errores de SSR
        return import('@vue-stripe/vue-stripe').then(({ StripeCheckout, StripeElementCard }) => {
            nuxtApp.vueApp.component('StripeCheckout', StripeCheckout);
            nuxtApp.vueApp.component('StripeElementCard', StripeElementCard);

            console.log('Stripe components registered successfully');

            return {
                provide: {
                    stripe: {
                        checkout: StripeCheckout,
                        elements: StripeElementCard
                    }
                }
            };
        }).catch(err => {
            console.error('Error loading Stripe components:', err);
            return {};
        });
    }

    return {};
});