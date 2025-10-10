<template>
  <section class="collection" id="productos">
    <v-container class="py-12">
      <!-- Encabezado -->
      <header class="text-center mb-8">
        <h2 class="font-orbitron text-h4 text-md-h3 font-weight-black mb-2">
          Colección Completa
        </h2>
        <div class="faq__underline"></div>

        <p class="text-medium-emphasis text-body-2 text-md-body-1">
          Explora productos oficiales del Congreso TI: calidad, estilo y
          espíritu tech.
        </p>
      </header>

      <!-- Filtros -->
      <div class="d-flex flex-wrap justify-center gap-2 mb-8">
        <v-chip-group
          v-model="activeCategory"
          selected-class="chip-active"
          class="filter-group"
          mandatory
        >
          <v-chip value="all" variant="text" class="chip-item">
            <Grid :size="18" stroke-width="1.5" class="mr-2" />
            <span>Todos</span>
          </v-chip>

          <v-chip value="playera" variant="text" class="chip-item">
            <Shirt :size="18" stroke-width="1.5" class="mr-2" />
            <span>Playeras</span>
          </v-chip>

          <v-chip value="termo" variant="text" class="chip-item">
            <BottleWine :size="18" stroke-width="1.5" class="mr-2" />
            <span>Termos</span>
          </v-chip>
        </v-chip-group>
      </div>

      <!-- Grid -->
      <v-row dense>
        <v-col
          v-for="p in filteredProducts"
          :key="p.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="d-flex"
        >
          <v-card
            variant="flat"
            elevation="0"
            class="product-card d-flex flex-column flex-grow-1"
          >
            <!-- Badge -->
            <div class="card-badges">
              <v-chip
                size="x-small"
                variant="flat"
                color="primary"
                class="text-capitalize"
              >
                {{ p.category }}
              </v-chip>
            </div>

            <!-- Imagen dinámica -->
            <v-img
              :src="getImage(p)"
              :alt="p.title"
              class="media"
              cover
              aspect-ratio="4/3"
            />

            <!-- Contenido -->
            <v-card-item class="pt-4">
              <v-card-title class="name">{{ p.title }}</v-card-title>
              <v-card-subtitle class="desc">
                {{ p.description }}
              </v-card-subtitle>
            </v-card-item>

            <v-card-text class="body">
              <!-- Colores (oculto si solo hay un color) -->
              <div v-if="(p.colors?.length || 0) > 1" class="section-block">
                <div class="label">Colores</div>
                <div class="d-flex align-center flex-wrap gap-4">
                  <button
                    v-for="(c, i) in p.colors"
                    :key="i"
                    class="swatch"
                    :class="{ active: selectedColor[p.id] === c }"
                    :style="{ backgroundColor: c }"
                    @click="selectedColor[p.id] = c"
                  />
                </div>
              </div>

              <!-- Tallas -->
              <div v-if="p.sizes?.length" class="section-block">
                <div class="label">Tallas</div>
                <div class="d-flex flex-wrap gap-3">
                  <button
                    v-for="(s, i) in p.sizes"
                    :key="i"
                    class="size-btn"
                    :class="{ active: selectedSize[p.id] === s }"
                    @click="selectedSize[p.id] = s"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>

              <!-- Precio + stock -->
              <div class="d-flex align-center justify-space-between">
                <div class="price">
                  <span class="amount">${{ p.price }}</span>
                  <span class="curr">MXN</span>
                </div>
                <div :class="p.stock > 0 ? 'stock ok' : 'stock no'">
                  {{ p.stock > 0 ? "Stock disponible" : "Agotado" }}
                </div>
              </div>
            </v-card-text>

            <!-- Footer -->
            <div class="card-footer">
              <v-btn
                variant="outlined"
                rounded="xl"
                :prepend-icon="Eye"
                class="btn-outline-custom"
                @click="onDetails(p)"
              >
                Detalles
              </v-btn>
              <v-btn
                :disabled="p.stock === 0"
                rounded="xl"
                :prepend-icon="ShoppingCart"
                class="btn-solid-custom"
                @click="handleAdd(p)"
              >
                Agregar
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <p class="text-medium-emphasis">
          No hay productos para esta categoría.
        </p>
      </div>
    </v-container>
  </section>

  <!-- Modal Detalles -->
  <ProductDetailsDialog
    v-if="selected"
    v-model="showDialog"
    :product="selected"
    @add-to-cart="onAddToCart"
  />

  <!-- Botón flotante de carrito -->
  <v-btn class="cart-fab" color="primary" @click="showCart = true">
    <ShoppingCart :size="26" />
    <span v-if="cartItems.length" class="badge">{{ cartItems.length }}</span>
  </v-btn>

  <CartDrawer v-model="showCart" v-model:items="cartItems" />

  <CustomAlert
    v-model:show="showAlert"
    :title="alertTitle"
    :message="alertMessage"
    :alertType="alertType"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ProductDetailsDialog from "@/components/sections/store/ProductDetailsDialog.vue";
