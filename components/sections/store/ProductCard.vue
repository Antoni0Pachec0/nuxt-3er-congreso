<template>
  <section class="collection">
    <v-container class="py-12">
      <!-- Encabezado -->
      <header class="text-center mb-8">
        <h2 class="font-orbitron text-h4 text-md-h3 font-weight-black mb-2">
          Colección Completa
        </h2>
        <div class="underline mx-auto mb-4"></div>
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
          <v-card class="product-card d-flex flex-column flex-grow-1">
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
              <v-card-subtitle class="desc">{{
                p.description
              }}</v-card-subtitle>
            </v-card-item>

            <v-card-text class="body">
              <!-- Colores -->
              <div class="section-block">
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
                @click="onBuy(p)"
              >
                Comprar
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

  
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ProductDetailsDialog from "@/components/sections/store/ProductDetailsDialog.vue";
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
const selectedSize = ref<Record<number, string>>({})



const products = ref<Product[]>([
  {
    id: 1,
    title: "Playera Oficial TechCongress 2024",
    description: "Algodón premium, corte unisex",
    category: "playera",
    price: 450,
    stock: 20,
    colors: ["#000000", "#1d4ed8", "#ffffff"], // negro, azul, blanco
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imagesByColor: {
      "#000000": "https://picsum.photos/seed/shirt-black/800/600",
      "#1d4ed8": "https://picsum.photos/seed/shirt-blue/800/600",
      "#ffffff": "https://picsum.photos/seed/shirt-white/800/600",
    },
  },
  {
    id: 2,
    title: "Playera DevOps Excellence",
    description: "Para amantes de pipelines y cloud",
    category: "playera",
    price: 480,
    stock: 12,
    colors: ["#000000", "#1d4ed8", "#ffffff"],
    sizes: ["S", "M", "L", "XL"],
    imagesByColor: {
      "#000000": "https://picsum.photos/seed/devops-black/800/600",
      "#1d4ed8": "https://picsum.photos/seed/devops-blue/800/600",
      "#ffffff": "https://picsum.photos/seed/devops-white/800/600",
    },
  },
  {
    id: 3,
    title: "Termo Acero 600ml",
    description: "12h caliente / 24h frío",
    category: "termo",
    price: 380,
    stock: 25,
    colors: ["#111827", "#2563eb", "#0ea5e9"],
    imagesByColor: {
      "#111827": "https://picsum.photos/seed/bottle-black/800/600",
      "#2563eb": "https://picsum.photos/seed/bottle-blue/800/600",
      "#0ea5e9": "https://picsum.photos/seed/bottle-cyan/800/600",
    },
  },
]);

const activeCategory = ref<"all" | "playera" | "termo">("all");
const filteredProducts = computed(() =>
  activeCategory.value === "all"
    ? products.value
    : products.value.filter((p) => p.category === activeCategory.value)
);

const selectedColor = ref<Record<number, string>>({});

function getImage(p: Product) {
  const color = selectedColor.value[p.id];
  return color ? p.imagesByColor[color] : Object.values(p.imagesByColor)[0];
}

const showDialog = ref(false);
const selected = ref<Product | null>(null);

function onDetails(p: Product) {
  selected.value = p;
  showDialog.value = true;
}
function onBuy(p: Product) {
  onDetails(p);
}

type AddToCartPayload = {
  productId: number;
  color: string | null;
  size: string | null;
  qty: number;
  unitPrice: number;
};
function onAddToCart(payload: AddToCartPayload) {
  console.log("Add to cart:", payload);
}


</script>

<style scoped>
/* swatches */
.swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  outline: 2px solid transparent;
  transition: all 0.2s ease;
  margin: 4px;

}
.swatch.active {
  outline-color: #2563eb;
  transform: scale(1.1);
}

/* ====== tokens rápidos ====== */
:root {
  --g1: #1e66ff;
  --g2: #1ca2ff;
  --card-br: rgba(30, 102, 255, 0.14);
  --shadow: 0 10px 30px rgba(11, 26, 66, 0.12);
}

/* Encabezado */
.font-orbitron {
  font-family: "Orbitron", system-ui, sans-serif;
}
.underline {
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, var(--g1), var(--g2));
  border-radius: 999px;
}

/* Chips filtro */
.filter-group :deep(.v-chip) {
  border-radius: 999px;
}
.filter-group :deep(.v-chip.chip-active) {
  color: #fff !important;
  background: linear-gradient(90deg, var(--g1), var(--g2)) !important;
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
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    border-color 0.25s ease;
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

/* Contenedor centrado (opcional si ya lo tienes) */
.filters {
  justify-content: center;
}

/* Base: chips sin fondo, texto+icono grises y contenido centrado */
.filter-group :deep(.v-chip) {
  border-radius: 999px;
  background: transparent !important; /* sin fondo cuando NO está seleccionado */
  color: #6b7280 !important; /* gris texto */
  justify-content: center; /* centra icono + texto */
  gap: 8px; /* espacio entre icono y texto */
  min-width: 150px; /* ancho parejo */
  font-weight: 600;
  padding-inline: 14px;
}
.filter-group :deep(.v-chip .v-icon) {
  color: #9ca3af !important; /* gris icono */
}

/* Hover en no-seleccionado (sutil) */
.filter-group :deep(.v-chip:hover) {
  color: #4b5563 !important; /* un gris un poco más oscuro */
}
.filter-group :deep(.v-chip:hover .v-icon) {
  color: #6b7280 !important;
}

/* Seleccionado: degradado + texto/icono blancos */
.filter-group :deep(.v-chip.chip-active) {
  background: linear-gradient(90deg, #153885, #3473ff) !important;
  color: #fff !important;
}
.filter-group :deep(.v-chip.chip-active .v-icon) {
  color: #ffffff !important;
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
.more {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
}

/* swatches */
.swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: 3px solid rgba(0, 0, 0, 0);
  transition: outline-color 0.2s ease, transform 0.2s ease;
}
.swatch:hover {
  outline-color: rgba(30, 102, 255, 0.25);
  transform: scale(1.05);
}

/* tallas */
.size-chip {
  border-radius: 10px;
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
  margin-top: auto; /* <- empuja footer al fondo */
  border-top: 1px solid rgba(30, 102, 255, 0.08);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.6),
    rgba(255, 255, 255, 0.9)
  );
}
/* Botón outline con gradiente */
.btn-outline-custom {
  justify-content: center; /* centra texto + icono */
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

/* Bloques separados */
.section-block {
  margin-bottom: 20px; /* más aire entre secciones */
}

/* Swatches (colores) */
.swatch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  outline: 2px solid transparent;
  transition: all 0.25s ease;
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
  border: 1.5px solid rgba(0,0,0,0.2);
  background: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  margin: 4px;
}
.size-btn:hover {
  background: rgba(37,99,235,0.08);
}
.size-btn.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
  transform: translateY(-2px);
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
</style>
