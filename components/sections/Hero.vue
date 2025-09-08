<!-- components/sections/Hero.vue -->
<template>
  <section id="hero" class="hero">
    <div id="particles-js" aria-hidden="true"></div>
    
    <div class="container">
      <!-- Columna izquierda: título + banda -->
      <div class="col-left">
        <div class="heading orbitron">
          <span class="kicker">3er</span>
          <h1 class="title">
            <span class="title-line congreso">Congreso</span>
            <span class="title-line internacional">Internacional</span>
          </h1>
        </div>

        <!-- Banda ahora dentro de col-left -->
        <div class="banded-title sora">
          Tecnologías de la Información • Innovación Digital
        </div>
      </div>

      <!-- Columna derecha: logo -->
      <div class="col-right">
        <div class="logo-wrap">
          <div class="logo-glow"></div>
          <img src="@/assets/images/Logo.png" alt="Logo Congreso" class="logo-img" />
          <div class="ring ring-outer"></div>
          <div class="ring ring-inner"></div>
        </div>
      </div>

      <!-- Countdown -->
      <p class="countdown-label">El evento comienza en</p>
      <div class="countdown">
        <div class="cd-card">
          <div class="cd-number">{{ timeLeft.days }}</div>
          <span class="cd-caption">DÍAS</span>
        </div>
        <div class="cd-card">
          <div class="cd-number">{{ timeLeft.hours }}</div>
          <span class="cd-caption">HORAS</span>
        </div>
        <div class="cd-card">
          <div class="cd-number">{{ timeLeft.minutes }}</div>
          <span class="cd-caption">MINUTOS</span>
        </div>
        <div class="cd-card">
          <div class="cd-number">{{ timeLeft.seconds }}</div>
          <span class="cd-caption">SEGUNDOS</span>
        </div>
      </div>

      <!-- Info cards -->
      <div class="info-row">
        <!-- Fechas -->
        <div class="info-card">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 
                   2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="info-text">
            <div class="info-kicker">FECHAS DEL EVENTO</div>
            <div class="info-main">12–14</div>
            <div class="info-sub">Noviembre 2025</div>
          </div>
        </div>

        <!-- Ubicación -->
        <div class="info-card">
          <div class="info-icon" aria-hidden="true">
            <!-- Pin de ubicación -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10z"/>
              <circle cx="12" cy="11" r="2.2"/>
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
<path fill="#fff" fill-opacity="1" 
  d="M0,160 
     C360,80 1080,240 1440,140 
     L1440,320 L0,320 Z">
</path>

    <!-- Ola decorativa inferior -->
    <svg
    class="wave"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 180"
    preserveAspectRatio="none"   
    aria-hidden="true"
    >
    <path fill="#ffffff" 
        d="M0,150 C220,55 500,100 740,150 C980,185 1220,175 1440,90 L1440,180 L0,180 Z" 
        />
    </svg>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from 'vue'
import logo from '@/assets/images/Logo.png'

// Fecha del evento
const target = new Date('2025-11-12T09:00:00')

const timeLeft = reactive({ days: '00', hours: '00', minutes: '00', seconds: '00' })
let timer

const pad = (n) => String(n).padStart(2, '0')

const tick = () => {
  const now = new Date().getTime()
  const diff = Math.max(0, target.getTime() - now)

  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)

  timeLeft.days = pad(d)
  timeLeft.hours = pad(h)
  timeLeft.minutes = pad(m)
  timeLeft.seconds = pad(s)
}

