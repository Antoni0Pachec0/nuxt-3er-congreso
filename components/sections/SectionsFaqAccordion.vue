<!-- components/sections/FaqAccordion.vue -->
<template>
  <section class="faq fade-in-section">
    <header class="faq__head">
      <h2 class="faq__title">Preguntas Frecuentes</h2>
      <div class="faq__underline"></div>
    </header>

    <div class="faq__list" role="list">
      <article
        v-for="(item, i) in items"
        :key="i"
        class="faq__item"
        :class="{ 'faq__item--open': isOpen(i) }"
        role="listitem"
      >
        <!-- Botón cabecera -->
        <button
          class="faq__btn"
          :aria-expanded="isOpen(i) ? 'true' : 'false'"
          :aria-controls="`faq-panel-${i}`"
          @click="toggle(i)"
          @keydown.enter.prevent="toggle(i)"
          @keydown.space.prevent="toggle(i)"
        >
          <span class="faq__pill">
            <span
              class="faq__icon faq__icon--circle faq__icon--blue"
              aria-hidden="true"
            >
              <svg-icon type="mdi" :path="item.icon"></svg-icon>
            </span>
          </span>
          <span class="faq__q">{{ item.q }}</span>
          <span class="faq__chev" :class="{ 'faq__chev--open': isOpen(i) }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="h-5 w-5 text-gray-600 transition-transform duration-300"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>

        <transition name="faq-collapse">
          <div
            v-show="isOpen(i)"
            :id="`faq-panel-${i}`"
            class="faq__panel"
            role="region"
            :aria-labelledby="`faq-btn-${i}`"
          >
            <p class="faq__a" v-html="item.a"></p>
          </div>
        </transition>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "/assets/css/FAQuestions.css";
import SvgIcon from "@jamescoyle/vue-icon";

type FaqItem = {
  q: string;
  a: string; // puedes usar HTML simple (links, <strong>, etc.)
  icon?: string; // SVG inline opcional
};

const props = withDefaults(
  defineProps<{
    items: FaqItem[];
    singleOpen?: boolean; // true: solo uno abierto a la vez
  }>(),
  {
    singleOpen: true,
  }
);

const openSet = ref<Set<number>>(new Set([0])); // abre el primero por defecto (ajusta si no quieres)

function isOpen(i: number) {
  return openSet.value.has(i);
}
function toggle(i: number) {
  if (props.singleOpen) {
    openSet.value = isOpen(i) ? new Set() : new Set([i]);
  } else {
    const s = new Set(openSet.value);
    isOpen(i) ? s.delete(i) : s.add(i);
    openSet.value = s;
  }
}

// Icono por defecto (SVG)
const defaultIcon = `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="11" fill="url(#g)" />
  <path d="M12 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm-1.3 5.2h2.3V17h-2.3v-4.8Z" fill="#fff"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="24" y2="24">
      <stop stop-color="#0EA5E9"/><stop offset="1" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>
</svg>`;
</script>