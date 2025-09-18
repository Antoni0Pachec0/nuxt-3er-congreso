<template>
  <div class="stripe-container">
    <div v-if="stripeLoaded">
      <component 
        :is="stripeComponent" 
        v-bind="$attrs"
        @success="$emit('success', $event)"
        @error="$emit('error', $event)"
      ></component>
    </div>
    <div v-else class="stripe-loading">
      <p>Cargando opciones de pago...</p>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'checkout',
    validator: (value) => ['checkout', 'elements'].includes(value)
  }
})

defineEmits(['success', 'error'])

const stripeLoaded = ref(false)
const stripeComponent = ref(null)

onMounted(async () => {
  try {
    // Cargar dinámicamente el componente apropiado
    const stripe = await import('@vue-stripe/vue-stripe')
    
    if (props.type === 'checkout') {
      stripeComponent.value = stripe.StripeCheckout
    } else {
      stripeComponent.value = stripe.StripeElementCard
    }
    
    stripeLoaded.value = true
  } catch (error) {
    console.error('Error cargando Stripe:', error)
  }
})
</script>