onMounted(() => {
  tick()
  timer = setInterval(() => {
    tick()
    if (
      timeLeft.days === '00' &&
      timeLeft.hours === '00' &&
      timeLeft.minutes === '00' &&
      timeLeft.seconds === '00'
    ) clearInterval(timer)
  }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
/* --- HERO base --- */
.hero{
  position:relative;
  margin:0;
  min-height:120vh;
  display:grid;
  place-items:start center;
  overflow:hidden;
  isolation:isolate;
  padding-block: 3.5rem 1rem;
  background:
    radial-gradient(1200px 600px at 10% 10%, rgba(14,165,233,.15), transparent),
    radial-gradient(900px 500px at 85% 15%, rgba(29,78,216,.18), transparent),
    #0b1220;
  color:#eaf3ff;
}
#particles-js{ position:absolute; inset:0; z-index:0; pointer-events:none; }
:deep(#particles-js canvas){
  position:absolute !important;
  inset:0 !important;
  width:100% !important;
  height:100% !important;
  display:block !important;
}

/* --- GRID principal del hero --- */
.container{
  position:relative; 
  z-index:2;
  width:min(1200px, 92vw);
  display:grid;
  grid-template-columns: 1.2fr 1fr;
  grid-auto-rows:auto;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items:start;
}
.col-left{ grid-column:1; display:flex; flex-direction:column; gap:1rem; }
.col-right{ grid-column:2; align-self:start; display:grid; place-items:center; }

.banded-title,
.countdown-label,
.countdown,
.info-row{
  grid-column: 1 / -1;
  justify-self:center;
  width:100%;
}

/* --- TÍTULOS --- */
.orbitron, .orbitron * { font-family: 'Orbitron', sans-serif; font-weight: 800; }
.heading { text-align:center; }
.kicker{ color:#BFE3FF; font-size:50px; margin-bottom:.25rem; }
.title{ line-height:1.05; margin:0 0 .5rem; font-size:70px; }
.title-line{ display:block; }
.congreso{ color:#fff; margin-bottom:1rem; }
.internacional{
  background: linear-gradient(90deg, #3984F5, #06B5D4);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}

/* --- Banda --- */
.sora{ font-family: 'Sora', sans-serif; font-weight: 700; color:#fff; }
.banded-title{
  position: relative;
  text-align: center;
  font-size: clamp(1rem, 2.2vw, 1.15rem);
  padding: 18px 12px;
  margin: 10px auto 18px;
  width: min(980px, 100%);
}
.banded-title::before{
  content:""; position:absolute; left:0; right:0; top:0;
  height:3px; border-radius:6px;
  background: linear-gradient(90deg, rgba(7,180,213,0) 0%, #07B4D5 50%, rgba(7,180,213,0) 100%);
}
.banded-title::after{
  content:""; position:absolute; left:0; right:0; bottom:0;
  height:3px; border-radius:6px;
  background: linear-gradient(90deg, rgba(57,131,245,0) 0%, #3983F5 50%, rgba(57,131,245,0) 100%);
}

/* --- Countdown --- */
.countdown-label{ margin-top:-1rem; margin-bottom:-1.5rem; text-align:left; font-size:18px; font-family:'Orbitron'; }
.countdown{
  display:grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap:1.1rem;
  margin-bottom:1.25rem;
}
.cd-card{
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
  border:1px solid rgba(255,255,255,.14);
  border-radius:1.1rem;
  padding:1.25rem 1rem;
  text-align:center;
  backdrop-filter: blur(6px);
}
.cd-number{
  font-weight:800;
  font-size: clamp(4rem, 3.2vw, 2.5rem);
  font-family:'Orbitron';
  font-variant-numeric: tabular-nums;
}
.cd-caption{ margin-top:.25rem; font-size:.8rem; letter-spacing:.14em; color:#b9cdf6; }

/* --- Info cards --- */
.info-row{ display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
.info-card{
  display:flex; gap:.9rem; align-items:center;
  padding:.9rem 1rem; border-radius:1rem;
  background:linear-gradient(135deg, #0f1b33, #0e2a4a);
}
.info-icon{ width:40px; height:40px; display:grid; place-items:center; border-radius:.8rem; color:#cfe8ff;
  background:linear-gradient(135deg, #1D4ED8, #0EA5E9); }
.info-icon svg{
  width: 22px;
  height: 22px;              /* mantiene proporción 1:1 */
  display: block;
  aspect-ratio: 1 / 1;       /* refuerzo para navegadores modernos */
}
.info-kicker{ font-size:.75rem; color:#a9c6ff; }
.info-main{ font-weight:800; font-size:1.1rem; }
.info-sub{ font-size:.9rem; color:#cfe3ff; }

/* --- Logo --- */
.logo-wrap{ position:relative; width:min(350px, 40vw); aspect-ratio:1/1; display:grid; place-items:center; }
.logo-glow{ position:absolute; left:50%; top:50%; width:100%; height:100%; transform:translate(-50%,-50%);
  border-radius:50%; background:rgba(45,175,242,0.63); filter:blur(80px); }
.logo-img{ width:58%; z-index:2; animation:logo-pulse 3s ease-in-out infinite; filter:drop-shadow(0 8px 30px rgba(0,0,0,.25)); }
@keyframes logo-pulse{ 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.04);} }
.ring{ position:absolute; border-radius:50%; background:transparent; }
.ring-outer{ inset:0%; border:2px solid #004880; }
.ring-inner{ inset:10%; border:2px solid #2F66BF; }

/* --- Ola inferior --- */
.wave{
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: 100vw;           /* 👈 ancho del viewport, no del contenedor */
  height: 170px;          /* ajusta a tu gusto (160–200px) */
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
}

/* --- Responsive --- */
@media (max-width:960px){
  .container{ grid-template-columns:1fr; }
  .col-left, .col-right{ grid-column:1 / -1; }
  .col-right{ order:-1; }
  .countdown{ grid-template-columns:repeat(2,1fr); gap:.9rem; }
  .wave{ height: 140px; }
}
</style>