import CartDrawer from "@/components/sections/store/CartDrawer.vue";
import CustomAlert from "@/components/sections/store/CustomAlert.vue";

import tshirt_app_dev from "~/assets/images/store/t-shirt/tshirt_app_dev.webp";
import tshirt_chrome_dino from "~/assets/images/store/t-shirt/tshirt_chrome_dino.webp";
import tshirt_cisco from "~/assets/images/store/t-shirt/tshirt_cisco.webp";
import tshirt_coffee_code from "~/assets/images/store/t-shirt/tshirt_coffee_code.webp";
import tshirt_github from "~/assets/images/store/t-shirt/tshirt_github.webp";
import tshirt_html from "~/assets/images/store/t-shirt/tshirt_html.webp";
import tshirt_kali from "~/assets/images/store/t-shirt/tshirt_kali.webp";
import tshirt_miku_coding from "~/assets/images/store/t-shirt/tshirt_miku_coding.webp";

import { Grid, Shirt, Eye, ShoppingCart, BottleWine } from "lucide-vue-next";

type Product = {
  id: number;
  title: string;
  description: string;
  category: "playera" | "termo";
  price: number;
  stock: number;
  colors: string[];
  sizes?: string[];
  imagesByColor: Record<string, string>;
};

// Selección de color y talla
const selectedSize = ref<Record<number, string>>({});
const selectedColor = ref<Record<number, string>>({});

// ALERTAS
const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref<"success" | "error" | "info" | "warning">("info");
const alertTitle = ref<string | undefined>(undefined);

