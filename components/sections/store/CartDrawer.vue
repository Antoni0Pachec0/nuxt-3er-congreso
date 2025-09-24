<template>
  <!-- Fondo oscuro con fade -->
  <transition name="fade">
    <div v-if="open" class="overlay" @click="open = false"></div>
  </transition>

  <!-- Carrito con slide -->
  <transition name="slide-cart">
    <aside v-if="open" class="cart-floating" @click.stop>
      <!-- Header -->
      <header class="cart-header">
        <h3 class="cart-title">🛒 Mi carrito</h3>
        <v-btn icon variant="text" @click="open = false">
          <X :size="20" stroke-width="2" />
        </v-btn>
      </header>

      <!-- Body -->
      <section class="cart-body">
        <div v-if="items.length">
          <div v-for="(item, idx) in items" :key="idx" class="cart-item">
            <img :src="item.image" class="thumb" />

            <div class="info">
              <div class="title">{{ item.product.title }}</div>
              <div class="meta">
                <span v-if="item.color" class="tag">
                  Color: <span :style="{ color: item.color }">●</span>
                </span>
                <span v-if="item.size" class="tag">Talla: {{ item.size }}</span>
              </div>

              <!-- Control de cantidad -->
              <div class="qty-control">
                <button
                  class="qty-btn"
                  @click="decQty(idx)"
                  :disabled="item.qty <= 1"
                >
                  –
                </button>
                <span class="qty-num">{{ item.qty }}</span>
                <button class="qty-btn" @click="incQty(idx)">+</button>
              </div>

              <div class="price">${{ item.unitPrice * item.qty }}</div>
            </div>

            <v-btn icon size="small" variant="text" @click="removeItem(idx)">
              <Trash2 :size="16" stroke-width="1.6" />
            </v-btn>
          </div>
        </div>

        <div v-else class="empty">
          <ShoppingCart :size="40" stroke-width="1.6" class="icon-empty" />
          <p>Tu carrito está vacío</p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="cart-footer">
        <div class="total">
          <span>Total:</span>
          <strong>${{ total }}</strong>
        </div>
        <v-btn
          color="primary"
          rounded="xl"
          size="large"
          block
          :disabled="!items.length"
        >
          Finalizar compra
        </v-btn>
      </footer>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X, ShoppingCart, Trash2 } from "lucide-vue-next";

const open = defineModel<boolean>({ default: false });
const items = defineModel<any[]>("items", { default: [] });

function removeItem(idx: number) {
  items.value.splice(idx, 1);
}
function incQty(idx: number) {
  items.value[idx].qty++;
}
function decQty(idx: number) {
  if (items.value[idx].qty > 1) {
    items.value[idx].qty--;
  }
}

const total = computed(() =>
  items.value.reduce((sum, i) => sum + i.unitPrice * i.qty, 0).toFixed(0)
);
</script>

<style scoped>
/* Fondo oscuro */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55); /* Fondo oscuro con opacidad */
  z-index: 9998;
}

/* Fade del fondo */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Carrito */
.cart-floating {
  position: fixed;
  top: 0;
  right: 0;
  width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 16px;
  background: #fff;
  box-shadow: -6px 0 20px rgba(0, 0, 0, 0.18);
  font-family: system-ui, sans-serif;
  z-index: 100000;
  transition: all 0.35s ease; /* Añadimos una transición suave */
}

/* Header */
.cart-header {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #153885, #3473ff);
  color: #fff;
}
.cart-title {
  font-size: 0.95rem;
  font-weight: 700;
}

/* Body */
.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px;
}
.cart-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
}
.info {
  flex: 1;
}
.title {
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 2px;
}
.meta {
  font-size: 0.7rem;
  color: #666;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
}
.tag {
  background: rgba(0, 0, 0, 0.04);
  padding: 1px 4px;
  border-radius: 4px;
}
.price {
  font-size: 0.85rem;
  font-weight: 700;
  color: #153885;
  margin-top: 4px;
}
.empty {
  text-align: center;
  padding: 30px 16px;
  color: #666;
}
.icon-empty {
  margin-bottom: 10px;
  color: #999;
}

/* Cantidad */
.qty-control {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}
.qty-btn {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.qty-btn:hover:not(:disabled) {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.qty-num {
  min-width: 20px;
  text-align: center;
  font-size: 0.8rem;
}

/* Footer */
.cart-footer {
  padding: 12px 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: #fafafa;
}
.total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

/* Animación del carrito */
.slide-cart-enter-active,
.slide-cart-leave-active {
  transition: transform 0.35s ease;
}
.slide-cart-enter-from,
.slide-cart-leave-to {
  transform: translateX(100%);
}

/* ============================
  RESPONSIVIDAD PARA DISPOSITIVOS MÓVILES
================================ */

/* Ajuste para pantallas más pequeñas (iPhone 5, dispositivos similares) */
@media (max-width: 480px) {
  .cart-floating {
    width: 100%; /* Hacer el carrito 100% de ancho */
    height: 100%; /* Hacer el carrito de altura completa */
    border-top-left-radius: 8px; /* Esquinas más redondeadas */
  }

  .cart-header {
    padding: 8px 10px;
    font-size: 0.9rem; /* Reducir el tamaño de fuente */
  }

  .cart-title {
    font-size: 0.85rem;
  }

  .cart-item {
    padding: 6px 0;
    font-size: 0.75rem;
  }

  .thumb {
    width: 36px;
    height: 36px;
  }

  .price {
    font-size: 0.8rem;
  }

  .qty-control {
    gap: 4px;
  }

  .qty-btn {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
  }

  .qty-num {
    font-size: 0.7rem;
  }

  .empty p {
    font-size: 0.8rem;
  }

  .cart-footer {
    padding: 10px 12px;
  }

  .total {
    font-size: 0.85rem;
  }

  .card-footer {
    grid-template-columns: 1fr; /* Para que los botones del pie de página estén en una sola columna */
  }

  .btn-outline-custom, .btn-solid-custom {
    font-size: 0.75rem; /* Reducir el tamaño de los botones */
  }
}

/* Ajuste para pantallas más grandes */
@media (min-width: 1024px) {
  .cart-floating {
    width: 380px; /* Ancho mayor en pantallas más grandes */
    height: 100%;
  }
}

</style>
