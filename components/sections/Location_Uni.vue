<template>
  <section id="location-uni" class="location-uni">
    <div class="loc-head fade-in-section">
      <h2 class="loc-title">Ubicación dentro de la Universidad</h2>
      <span class="loc-underline" aria-hidden="true"></span>
      <p class="loc-desc">
        En este mapa encontrarás las zonas clave del congreso: conferencias, talleres, entradas y estacionamientos.
      </p>
    </div>

    <div class="stage-wrap">
      <div class="stage" ref="stage">
        <!-- Wrapper para alinear mapa + capas + puntos -->
        <div class="canvas" ref="canvas">
          <!-- Capas -->
          <img
            class="layer map"
            ref="mapRef"
            :src="mapa"
            alt="Mapa de la universidad"
            decoding="async"
            loading="eager"
            fetchpriority="high"
          />
          <img
            class="layer laptop"
            ref="lapRef"
            :src="laptop"
            alt="Laptop en el mapa"
            decoding="async"
            loading="eager"
          />
          <img
            class="layer mascot"
            ref="mascotRef"
            :src="mascota"
            alt="Mascota del congreso"
            decoding="async"
            loading="eager"
          />

          <!-- Puntos (clicables en desktop) -->
          <div class="point p1" role="button" tabindex="0"
               aria-label="Estacionamiento y entrada de docentes y personal">
            1
            <span class="tooltip">Estacionamiento y entrada de docentes y personal</span>
          </div>
          <div class="point p2" role="button" tabindex="0"
               aria-label="Primera entrada de alumnos y público">
            2
            <span class="tooltip">Primera entrada de alumnos y público</span>
          </div>
          <div class="point p3" role="button" tabindex="0"
               aria-label="Cancha techada (Conferencias)">
            3
            <span class="tooltip">Cancha techada (Conferencias)</span>
          </div>
          <div class="point p4" role="button" tabindex="0"
               aria-label="Segunda entrada de alumnos y público, y Estacionamiento">
            4
            <span class="tooltip">Segunda entrada de alumnos y público, y Estacionamiento</span>
          </div>
          <div class="point p5" role="button" tabindex="0"
               aria-label="Edificio K (Talleres)">
            5
            <span class="tooltip">Edificio K (Talleres)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista móvil (aparece con cada punto) -->
    <div class="mobile-info" ref="mobileInfo">
      <ul class="mobile-list">
        <li class="info-box i1"><span class="num">1</span> Estacionamiento y entrada de docentes y personal</li>
        <li class="info-box i2"><span class="num">2</span> Primera entrada de alumnos y público</li>
        <li class="info-box i3"><span class="num">3</span> Cancha techada (Conferencias)</li>
        <li class="info-box i4"><span class="num">4</span> Segunda entrada de alumnos y público, y Estacionamiento</li>
        <li class="info-box i5"><span class="num">5</span> Edificio K (Talleres)</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import mapa from '~/assets/images/map.webp'
import laptop from '~/assets/images/Lap.webp'      
import mascota from '~/assets/images/Mascota.webp' 
import '~/assets/css/styles/location_uni.css'

import { ref, onMounted, onBeforeUnmount } from 'vue'

const stage = ref(null)
const canvas = ref(null)
const mapRef = ref(null)
const lapRef = ref(null)
const mascotRef = ref(null)
const mobileInfo = ref(null)

