<template>
  <section class="sv-showcase" id="souvenirs">
    <div class="sv-wrap">
      <header class="sv-header">
        <h2 class="sv-title">Souvenirs Exclusivos</h2>
        <div class="sv-underline"></div>
      </header>

      <div class="sv-grid">
        <!-- Laterales ALTAS -->
        <figure class="sv-card sv-pink sv-reveal sv-left-lg">
          <img :src="imgs.one" alt="Playera izquierda" loading="lazy" />
        </figure>

        <!-- ⬇️ Wrapper del trío central -->
        <div class="sv-center-wrap">
          <figure class="sv-card sv-mint sv-reveal sv-mid-1">
            <img
              :src="imgs.two"
              alt="Centro izquierda (grande)"
              loading="lazy"
            />
          </figure>
          <figure class="sv-card sv-sky sv-reveal sv-center-sm">
            <img :src="imgs.center" alt="Centro (más chica)" loading="lazy" />
          </figure>
          <figure class="sv-card sv-mint sv-reveal sv-mid-2">
            <img
              :src="imgs.three"
              alt="Centro derecha (grande)"
              loading="lazy"
            />
          </figure>
        </div>

        <figure class="sv-card sv-lilac sv-reveal sv-right-lg">
          <img :src="imgs.four" alt="Playera derecha" loading="lazy" />
        </figure>

        <!-- Abajo laterales pequeñas -->
        <figure class="sv-card sv-vanilla sv-reveal sv-left-sm">
          <img :src="imgs.five" alt="Pequeña izquierda" loading="lazy" />
        </figure>
        <figure class="sv-card sv-purple sv-reveal sv-right-sm">
          <img :src="imgs.six" alt="Pequeña derecha" loading="lazy" />
        </figure>

        <!-- CTA -->
        <div class="sv-cta-col sv-reveal sv-cta-area">
          <button class="sv-cta" @click="goStore">
            <span class="sv-cta__icon" aria-hidden="true">…</span>
            Ir a la Tienda
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import shir1 from "@/assets/img/pages/shirt/shirt-1.png";

// Imágenes de prueba
const imgs = {
  one: shir1, // alta izquierda
  two: shir1, // centro izq (grande)
  center: shir1,// centro (más chica)
  three: shir1, // centro der (grande)
  four: shir1, // alta derecha
  five: shir1, // pequeña izq
  six: shir1, // pequeña der
  };

const goStore = () => {
  if (typeof window !== "undefined") window.location.href = "#productos";
};

/* Revelado al entrar (stagger) */
onMounted(() => {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>(".sv-reveal")
  );
  if (!cards.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cards.forEach((el) => el.classList.add("is-inview"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const idx = cards.indexOf(e.target as HTMLElement);
          (e.target as HTMLElement).style.setProperty(
            "--delay",
            `${Math.min(idx, 6) * 90}ms`
          );
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
  );
  cards.forEach((c) => io.observe(c));
});
</script>

<style scoped>
/* ===== Sección base ===== */
.sv-showcase {
  --ink: #0b1534;
  --bg: #fff;
  --shadow: 0 10px 36px rgba(2, 20, 56, 0.08);
  background: var(--bg);
  padding: clamp(2.5rem, 5vw, 4rem) 1rem;
}
.sv-wrap {
  max-width: 1100px;
  margin: 0 auto;
}

/* ===== Header ===== */
.sv-header {
  text-align: center;
  margin-bottom: 1.2rem;
}
.sv-title {
  font-weight: 800;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  letter-spacing: 0.2px;
  color: var(--ink);
}
.sv-underline {
  width: 90px;
  height: 4px;
  background: #2563eb;
  border-radius: 999px;
  margin: 0.6rem auto 0;
}

/* ===== GRID BASE (ESCRITORIO) ===== */
.sv-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: clamp(86px, 8.8vw, 116px);
  gap: clamp(0.8rem, 2vw, 1.2rem);
  align-items: stretch;
  margin-top: 1.2rem;
}

/* Laterales */
.sv-left-lg {
  grid-column: 1 / span 2;
  grid-row: 1 / span 3;
}
.sv-right-lg {
  grid-column: 11 / span 2;
  grid-row: 1 / span 3;
}

/* Contenedor central */
.sv-center-wrap {
  grid-column: 3 / span 8;
  grid-row: 1 / span 3;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-auto-rows: inherit;
  gap: inherit;
}

/* Trío de imágenes centrales */
.sv-center-wrap .sv-mid-1 {
  grid-column: 1 / span 8;
  grid-row: 2 / span 3;
}
.sv-center-wrap .sv-center-sm {
  grid-column: 9 / span 8;
  grid-row: 2 / span 2; 
}
.sv-center-wrap .sv-mid-2 {
  grid-column: 17 / span 8;
  grid-row: 2 / span 3;
}

/* Elementos inferiores */
.sv-left-sm {
  grid-column: 1 / span 2;
  grid-row: 4;
}
.sv-right-sm {
  grid-column: 11 / span 2;
  grid-row: 4;
}
.sv-cta-area {
  grid-column: 3 / span 8;
  grid-row: 4;
  display: grid;
  place-items: center;
}

/* ===== ESTILOS DE CARDS ===== */
.sv-card {
  display: grid;
  place-items: center;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow);
  background: #f6f8ff;
}
.sv-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.2, 0.65, 0.3, 1);
}
.sv-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 34px rgba(2, 20, 56, 0.14);
}
.sv-card:hover img {
  transform: scale(1.03);
}

/* Paletas de colores */
.sv-pink {
  background: #ffd7df;
}
.sv-vanilla {
  background: #fff3c7;
}
.sv-mint {
  background: #d9ffef;
}
.sv-sky {
  background: #d9f1ff;
}
.sv-lilac {
  background: #e8dcff;
}
.sv-purple {
  background: #f3d3ff;
}

/* ===== ESTILOS DE CTA Y ANIMACIONES ===== */
.sv-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.2rem;
  border-radius: 999px;
  border: 1px solid #0b0b0b;
  background: #0b0b0b;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 8px 22px rgba(2, 20, 56, 0.18);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.sv-cta:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}
.sv-cta__icon {
  display: grid;
  place-items: center;
}
.sv-reveal {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
  transition: opacity 0.5s cubic-bezier(0.2, 0.65, 0.3, 1) var(--delay, 0ms),
    transform 0.6s cubic-bezier(0.2, 0.65, 0.3, 1) var(--delay, 0ms);
}
.sv-reveal.is-inview {
  opacity: 1;
  transform: translateY(0) scale(1);
}



</style>
