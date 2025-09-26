<template>
  <div class="stripe-checkout-page">
    <h1>Checkout</h1>
    
    <ClientOnly>
      <!-- El componente StripeCheckout estará disponible gracias al plugin -->
      <StripeCheckout
        v-if="stripeReady"
        :pk="publishableKey"
        :session-id="sessionId"
        @success="onSuccess"
        @error="onError"
      />
      
      <template #fallback>
        <div class="loading">
          <p>Cargando opciones de pago...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Datos para Stripe
const publishableKey = ref('pk_test_51S6DAV4jsfavOSXFTcF15xbgrDWvjoSp6vzGBPmr0sshdAUnZgUn112QUdgu1N7xNFD7Ihhq2cW78AirOZLCw6p600sCDMniLI'); // Reemplaza con tu clave
const sessionId = ref(''); // Debes obtener esto de tu backend
const stripeReady = ref(false);

// Marcar como listo solo en cliente
onMounted(async () => {
  stripeReady.value = true;
  
  // Aquí podrías hacer una llamada a tu API para obtener el sessionId
  // Por ejemplo:
  const { data } = await useFetch('/api/create-checkout-session');
  sessionId.value = data.value.id;
});

// Funciones para manejar eventos de Stripe
const onSuccess = (result) => {
  console.log('Payment successful!', result);
  // Redirigir a página de éxito o mostrar mensaje
  navigateTo('/success');
};

const onError = (error) => {
  console.error('Payment error:', error);
  // Manejar el error, mostrar mensaje al usuario
};
</script>

<style scoped>
.stripe-checkout-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>
