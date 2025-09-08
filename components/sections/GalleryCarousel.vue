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

<style scoped>
/* -------- layout general -------- */
.gc {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 16px 32px;
}
.gc__head {
  text-align: center;
  margin-bottom: 24px;
}
.gc__title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  line-height: 1.1;
}
.gc__underline {
  width: 80px;
  height: 4px;
  background: #2563eb;
  border-radius: 999px;
  margin: 10px auto 0;
}
.gc__subtitle {
  color: #6b7280;
  margin-top: 10px;
  font-size: clamp(14px, 2.2vw, 18px);
}

/* -------- stage / carrusel -------- */
.gc__stage {
  position: relative;
}
.gc__viewport {
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}
.gc__track {
  display: flex;
  transition: transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}
.gc__slide {
  position: relative;
  min-width: 100%;
  height: clamp(360px, 55vw, 520px);
}
.gc__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.gc__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 30%,
    rgba(0, 0, 0, 0.55) 100%
  );
  pointer-events: none;
  border-radius: 20px;
}
.gc__content {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 22px;
  color: #fff;
  display: grid;
  gap: 10px;
  max-width: 760px;
}
.gc__badge {
  display: inline-block;
  font-weight: 10px;
  font-size: 15px;
  width: 30px;
  letter-spacing: 0.3px;
  background: #1d4ed8;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
}
.gc__heading {
  font-size: clamp(18px, 2.4vw, 28px);
  font-weight: 800;
  line-height: 1.2;
}
.gc__desc {
  font-size: clamp(13px, 1.8vw, 16px);
  color: rgba(255, 255, 255, 0.95);
}

/* -------- navegación -------- */
.gc__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  display: grid;
  place-items: center;
  font-size: 28px;
  line-height: 0;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
  z-index: 2;
}
.gc__nav:hover {
  transform: translateY(-50%) scale(1.05);
  background: #fff;
}
.gc__nav--left {
  left: 12px;
}
.gc__nav--right {
  right: 12px;
}

/* -------- dots -------- */
.gc__dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 14px 0 8px;
}
.gc__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #d1d5db;
  border: none;
  cursor: pointer;
}
.gc__dot--active {
  width: 24px;
  background: #2563eb;
}

/* -------- thumbs (desktop) -------- */
.gc__thumbs {
  display: grid;
  grid-auto-flow: column;
  gap: 14px;
  overflow-x: auto;
  padding: 12px 2px 8px;
  margin-top: 2px;
}
.gc__thumb {
  position: relative;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  min-width: 150px;
  height: 80px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  background: #fff;
}
.gc__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.gc__thumbYear {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  text-align: center;
  white-space: nowrap;
}


.gc__thumb--active {
  outline: 3px solid #2563eb;
}

/* -------- métricas -------- */
.gc__stats {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  text-align: center;
}

.gc__statNumber {
  color: #1d4ed8;
  font-size: 1.8rem;
  font-weight: bold;
}

.gc__statLabel {
  color: #555;
  font-size: 0.95rem;
}
/* -------- responsive -------- */
@media (max-width: 1024px) {
  .gc__thumbs {
    display: none;
  }
}
@media (max-width: 640px) {
  .gc {
    padding-top: 36px;
  }
  .gc__viewport {
    border-radius: 22px;
  }
  .gc__slide {
    height: 64vh;
    max-height: 520px;
  }
  .gc__nav {
    width: 40px;
    height: 40px;
    font-size: 26px;
  }
  
}
</style>
