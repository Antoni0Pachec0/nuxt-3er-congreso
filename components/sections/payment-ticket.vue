<script setup lang="ts">
import type { VerifyPaymentResponse } from '@/types/payment'

const props = defineProps<{
    payment: VerifyPaymentResponse
    amount: string
    currency: string
}>()
</script>

<template>
    <div class="ticket">
        <h2>🎉 Pago Exitoso</h2>

        <p><strong>Monto:</strong> {{ amount }} {{ currency }}</p>
        <p><strong>Estado:</strong> {{ payment.paymentStatus }}</p>
        <p><strong>ID de sesión:</strong> {{ payment.sessionId }}</p>

        <button @click="$router.push('/')">Volver al inicio</button>
    </div>
</template>

<style scoped>
.ticket {
    max-width: 480px;
    margin: 3rem auto;
    background: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, .1);
    text-align: center;
}
</style>
