<template>
  <section id="hero" class="hero">
    <div id="particles-js" aria-hidden="true"></div>

    <div class="container fade-in-section">
      <div class="col-left">
        <div class="heading orbitron">
          <span class="kicker">3er</span>
          <h1 class="title">
            <span class="title-line congreso">Congreso</span>
            <span class="title-line internacional">Internacional</span>
          </h1>
        </div>

        <div class="banded-title sora">
          Tecnologías de la Información • Innovación Digital
        </div>
      </div>

      <div class="col-right">
        <div class="logo-wrap">
          <div class="logo-glow"></div>
          <img src="@/assets/img/pages/logo.png" alt="Logo Congreso" class="logo-img" />
          <div class="ring ring-outer"></div>
          <div class="ring ring-inner"></div>
        </div>
      </div>

      <p class="countdown-label" v-if="!eventHasStarted">El evento comienza en</p>
      <p class="countdown-label" v-if="eventHasStarted">El evento ha comenzado!!!</p>

      <div class="countdown" v-if="!eventHasStarted">
        <div class="cd-card">
          <div class="cd-number">{{ timeLeft.days }}</div>
          <span class="cd-caption">DAYS</span>
        </div>
        <div class="cd-card">
          <div class="cd-number">{{ timeLeft.hours }}</div>
          <span class="cd-caption">HOURS</span>
        </div>
        <div class="cd-card">
          <div class="cd-number">{{ timeLeft.minutes }}</div>
          <span class="cd-caption">MINUTES</span>
        </div>
        <div class="cd-card">
          <div class="cd-number">{{ timeLeft.seconds }}</div>
          <span class="cd-caption">SECONDS</span>
        </div>
      </div>

      <div class="info-row">
        <div class="info-card">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 
                    2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="info-text">
            <div class="info-kicker">FECHAS DEL EVENTO</div>
            <div class="info-main">12–14</div>
            <div class="info-sub">Noviembre 2025</div>
          </div>
        </div>

        <div class="info-card cards-info">
          <div class="info-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10z" />
              <circle cx="12" cy="11" r="2.2" />
            </svg>
          </div>
          <div class="info-text">
            <div class="info-kicker">UBICACIÓN</div>
            <div class="info-main">Avenida, Universidad Tecnológica 1</div>
            <div class="info-sub">Barrio la Villita, 75483 Tecamachalco, Pue.</div>
          </div>
        </div>
      </div>
    </div>

    <svg class="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180" preserveAspectRatio="none"
      aria-hidden="true">
      <path fill="#ffffff" d="M0,150 C220,55 500,100 740,150 C980,185 1220,175 1440,90 L1440,180 L0,180 Z" />
    </svg>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
// Asegúrate de que esta ruta de importación de CSS sea correcta en tu proyecto
import '@/assets/css/styles/pages/hero.css'

// ====================================================================
// LÓGICA DE PARTICLES.JS
// ====================================================================

const loadParticles = () => {
  // Verificamos que la función global de particlesJS esté disponible.
  // Esto asume que has cargado la librería particles.js globalmente (ej. en index.html)
  if (typeof window.particlesJS !== 'undefined') {
    window.particlesJS('particles-js', {
      // Configuración de las partículas
      "particles": {
        "number": {
          "value": 160,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#b3d7ff"
        },
        "shape": {
          "type": "edge",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 1,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 1,
            "opacity_min": 0,
            "sync": false
          }
        },
        "size": {
          "value": 10,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 4,
            "size_min": 0.3,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 1,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 600
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "bubble"
          },
          "onclick": {
            "enable": false,
            "mode": "repulse"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 250,
            "size": 0,
            "duration": 2,
            "opacity": 0,
            "speed": 3
          },
          "repulse": {
            "distance": 400,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  } else {
    // Esto te ayuda a saber si la librería no está cargada
    console.error("particlesJS no está definido. Asegúrate de que el script de particles.js esté cargado en tu proyecto.");
  }
}

// ====================================================================
// LÓGICA DE CUENTA REGRESIVA
// ====================================================================

// Fecha del evento (¡Recuerda que estamos en 2025!)
const target = new Date('2025-11-12T09:00:00')

const timeLeft = reactive({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let timer

const eventHasStarted = ref(false)

const pad = (n) => String(n).padStart(2, '0')

const tick = () => {
  const now = new Date().getTime()
  const diff = target.getTime() - now

  if (diff <= 0) {
    eventHasStarted.value = true
    // Setea a cero
    timeLeft.days = '00'
    timeLeft.hours = '00'
    timeLeft.minutes = '00'
    timeLeft.seconds = '00'
    clearInterval(timer)
    return
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)

  // Actualiza el estado reactivo
  timeLeft.days = pad(d)
  timeLeft.hours = pad(h)
  timeLeft.minutes = pad(m)
  timeLeft.seconds = pad(s)
}

// ====================================================================
// CICLO DE VIDA DE VUE
// ====================================================================

onMounted(() => {
  // 1. Inicia el contador
  tick()
  timer = setInterval(tick, 1000)

  // 2. Carga/Inicializa particles.js CADA VEZ que el componente se monta
  loadParticles()
})

onUnmounted(() => {
  // 1. Detiene el contador
  clearInterval(timer)

  // 2. Limpia la instancia de particles.js CADA VEZ que el componente se desmonta
  if (typeof window.pJSDom !== 'undefined' && window.pJSDom.length > 0) {
    // Destruye la instancia actual y limpia el array global
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
})
</script>