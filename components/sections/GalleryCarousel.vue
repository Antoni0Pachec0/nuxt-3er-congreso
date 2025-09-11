<!-- components/sections/GalleryCarousel.vue -->
<template>
  <section class="gc">
    <!-- Título -->
    <header class="gc__head">
      <h2 class="gc__title">Galería de Recuerdos</h2>
      <div class="gc__underline"></div>
      <p class="gc__subtitle">
        Revive las experiencias, aprendizajes y momentos que nos impulsan a
        seguir innovando.
      </p>
    </header>

    <!-- Carrusel principal -->
    <div class="gc__stage">
      <button class="gc__nav gc__nav--left" @click="prev" aria-label="Anterior">
        ‹
      </button>

      <div
        class="gc__viewport"
        @touchstart="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div
          class="gc__track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          @transitionend="onTransitionEnd"
        >
          <article
            v-for="(slide, i) in slides"
            :key="i"
            class="gc__slide"
            :aria-hidden="i !== currentIndex"
          >
            <img class="gc__img" :src="slide.image" :alt="slide.title" />
            <div class="gc__overlay"></div>

            <!-- Contenido overlay (abajo izquierda) -->
            <div class="gc__content">
              <span class="gc__badge">{{ slide.year }}</span>
              <h3 class="gc__heading">{{ slide.title }}</h3>
              <p class="gc__desc">{{ slide.description }}</p>
            </div>
          </article>
        </div>
      </div>

      <button
        class="gc__nav gc__nav--right"
        @click="next"
        aria-label="Siguiente"
      >
        ›
      </button>
    </div>

    <!-- Dots -->
    <div class="gc__dots" role="tablist" aria-label="Indicadores de carrusel">
      <button
        v-for="(slide, i) in slides"
        :key="'dot-' + i"
        class="gc__dot"
        :class="{ 'gc__dot--active': i === currentIndex }"
        @click="goTo(i)"
        :aria-label="`Ir a la diapositiva ${i + 1}`"
        :aria-selected="i === currentIndex"
        role="tab"
      />
    </div>

    <!-- Miniaturas (solo desktop) -->
    <div class="gc__thumbs">
      <button
        v-for="(slide, i) in slides"
        :key="'thumb-' + i"
        class="gc__thumb"
        :class="{ 'gc__thumb--active': i === currentIndex }"
        @click="goTo(i)"
      >
        <img :src="slide.thumb || slide.image" :alt="`Miniatura ${i + 1}`" />
        <span class="gc__thumbYear">{{ slide.year }}</span>
      </button>
    </div>

    <!-- Métricas -->
    <div class="gc__stats">
      <div v-for="(s, i) in stats" :key="'stat-' + i">
        <div class="gc__statNumber">{{ s.number }}</div>
        <div class="gc__statLabel">{{ s.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import "/assets/css/carousel.css";

type Slide = {
  image: string;
  thumb?: string;
  year: string | number;
  title: string;
  description: string;
};

type Stat = { number: string; label: string };

const props = withDefaults(
  defineProps<{
    slides: Slide[];
    stats?: Stat[];
    autoplay?: boolean;
    intervalMs?: number;
  }>(),
  {
    stats: () => [
      { number: "8+", label: "Años de Historia" },
      { number: "150+", label: "Ponentes" },
      { number: "2500+", label: "Participantes" },
      { number: "25+", label: "Países" },
    ],
    autoplay: true,
    intervalMs: 5000,
  }
);

const currentIndex = ref(0);
const trackEl = ref<HTMLElement | null>(null);
let timer: number | null = null;

// Swipe (touch)
const touchStartX = ref(0);
const deltaX = ref(0);
const isDragging = ref(false);

function goTo(i: number) {
  currentIndex.value = (i + props.slides.length) % props.slides.length;
}

function next() {
  goTo(currentIndex.value + 1);
}

function prev() {
  goTo(currentIndex.value - 1);
}

function startAutoplay() {
  if (!props.autoplay) return;
  stopAutoplay();
  timer = window.setInterval(next, props.intervalMs);
}
function stopAutoplay() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function onTouchStart(e: TouchEvent) {
  stopAutoplay();
  isDragging.value = true;
  touchStartX.value = e.touches[0].clientX;
  deltaX.value = 0;
}
function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return;
  deltaX.value = e.touches[0].clientX - touchStartX.value;
  const track = (e.currentTarget as HTMLElement).querySelector(
    ".gc__track"
  ) as HTMLElement;
  if (track) {
    track.style.transition = "none";
    track.style.transform = `translateX(calc(${
      -currentIndex.value * 100
    }% + ${-deltaX.value}px))`;
  }
}
function onTouchEnd(e: TouchEvent) {
  const threshold = 50; // px
  const track = (e.currentTarget as HTMLElement).querySelector(
    ".gc__track"
  ) as HTMLElement;
  if (track) track.style.transition = "";
  isDragging.value = false;
  if (Math.abs(deltaX.value) > threshold) {
    deltaX.value < 0 ? next() : prev();
  } else {
    // volver a su lugar
    goTo(currentIndex.value);
  }
  startAutoplay();
}

function onTransitionEnd() {
  // hook si necesitas lazy-load u otros efectos
}

onMounted(startAutoplay);
onBeforeUnmount(stopAutoplay);
watch(
  () => props.autoplay,
  (v) => (v ? startAutoplay() : stopAutoplay())
);
</script>


