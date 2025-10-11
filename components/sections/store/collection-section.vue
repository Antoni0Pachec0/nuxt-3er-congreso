<template>
  <section class="collection">
    <v-container class="py-12">
      <!-- Título + subtítulo -->
      <header class="text-center mb-8">
        <h2 class="font-orbitron text-h4 text-md-h3 font-weight-black mb-2">
          Colección Completa
        </h2>
        <div class="underline mx-auto mb-4"></div>
        <p class="text-medium-emphasis text-body-2 text-md-body-1">
          Descubre nuestra colección exclusiva de productos del Congreso 2025.
          Diseñados para estudiantes y profesionales de Desarrollo de Software, Redes,
          Ciberseguridad e Innovación Digital que buscan calidad y estilo.
        </p>
      </header>

      <!-- Filtros -->
      <div class="d-flex flex-wrap justify-center gap-2 mb-8">
        <v-chip-group
          v-model="activeCategory"
          selected-class="chip-active"
          class="filter-group"
          mandatory
          variant="elevated"
        >
          <v-chip value="all" prepend-icon="mdi-shape">Todos los Productos</v-chip>
          <v-chip value="playera" prepend-icon="mdi-tshirt-crew">Playeras</v-chip>
          <v-chip value="termo" prepend-icon="mdi-bottle-tonic">Termos</v-chip>
        </v-chip-group>
      </div>

      <!-- Grid productos -->
      <v-row dense>
        <v-col
          v-for="(p, i) in filteredProducts"
          :key="p.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="d-flex"
        >
          <v-card class="product-card flex-grow-1">
            <!-- Badge categoría -->
            <div class="card-badges">
              <v-chip size="x-small" variant="flat" color="primary" class="text-capitalize">
                {{ p.category }}
              </v-chip>
            </div>

            <!-- Imagen -->
            <v-img
              :src="p.image"
              :alt="p.title"
              height="220"
              cover
              class="rounded-lg"
            />

            <v-card-item class="pt-4">
              <v-card-title class="text-h6 mb-1">{{ p.title }}</v-card-title>
              <v-card-subtitle class="text-body-2 text-medium-emphasis">
                {{ p.description }}
              </v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <!-- Colores -->
              <div class="mb-3">
                <div class="label text-medium-emphasis mb-1">Colores disponibles</div>
                <div class="d-flex align-center gap-2">
                  <button
                    v-for="(c, idx) in p.colors"
                    :key="idx"
                    class="swatch"
                    :style="{ backgroundColor: c }"
                    :aria-label="`Color ${c}`"
                  />
                  <span
                    v-if="p.colors.length > 4"
                    class="text-caption text-medium-emphasis ms-1"
                  >+{{ p.colors.length - 4 }} más</span>
                </div>
              </div>

              <!-- Tallas (si aplica) -->
              <div v-if="p.sizes?.length" class="mb-4">
                <div class="label text-medium-emphasis mb-1">Tallas disponibles</div>
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    v-for="(s, idx) in limitedSizes(p.sizes)"
                    :key="idx"
                    size="small"
                    variant="outlined"
                    class="size-chip"
                  >{{ s }}</v-chip>
                  <span
                    v-if="p.sizes.length > maxSizes"
                    class="text-caption text-medium-emphasis"
                  >+{{ p.sizes.length - maxSizes }} más</span>
                </div>
              </div>

              <!-- Precio + stock -->
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="price">
                  <span class="text-h6 font-weight-bold">${{ p.price }}</span>
                  <span class="text-caption ms-1">MXN</span>
                </div>
                <div
                  class="text-caption"
                  :class="p.stock > 0 ? 'text-success' : 'text-error'"
                >
                  {{ p.stock > 0 ? 'Stock disponible' : 'Agotado' }}
                </div>
              </div>

              <!-- Acciones -->
              <div class="d-flex gap-2">
                <v-btn
                  variant="outlined"
                  block
                  append-icon="mdi-chevron-right"
                  @click="onDetails(p)"
                >
                  Ver Detalles
                </v-btn>
                <v-btn
                  :disabled="p.stock === 0"
                  color="primary"
                  block
                  append-icon="mdi-cart-outline"
                  @click="onBuy(p)"
                >
                  Comprar
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Vacío -->
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <p class="text-medium-emphasis">No hay productos para esta categoría.</p>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import "/assets/css/styles/store/CollectionSection.css";

import { computed, ref } from 'vue'

// Demo: reemplaza con tus datos reales
type Product = {
  id: number
  title: string
  description: string
  category: 'playera' | 'termo'
  price: number
  stock: number
  image: string
  colors: string[]
  sizes?: string[]
}

const products = ref<Product[]>([
  {
    id: 1,
    title: 'Playera Oficial TechCongress 2024',
    description: 'Playera oficial del congreso con diseño exclusivo en algodón',
    category: 'playera',
    price: 450,
    stock: 20,
    image: 'https://picsum.photos/seed/shirt1/600/400',
    colors: ['#1d4ed8', '#0ea5e9', '#111827'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 2,
    title: 'Playera DevOps Excellence',
    description: 'Diseño exclusivo para los amantes de DevOps. Tela suave y resistente',
    category: 'playera',
    price: 480,
    stock: 12,
    image: 'https://picsum.photos/seed/shirt2/600/400',
    colors: ['#0ea5e9', '#3b82f6', '#374151', '#111827', '#60a5fa'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    title: 'Playera Full Stack Developer',
    description: 'Para los desarrolladores completos. Incluye íconos de tecnologías',
    category: 'playera',
    price: 520,
    stock: 8,
    image: 'https://picsum.photos/seed/shirt3/600/400',
    colors: ['#1e40af', '#1d4ed8', '#0f172a'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  },
  {
    id: 4,
    title: 'Playera Código Hex #0000FF',
    description: 'Diseño único inspirado en el color azul digital',
    category: 'playera',
    price: 450,
    stock: 15,
    image: 'https://picsum.photos/seed/shirt4/600/400',
    colors: ['#0000ff', '#0f172a', '#1f2937'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 5,
    title: 'Termo TechCongress Acero 600ml',
    description: 'Acero inoxidable, conserva temperatura 12h/24h frío',
    category: 'termo',
    price: 380,
    stock: 25,
    image: 'https://picsum.photos/seed/bottle1/600/400',
    colors: ['#111827', '#2563eb', '#0ea5e9'],
  },
])

const activeCategory = ref<'all' | 'playera' | 'termo'>('all')
const maxSizes = 5

const filteredProducts = computed(() =>
  activeCategory.value === 'all'
    ? products.value
    : products.value.filter(p => p.category === activeCategory.value),
)

function limitedSizes(sizes: string[]) {
  return sizes.slice(0, maxSizes)
}

// Eventos (conéctalos a tu router, modal o flujo de compra)
function onDetails(p: Product) {
  // ej: router.push({ name: 'product', params: { id: p.id } })
  console.log('Detalles de', p.title)
}
function onBuy(p: Product) {
  // ej: emitir al padre para abrir checkout
  console.log('Comprar', p.title)
}
</script>

