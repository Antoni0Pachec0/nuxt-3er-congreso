<template>
  <section class="gc">
    <header class="gc__head fade-in-section">
      <h2 class="gc__title">Galería de Recuerdos</h2>
      <div class="gc__underline"></div>
      <p class="gc__subtitle">
        Revive las experiencias, aprendizajes y momentos que nos impulsan a
        seguir innovando.
      </p>
    </header>

    <div class="gc__stage fade-in-section">
      <button class="gc__nav gc__nav--left" @click="prev" aria-label="Anterior">
        ‹
      </button>
      <div class="gc__viewport">
        <div class="gc__track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <article v-for="(slide, i) in slides" :key="i" class="gc__slide" :aria-hidden="i !== currentIndex">
            <img class="gc__img" :src="slide.image" :alt="slide.title" />
            <div class="gc__overlay"></div>
            <div class="gc__content">
              <span class="gc__badge">{{ slide.year }}</span>
              <h3 class="gc__heading">{{ slide.title }}</h3>
              <p class="gc__desc">{{ slide.description }}</p>
            </div>
          </article>
        </div>
      </div>
      <button class="gc__nav gc__nav--right" @click="next" aria-label="Siguiente">
        ›
      </button>
    </div>

    <div class="gc__dots fade-in-section" role="tablist" aria-label="Indicadores de carrusel">
      <button v-for="(slide, i) in slides" :key="'dot-' + i" class="gc__dot"
        :class="{ 'gc__dot--active': i === currentIndex }" @click="goTo(i)" :aria-label="`Ir a la diapositiva ${i + 1}`"
        :aria-selected="i === currentIndex" role="tab" />
    </div>

    <div class="gc__thumbs fade-in-section">
      <button v-for="(slide, i) in slides" :key="'thumb-' + i" class="gc__thumb"
        :class="{ 'gc__thumb--active': i === currentIndex }" @click="goTo(i)">
        <img :src="slide.thumb || slide.image" :alt="`Miniatura ${i + 1}`" />
        <span class="gc__thumbYear">{{ slide.year }}</span>
      </button>
    </div>

    <div class="gc__stats fade-in-section">
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
let timer: number | null = null;

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

onMounted(() => {
  // --- Lógica para la animación al hacer scroll ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  const sectionsToAnimate = document.querySelectorAll(".fade-in-section");
  sectionsToAnimate.forEach((section) => {
    observer.observe(section);
  });
  // --- Fin de la lógica de animación ---

  // Se mantiene la funcionalidad original del carrusel
  startAutoplay();
});

onBeforeUnmount(stopAutoplay);

watch(
  () => props.autoplay,
  (v) => (v ? startAutoplay() : stopAutoplay())
);
</script>