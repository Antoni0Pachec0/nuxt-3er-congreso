<template>
  <section id="location-uni" class="location-uni">
    <div class="loc-head">
      <h2 class="loc-title">Ubicación dentro de la Universidad</h2>
      <span class="loc-underline" aria-hidden="true"></span>
      <p class="loc-desc">
        En este mapa encontrarás las zonas clave del congreso: conferencias, talleres, entradas y estacionamientos.
      </p>
    </div>

    <div class="stage-wrap">
      <div class="stage" ref="stage">
        <img class="layer map"    ref="mapRef"    :src="mapa"    alt="Mapa" />
        <img class="layer laptop" ref="lapRef"    :src="laptop"  alt="Laptop" />
        <img class="layer mascot" ref="mascotRef" :src="mascota" alt="Mascota" />

        <div class="point p1">1
          <span class="tooltip">Estacionamiento y entrada de docentes y personal</span>
        </div>
        <div class="point p2">2
          <span class="tooltip">Primera entrada de alumnos y público</span>
        </div>
        <div class="point p3">3
          <span class="tooltip">Cancha techada (Conferencias)</span>
        </div>
        <div class="point p4">4
          <span class="tooltip">Segunda entrada de alumnos y público, y Estacionamiento</span>
        </div>
        <div class="point p5">5
          <span class="tooltip">Edificio K (Talleres)</span>
        </div>
      </div>
    </div>

    <!-- ✅ Información extra SOLO para móvil -->
    <div class="mobile-info">
      <div class="info-box i1">
        <span class="num">1</span> Estacionamiento y entrada de docentes y personal
      </div>
      <div class="info-box i2">
        <span class="num">2</span> Estacionamiento y entrada de alumnos y público
      </div>
      <div class="info-box i3">
        <span class="num">3</span> Entrada de alumnos y público en general
      </div>
      <div class="info-box i4">
        <span class="num">4</span> Estacionamiento y entrada de alumnos y público
      </div>
      <div class="info-box i5">
        <span class="num">5</span> Edificio K (Talleres)
      </div>
    </div>
  </section>
</template>

<script setup>
import mapa from '~/assets/images/Mapa.png'
import laptop from '~/assets/images/Lap.png'
import mascota from '~/assets/images/Mascota.png'
import '~/assets/css/styles/location_uni.css'

import { ref, onMounted, onBeforeUnmount } from 'vue'

const stage = ref(null)
const mapRef = ref(null)
const lapRef = ref(null)
const mascotRef = ref(null)

let tl

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  gsap.set(stage.value, { transformOrigin: '50% 50%' })
  gsap.set(mapRef.value, { scaleX: 1.4, scaleY: 1, transformOrigin: '50% 50%' })
  gsap.set(lapRef.value, { autoAlpha: 0, yPercent: -8, scale: 1.06 })
  gsap.set(mascotRef.value, { autoAlpha: 0, xPercent: 30, yPercent: 10 })

  const points = Array.from(stage.value.querySelectorAll('.point'))
  gsap.set(points, { autoAlpha: 0, y: 10, scale: 0.9 })

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage.value,
      start: 'top+=200 center',
      end: '+=200%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  })

  tl.to(mapRef.value, { scaleX: 1.05, ease: 'none', duration: 0.35 }, 0)
    .to(mapRef.value, { scaleX: 1.00, ease: 'none', duration: 0.15 }, '>-0.05')
    .to(lapRef.value, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.35, ease: 'power1.out' }, '>-0.02')
    .to(points, { autoAlpha: 1, y: 0, scale: 1, duration: 0.30, stagger: 0.08, ease: 'power1.out' }, '>-0.05')
    .to(mascotRef.value, { autoAlpha: 1, xPercent: 0, yPercent: 0, duration: 0.45, ease: 'power2.out' }, '>-0.05')
})

onBeforeUnmount(() => {
  if (tl) { tl.kill(); tl = null }
  if (typeof window !== 'undefined') {
    const { ScrollTrigger } = require('gsap/ScrollTrigger')
    ScrollTrigger.getAll().forEach(t => t.kill())
  }
})
</script>

<style>
/* ... estilos previos del mapa ... */

/* ✅ Estilos de la información para móvil */
.mobile-info {
  display: none; /* Oculto por defecto */
  margin: 40px auto -150px auto;
  padding: 0 16px;
  max-width: 600px;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
}

.info-box .num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  color: #0f172a;
  font-weight: 700;
  flex-shrink: 0;
}

/* Colores degradados como el ejemplo */
.i1 { background: #1E3A8A; }
.i2 { background: #1E40AF; }
.i3 { background: #2563EB; }
.i4 { background: #3B82F6; }
.i5 { background: #93C5FD; }

/* ✅ Solo visible en móvil */
@media (max-width: 768px) {
  .mobile-info {
    display: block;
  }
}
</style>