let mm = null // gsap.matchMedia

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  // ⚙️ Ajustes globales para suavizar
  gsap.defaults({ force3D: true })
  gsap.ticker.lagSmoothing(500, 16) // capea saltos grandes al retomar scroll
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
    fastScrollEnd: true,
  })

  // Helper: decodifica imagen si es posible
  const decodeImg = (el) =>
    el && typeof el.decode === 'function' ? el.decode().catch(() => {}) : Promise.resolve()

  // Estados base
  gsap.set(stage.value,  { transformOrigin: '50% 50%' })
  gsap.set(canvas.value, { transformOrigin: '50% 50%' })
  gsap.set(mapRef.value, { scale: 1, transformOrigin: '50% 50%' })
  gsap.set(lapRef.value, { autoAlpha: 0, yPercent: -8, scale: 1.06 })
  gsap.set(mascotRef.value, { autoAlpha: 0, xPercent: 30, yPercent: 10 })

  const points = Array.from(stage.value.querySelectorAll('.point'))
  gsap.set(points, { autoAlpha: 0, y: 10, scale: 0.9 })

  // ⏳ Decodifica imágenes ANTES de crear timelines
  await Promise.all([decodeImg(mapRef.value), decodeImg(lapRef.value), decodeImg(mascotRef.value)])

  // Activar/desactivar will-change solo durante animación
  const promote = (els) => els.forEach(el => { if (el) el.style.willChange = 'transform, opacity' })
  const demote  = (els) => els.forEach(el => { if (el) el.style.willChange = 'auto' })

  mm = gsap.matchMedia()

  mm.add(
    {
      isDesktop: '(min-width: 769px)',
      isMobile:  '(max-width: 768px)',
    },
    (context) => {
      const { isDesktop, isMobile } = context.conditions

      const mobileInfoEl = mobileInfo.value
      const cards = mobileInfoEl
        ? Array.from(mobileInfoEl.querySelectorAll('.info-box'))
        : []

      if (isMobile) {
        // ====== MÓVIL: laptop + cada card junto a su punto (tu lógica) ======
        gsap.set(lapRef.value,    { autoAlpha: 0, yPercent: -8, scale: 1.06 })
        gsap.set(mascotRef.value, { autoAlpha: 0, xPercent: 30, yPercent: 10 })
        gsap.set(points,          { autoAlpha: 0, y: 10, scale: 0.9 })
        if (mobileInfoEl) gsap.set(mobileInfoEl, { autoAlpha: 0, y: 0 })
        if (cards.length) gsap.set(cards, { autoAlpha: 0, y: 8 })

        const perfEls = [lapRef.value, mascotRef.value, ...points]

        const tl = gsap.timeline({
          defaults: { ease: 'power1.out' },
          smoothChildTiming: true,
          // lazy: true (por defecto; mejor rendimiento que forzar false)
          scrollTrigger: {
            trigger: stage.value,
            start: 'top 64%',
            end:   '+=50%',
            scrub: 1.2,
            pin: false,
            pinSpacing: false,
            onToggle: (self) => self.isActive ? promote(perfEls) : demote(perfEls),
          },
        })

        tl.add('showLap')
          .to(lapRef.value, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.4 }, 'showLap')
          .to(mobileInfoEl, { autoAlpha: 1, duration: 0.2 }, 'showLap')

        const count = Math.min(points.length, cards.length)
        for (let i = 0; i < count; i++) {
          const pos = i === 0 ? 'showLap+=0.08' : '>-0.02'
          tl.to(points[i], { autoAlpha: 1, y: 0, scale: 1, duration: 0.28 }, pos)
            .to(cards[i],  { autoAlpha: 1, y: 0, duration: 0.24 }, '<')
        }

        tl.to(mascotRef.value, { autoAlpha: 1, xPercent: 0, yPercent: 0, duration: 0.45 }, '>-0.04')

        return () => { demote(perfEls); tl.kill() }
      }

      // ====== DESKTOP: imagen estática, mapa arranca ancho y se contrae con la laptop ======
      gsap.set(lapRef.value,    { autoAlpha: 0, yPercent: -8, scale: 0.80 })
      gsap.set(mascotRef.value, { autoAlpha: 0, xPercent: 30, yPercent: 10 })
      gsap.set(points,          { autoAlpha: 0, y: 10, scale: 0.9 })
      gsap.set(mapRef.value,    { scaleX: 1.12 })

      const perfEls = [lapRef.value, mascotRef.value, ...points]

      const tl = gsap.timeline({
        defaults: { ease: 'power1.out' },
        smoothChildTiming: true,
        scrollTrigger: {
          trigger: stage.value,
          start: 'top 70%',
          end:   '+=50%',
          scrub: 1.0,
          pin: false,
          pinSpacing: false,
          onToggle: (self) => self.isActive ? promote(perfEls) : demote(perfEls),
        },
      })

      tl.add('showLap')
        .to(mapRef.value, { scaleX: 1, duration: 0.35, ease: 'none' }, 'showLap')
        .to(lapRef.value, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.4 }, 'showLap')

      // ⚡️ Un solo tween con stagger (menos overhead que N tweens en bucle)
      tl.to(points, { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, stagger: 0.08 }, 'showLap+=0.10')

      tl.to(mascotRef.value, { autoAlpha: 1, xPercent: 0, yPercent: 0, duration: 0.45 }, '>-0.04')

      return () => { demote(perfEls); tl.kill() }
    }
  )

  // Refresco tras preparar todo (reduce saltos iniciales)
  ScrollTrigger.refresh()
})

onBeforeUnmount(() => { if (mm) mm.revert() })
</script>
