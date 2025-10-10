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
import "/assets/css/styles/store/cartDrawer.css";
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

