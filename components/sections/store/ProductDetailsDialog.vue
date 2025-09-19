<template>
  <v-dialog
    v-model="open"
    max-width="980"
    scrollable
    persistent
    boderradius="24"
  >
    <v-card class="product-modal">
      <!-- Header -->
      <div
        class="d-flex align-center justify-space-between px-4 px-md-6 pt-4 pb-2"
      >
        <h3 class="text-h6 text-md-h5">{{ product.title }}</h3>
        <v-btn icon variant="text" class="close-btn" @click="close">
          <X :size="24" stroke-width="2" color="#2563eb" />
        </v-btn>
      </div>
      <v-divider />

      <!-- Body -->
      <v-card-text class="pa-0">
        <v-container fluid class="py-6 px-4 px-md-6">
          <v-row>
            <!-- Galería -->
            <v-col cols="12" md="6">
              <div class="gallery">
                <v-img
                  :src="activeImage"
                  :alt="product.title"
                  class="main-img"
                  aspect-ratio="1"
                  cover
                />

                <!-- Thumbs de cada color -->
                <div class="thumbs">
                  <button
                    v-for="(c, i) in product.colors"
                    :key="'thumb-' + i"
                    class="thumb"
                    :class="{ active: selectedColor === c }"
                    @click="selectedColor = c"
                  >
                    <img
                      :src="product.imagesByColor?.[c]"
                      :alt="`color-${i}`"
                    />
                  </button>
                </div>
              </div>
            </v-col>

            <!-- Información -->
            <v-col cols="12" md="6">
              <div class="desc text-medium-emphasis mb-4">
                {{ product.description }}
              </div>

              <!-- Features -->
              <div class="mb-4">
                <div class="font-weight-bold mb-2">
                  Características principales:
                </div>
                <ul class="features">
                  <li v-for="(f, i) in features" :key="i">
                    <CheckCircle :size="18" class="icon-check" />
                    <span>{{ f }}</span>
                  </li>
                </ul>
              </div>

              <!-- Colores -->
              <div class="section-block">
                <div class="label mb-2">Selecciona un color:</div>
                <div class="d-flex align-center flex-wrap gap-5">
                  <button
                    v-for="(c, i) in product.colors"
                    :key="'c-' + i"
                    class="swatch"
                    :class="{ active: selectedColor === c }"
                    :style="{ backgroundColor: c }"
                    @click="selectedColor = c"
                  />
                </div>
              </div>

              <!-- Tallas -->
              <div v-if="product.sizes?.length" class="section-block">
                <div class="label mb-2">Selecciona una talla:</div>
                <div class="d-flex flex-wrap gap-3">
                  <button
                    v-for="(s, i) in product.sizes"
                    :key="'s-' + i"
                    class="size-btn"
                    :class="{ active: selectedSize === s }"
                    @click="selectedSize = s"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>

              <!-- Cantidad -->
              <div class="mb-6">
                <div class="label mb-2">Cantidad:</div>
                <div class="qty">
                  <button class="qty-btn" @click="decQty" :disabled="qty <= 1">
                    –
                  </button>
                  <div class="qty-num">{{ qty }}</div>
                  <button
                    class="qty-btn"
                    @click="incQty"
                    :disabled="qty >= maxQty"
                  >
                    +
                  </button>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ maxQty }} disponibles
                </div>
              </div>

              <!-- Total + CTA -->
              <v-divider class="mb-4" />
              <div
                class="d-flex flex-column flex-sm-row align-center justify-space-between gap-3"
              >
                <div>
                  <div class="text-caption text-medium-emphasis">
                    Precio total:
                  </div>
                  <div class="text-h5 text-primary font-weight-bold">
                    ${{ totalPrice }}
                    <span class="text-caption text-medium-emphasis">MXN</span>
                  </div>
                </div>

                <v-btn
                  :disabled="!canAdd"
                  color="primary"
                  size="large"
                  class="cta"
                  prepend-icon="mdi-cart-outline"
                  @click="addToCart"
                >
                  Agregar • ${{ totalPrice }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, toRefs } from "vue";
import { X, CheckCircle } from "lucide-vue-next";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  imagesByColor?: Record<string, string>;
  colors: string[];
  sizes?: string[];
};


const props = defineProps<{
  modelValue: boolean;
  product: Product;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (
    e: "add-to-cart",
    payload: {
      productId: number;
      color: string | null;
      size: string | null;
      qty: number;
      unitPrice: number;
    }
  ): void;
}>();

