<!-- components/sections/FaqAccordion.vue -->
<template>
  <section class="faq">
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
          <span class="faq__icon" aria-hidden="true" v-html="item.icon || defaultIcon"></span>
          <span class="faq__q">{{ item.q }}</span>
          <span class="faq__chev" :class="{ 'faq__chev--open': isOpen(i) }">⌄</span>
        </button>

        <!-- Panel respuesta con transición de altura -->
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
import { ref } from 'vue'

type FaqItem = {
  q: string
  a: string  // puedes usar HTML simple (links, <strong>, etc.)
  icon?: string // SVG inline opcional
}

const props = withDefaults(defineProps<{
  items: FaqItem[]
  singleOpen?: boolean  // true: solo uno abierto a la vez
}>(), {
  singleOpen: true
})

const openSet = ref<Set<number>>(new Set([0])) // abre el primero por defecto (ajusta si no quieres)

function isOpen(i: number) {
  return openSet.value.has(i)
}
function toggle(i: number) {
  if (props.singleOpen) {
    openSet.value = isOpen(i) ? new Set() : new Set([i])
  } else {
    const s = new Set(openSet.value)
    isOpen(i) ? s.delete(i) : s.add(i)
    openSet.value = s
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
</svg>`
</script>

<style scoped>
.faq { max-width: 900px; margin: 0 auto; padding: 24px 16px 56px; }
.faq__head { text-align: center; margin-bottom: 18px; }
.faq__title { font-size: clamp(26px, 4vw, 36px); font-weight: 800; }
.faq__underline { width: 80px; height: 4px; background:#2563eb; border-radius:999px; margin: 10px auto 0; }

.faq__list { display: grid; gap: 12px; }

.faq__item {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgba(0,0,0,.06);
  overflow: hidden;
  border: 1px solid #eef2ff;
}

.faq__btn {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
}
.faq__btn:hover { background: #f8fafc; }
.faq__icon { width: 38px; height: 38px; display: grid; place-items: center; }
.faq__q { font-weight: 700; color:#0f172a; }
.faq__chev { transform: rotate(0deg); transition: transform .2s ease; color:#64748b; font-size: 18px; line-height: 1; }
.faq__chev--open { transform: rotate(180deg); }

.faq__panel {
  padding: 0 16px 14px 66px; /* alinea con el texto de la pregunta, dejando espacio del ícono */
}
.faq__a {
  background: rgba(37,99,235,.06);
  border: 1px solid rgba(37,99,235,.15);
  color: #475569;
  padding: 12px 14px;
  border-radius: 12px;
  line-height: 1.55;
  font-size: .95rem;
}

/* Animación de altura */
.faq-collapse-enter-from, .faq-collapse-leave-to { max-height: 0; opacity: .0; }
.faq-collapse-enter-to,   .faq-collapse-leave-from { max-height: 300px; opacity: 1; }
.faq-collapse-enter-active, .faq-collapse-leave-active { transition: all .22s ease; }
@media (max-width: 640px){
  .faq__panel { padding-left: 62px; }
}
</style>
