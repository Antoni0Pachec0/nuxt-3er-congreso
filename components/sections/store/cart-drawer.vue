<template>
  <!-- Fondo oscuro con fade -->
  <transition name="fade">
    <div v-if="open" class="cart-overlay" @click="open = false"></div>
  </transition>

  <!-- Carrito -->
  <transition name="slide-cart">
    <aside v-if="open" class="cart-floating-wrapper" @click.stop>
      <div class="cart-floating">
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
              <img :src="item.image" class="cart-thumb" />

              <div class="cart-info">
                <div class="cart-item-title">{{ item.product.title }}</div>
                <div class="cart-item-meta">
                  <span v-if="item.color" class="cart-tag">
                    Color: <span :style="{ color: item.color }">●</span>
                  </span>
                  <span v-if="item.size" class="cart-tag">
                    Talla: {{ item.size }}
                  </span>
                </div>

                <div class="qty-control">
                  <button class="qty-btn" @click="decQty(idx)" :disabled="item.qty <= 1">–</button>
                  <span class="qty-num">{{ item.qty }}</span>
                  <button class="qty-btn" @click="incQty(idx)">+</button>
                </div>

                <div class="cart-item-price">
                  ${{ item.unitPrice * item.qty }}
                </div>
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
          <div class="cart-total-row">
            <span>Total:</span>
            <strong>${{ total }}</strong>
          </div>
          <v-btn color="primary" rounded="xl" size="large" block :disabled="!items.length">
            Finalizar compra
          </v-btn>
        </footer>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X, ShoppingCart, Trash2 } from "lucide-vue-next";

type CartItem = {
  product: { id: number; title: string };
  color: string | null;
  size: string | null;
  qty: number;
  unitPrice: number;
  image: string;
};

const open = defineModel<boolean>({ default: false });
const items = defineModel<CartItem[]>("items", { default: [] });

const removeItem = (i: number) => items.value.splice(i, 1);
const incQty = (i: number) => {
  const item = items.value[i];
  if (item) item.qty++;
};
const decQty = (i: number) => {
  const item = items.value[i];
  if (item && item.qty > 1) item.qty--;
};

const total = computed(() =>
  items.value.reduce((s, i) => s + i.unitPrice * i.qty, 0).toFixed(0)
);
</script>

<style scoped src="@/assets/css/styles/pages/store/cart-drawer.css"></style>
