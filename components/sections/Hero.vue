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

        <!-- Ubicación -->
        <div class="info-card cards-info">
          <div class="info-icon" aria-hidden="true">
            <!-- Pin de ubicación -->
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

    <!-- Ola decorativa inferior -->
    <svg class="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180" preserveAspectRatio="none"
      aria-hidden="true">
      <path fill="#ffffff" d="M0,150 C220,55 500,100 740,150 C980,185 1220,175 1440,90 L1440,180 L0,180 Z" />
    </svg>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from 'vue'
import '~/assets/css/styles/Hero.css'
import logo from '@/assets/images/Logo.png'
import '@/assets/css/styles/Hero.css'

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