// Productos (SOLO NEGRO)
const products = ref<Product[]>([
  {
    id: 1,
    title: "Playera App Dev Studio (Negro)",
    description:
      "Algodón premium, corte unisex. Inspirada en desarrollo de apps.",
    category: "playera",
    price: 450,
    stock: 20,
    colors: ["#000000"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: { "#000000": tshirt_app_dev },
  },
  {
    id: 2,
    title: "Playera Chrome Dino Offline (Negro)",
    description: "El clásico dino runner para cuando no hay internet.",
    category: "playera",
    price: 450,
    stock: 18,
    colors: ["#000000"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: { "#000000": tshirt_chrome_dino },
  },
  {
    id: 3,
    title: "Playera Cisco Networking (Negro)",
    description: "Redes, routing y switching con estilo.",
    category: "playera",
    price: 450,
    stock: 15,
    colors: ["#000000"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: { "#000000": tshirt_cisco },
  },
  {
    id: 4,
    title: "Playera Coffee • Code • Repeat (Negro)",
    description: "Cafeína y código: la dupla perfecta.",
    category: "playera",
    price: 450,
    stock: 22,
    colors: ["#000000"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: { "#000000": tshirt_coffee_code },
  },
  {
    id: 5,
    title: "Playera GitHub OctoDev (Negro)",
    description: "Commits con flow para tu outfit.",
    category: "playera",
    price: 450,
    stock: 17,
    colors: ["#000000"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: { "#000000": tshirt_github },
  },
  {
    id: 6,
    title: "Playera HTML Markup (Negro)",
    description: "<header>Tu estilo</header> en todas partes.",
    category: "playera",
    price: 450,
    stock: 25,
    colors: ["#000000"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: { "#000000": tshirt_html },
  },
  {
    id: 7,
    title: "Playera Kali Pentesting (Negro)",
    description: "Para entornos de hacking ético y pentesting.",
    category: "playera",
    price: 450,
    stock: 14,
    colors: ["#000000"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: { "#000000": tshirt_kali },
  },
  {
    id: 8,
    title: "Playera Miku Coding Session (Negro)",
    description: "Vibes de código con estilo idol.",
    category: "playera",
    price: 450,
    stock: 16,
    colors: ["#000000"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: { "#000000": tshirt_miku_coding },
  },
]);

// Asignar color negro por defecto al montar
onMounted(() => {
  products.value.forEach((p) => {
    selectedColor.value[p.id] = p.colors?.[0] || "#000000";
  });
});

// Filtro categoría
const activeCategory = ref<"all" | "playera" | "termo">("all");
const filteredProducts = computed(() =>
  activeCategory.value === "all"
    ? products.value
    : products.value.filter((p) => p.category === activeCategory.value)
);

// Imagen por color seleccionado
function getImage(p: Product) {
  const color = selectedColor.value[p.id];
  return color ? p.imagesByColor[color] : Object.values(p.imagesByColor)[0];
}

// --- Modal de detalles ---
const showDialog = ref(false);
const selected = ref<Product | null>(null);
function onDetails(p: Product) {
  selected.value = p;
  showDialog.value = true;
}

// --- Carrito ---
const showCart = ref(false);
const cartItems = ref<any[]>([]);

function onAddToCart(payload: {
  productId: number;
  color: string | null;
  size: string | null;
  qty: number;
  unitPrice: number;
}) {
  const product = products.value.find((p) => p.id === payload.productId);
  if (!product) return;

  cartItems.value.push({
    product,
    color: payload.color,
    size: payload.size,
    qty: payload.qty,
    unitPrice: payload.unitPrice,
    image: payload.color
      ? product.imagesByColor[payload.color]
      : Object.values(product.imagesByColor)[0],
  });

  showCart.value = true;
}

// --- Agregar al carrito con alertas ---
function handleAdd(p: Product) {
  const color = selectedColor.value[p.id] || p.colors?.[0] || null;
  const size = selectedSize.value[p.id] || null;

  if (p.category === "playera") {
    if ((p.sizes?.length || 0) > 0 && !size) {
      alertMessage.value = "⚠️ Selecciona una talla antes de agregar.";
      alertType.value = "warning";
      showAlert.value = true;
      return;
    }
  }

  onAddToCart({
    productId: p.id,
    color,
    size,
    qty: 1,
    unitPrice: p.price,
  });

  alertMessage.value = "✔️ Producto agregado al carrito";
  alertType.value = "success";
  showAlert.value = true;
}
</script>

<style scoped>
/* ====== TOKENS AISLADOS AL CONTENEDOR (funcionan con scoped) ====== */
.collection {
  --g1: #1e66ff;
  --g2: #1ca2ff;
  --card-br: rgba(30, 102, 255, 0.14);
  --shadow: 0 10px 30px rgba(11, 26, 66, 0.12);
}

/* Encabezado */
.underline {
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, var(--g1), var(--g2));
  border-radius: 999px;
}

/* ====== CARD ====== */
.product-card {
  border-radius: 20px;
  border: 1px solid var(--card-br);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92),
    rgba(255, 255, 255, 0.98)
  );
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  display: flex;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 38px rgba(11, 26, 66, 0.18);
  border-color: rgba(30, 102, 255, 0.28);
}

/* badge */
.card-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

/* media */
.media {
  border-bottom: 1px solid rgba(30, 102, 255, 0.08);
}

/* texto */
.name {
  font-size: 1.05rem;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.desc {
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.62) !important;
}
.body {
  padding-top: 6px !important;
}

/* etiquetas */
.label {
  font-size: 0.78rem;
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 4px;
}

/* Swatches (colores) — UNA SOLA DEFINICIÓN */
.swatch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  outline: 2px solid transparent;
  transition: all 0.25s ease;
  margin: 4px;
}
.swatch:hover {
  outline-color: rgba(30, 102, 255, 0.25);
  transform: scale(1.05);
}
.swatch.active {
  outline-color: #2563eb;
  transform: scale(1.15);
}

/* Botones de tallas */
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

/* precio + stock */
.price {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}
.amount {
  font-weight: 800;
  font-size: 1.15rem;
}
.curr {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
}
.stock.ok {
  color: #12b886;
  font-size: 0.78rem;
}
.stock.no {
  color: #e03131;
  font-size: 0.78rem;
}

/* ====== footer anclado (botones alineados SIEMPRE) ====== */
.card-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 14px 16px 18px;
  margin-top: auto;
  border-top: 1px solid rgba(30, 102, 255, 0.08);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0.9)
  );
}
/* Botón outline con gradiente */
.btn-outline-custom {
  justify-content: center;
  font-weight: 600;
  border-radius: 999px !important;
  padding: 0 30px;
  height: 46px;
  text-transform: none;
  border: 2px solid transparent;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(90deg, #2563eb, #1ca2ff);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: #2563eb !important;
  transition: all 0.25s ease;
}
.btn-outline-custom:hover {
  background-image: linear-gradient(90deg, #2563eb, #1ca2ff);
  color: #fff !important;
}

/* Botón sólido primario */
.btn-solid-custom {
  justify-content: center;
  font-weight: 600;
  border-radius: 999px !important;
  padding: 0 24px;
  height: 46px;
  text-transform: none;
  background: linear-gradient(90deg, #2563eb, #1ca2ff);
  color: #fff !important;
  transition: all 0.25s ease;
}
.btn-solid-custom:hover {
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
  transform: translateY(-2px);
}

/* ====== FILTROS (Vuetify) ====== */
.filter-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

/* chips base */
.filter-group :deep(.v-chip) {
  border-radius: 999px;
  background: transparent !important;
  color: #6b7280 !important;
  justify-content: center;
  gap: 8px;
  min-width: 150px;
  font-weight: 600;
  padding-inline: 14px;
  font-size: 14px;
}
/* hover */
.filter-group :deep(.v-chip:hover) {
  color: #4b5563 !important;
}
.filter-group :deep(.v-chip:hover .v-icon) {
  color: #6b7280 !important;
}
/* seleccionado */
.filter-group :deep(.v-chip.chip-active) {
  background: linear-gradient(90deg, #153885, #3473ff) !important;
  color: #fff !important;
}
.filter-group :deep(.v-chip.chip-active .v-icon) {
  color: #ffffff !important;
}

/* ====== responsive ====== */
@media (max-width: 599.98px) {
  .card-footer {
    grid-template-columns: 1fr;
  }
  .media {
    aspect-ratio: 16/10;
  }
}
@media (min-width: 1280px) {
  .amount {
    font-size: 1.25rem;
  }
}

/* Ajustes móviles para chips */
@media (max-width: 767px) {
  .filter-group {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .filter-group :deep(.v-chip) {
    min-width: 100px;
    font-size: 12px;
    padding: 4px 10px;
  }
}
@media (max-width: 320px) {
  .filter-group {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .filter-group :deep(.v-chip) {
    min-width: 80px;
    font-size: 10px;
    padding: 4px 8px;
  }
}

/* FAB Carrito */
.cart-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10000;
  width: 64px;
  height: 64px;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

/* Badge con contador */
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #100c0c;
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
}
</style>
