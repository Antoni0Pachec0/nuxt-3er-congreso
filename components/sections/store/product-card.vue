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

      <!-- Filtros 
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
      </div>-->

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
import ProductDetailsDialog from "@/components/sections/store/product-details-dialog.vue";

import CartDrawer from "@/components/sections/store/cart-drawer.vue";
import CustomAlert from "@/components/sections/store/custom-alert.vue";

import tshirt_app_dev from "@/assets/img/pages/store/t-shirt/tshirt-app-dev.webp";
import tshirt_chrome_dino from "@/assets/img/pages/store/t-shirt/tshirt-chrome-dino.webp";
import tshirt_cisco from "@/assets/img/pages/store/t-shirt/tshirt-cisco.webp";
import tshirt_coffee_code from "@/assets/img/pages/store/t-shirt/tshirt-coffee-code.webp";
import tshirt_github from "@/assets/img/pages/store/t-shirt/tshirt-github.webp";
import tshirt_html from "@/assets/img/pages/store/t-shirt/tshirt-html.webp";
import tshirt_kali from "@/assets/img/pages/store/t-shirt/tshirt-kali.webp";
import tshirt_miku_coding from "@/assets/img/pages/store/t-shirt/tshirt-miku-coding.webp";

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
<style scoped src="@/assets/css/styles/pages/store/product-card.css"></style>