const { product } = toRefs(props);

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const activeImage = ref("");
const selectedColor = ref<string | null>(null);
const selectedSize = ref<string | null>(null);
const qty = ref(1);
const maxQty = computed(() => Math.max(0, product.value.stock ?? 0));

const unitPrice = computed(() => product.value.price ?? 0);
const totalPrice = computed(() => (unitPrice.value * qty.value).toFixed(0));

const features = computed(() => [
  "Iconos de tecnologías populares",
  "Diseño minimalista elegante",
  "Tela premium",
  "Edición limitada",
]);

const canAdd = computed(
  () =>
    qty.value >= 1 &&
    qty.value <= maxQty.value &&
    (!!selectedColor.value || product.value.colors.length === 0) &&
    (!!selectedSize.value || !product.value.sizes?.length)
);

function decQty() {
  if (qty.value > 1) qty.value--;
}
function incQty() {
  if (qty.value < maxQty.value) qty.value++;
}

function close() {
  open.value = false;
}

function addToCart() {
  if (!canAdd.value) return;
  emit("add-to-cart", {
    productId: product.value.id,
    color: selectedColor.value,
    size: selectedSize.value,
    qty: qty.value,
    unitPrice: unitPrice.value,
  });
  close();
}

// reset al abrir
watch(open, (v) => {
  if (v) {
    selectedColor.value = product.value.colors?.[0] ?? null;
    selectedSize.value = product.value.sizes?.[0] ?? null;
    qty.value = 1;

    if (product.value.imagesByColor && selectedColor.value) {
      activeImage.value = product.value.imagesByColor[selectedColor.value];
    } else {
      activeImage.value = "";
    }
  }
});

// cambiar imagen al elegir color
watch(selectedColor, (c) => {
  if (c && product.value.imagesByColor) {
    activeImage.value = product.value.imagesByColor[c];
  }
});
</script>

<style scoped>
.product-modal {
  border-radius: 60px;
  overflow: hidden;
  position: relative;
}
:deep(.v-overlay__content) {
  border-radius: 32px; /* cambia aquí lo redondo */
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 100;
}
/* Galería */
.gallery {
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  aspect-ratio: 4/3; /* menos cuadrada */
  max-height: 340px; /* límite en desktop */
  object-fit: contain;
  margin: auto;
}
.main-img {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}
.thumbs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.thumb {
  width: 68px;
  height: 68px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb:hover {
  transform: translateY(-2px);
}
.thumb.active {
  outline: 2px solid rgba(30, 102, 255, 0.9);
}

/* Texto */
.desc {
  line-height: 1.6;
}
.features {
  list-style: none;
  padding: 0;
  margin: 0;
}
.features li {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

/* Labels */
.label {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.65);
}

/* Swatches */
.swatch {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1.5px solid rgba(0, 0, 0, 0.2);
  outline: 3px solid transparent;
  transition: outline-color 0.2s ease, transform 0.2s ease;
  margin: 4px;
}
.swatch.active {
  outline-color: rgba(30, 102, 255, 0.5);
  transform: scale(1.1);
  background: rgba(37, 99, 235, 0.08);
}

/* Tallas */
.size-btn {
  min-width: 44px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1.5px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  margin: 4px;
}
.size-btn:hover {
  background: rgba(37, 99, 235, 0.08);
}
.size-btn.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
  transform: translateY(-2px);
}

/* Cantidad */
.qty {
  display: flex;
  align-items: center;
  gap: 10px;
}
.qty-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.qty-btn:hover:not(:disabled) {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.qty-num {
  min-width: 44px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  background: #fff;
  font-weight: 600;
}
.icon-check {
  color: #2563eb;
  margin-right: 8px;
}
.features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}
.features li {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
}


/* CTA */
.cta {
  min-width: 260px;
  font-weight: 600;
  border-radius: 999px;
}

/* Responsive */
@media (max-width: 960px) {
  .product-modal {
    border-radius: 12px;
  }
  .main-img {
    aspect-ratio: 4/3;
  }
  .thumb {
    width: 56px;
    height: 56px;
  }
  .cta {
    width: 100%;
    min-width: 0;
  }
}
@media (max-width: 600px) {
  .thumbs {
    justify-content: center;
  }
  .features li {
    font-size: 0.9rem;
  }
}
</style>
