<template>
  <footer class="footer" ref="footerRoot">
    <!-- Fondo del footer: wave + degradado -->
    <div class="footer-bg" aria-hidden="true">
<svg
  class="wave-footer"
  viewBox="0 0 1440 800"
  preserveAspectRatio="none"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient id="footerGrad" x1="0" y1="0" x2="1440" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#09122E"/>
      <stop offset="50%"  stop-color="#182D6B"/>
      <stop offset="100%" stop-color="#1E6397"/>
    </linearGradient>
  </defs>

  <!-- Curva para ESCRITORIO (original) -->
  <path class="wave-desktop"
        d="M0,150
            C220,55 500,100 740,150
            C980,185 1220,175 1440,90
            L1440,800 L0,800 Z"
        fill="url(#footerGrad)"/>
</svg>
      
    </div>
    

    <!-- Contenido -->
    <div class="footer-container">
      <!-- Columna izquierda -->
      <div class="footer-left">
        <!-- Logo + Títulos -->
        <div class="footer-brand">
          <img src="@/assets/images/Logo.png" alt="Logo Congreso" class="footer-logo" />
          <div class="brand-text">
            <h3 class="brand-title">3er. Congreso Internacional 2025</h3>
            <p class="brand-subtitle">Tecnologías de la Información e Innovación</p>
          </div>
        </div>
        <!-- Descripción -->
        <p>
          Un congreso tecnológico que reúne a especialistas de todo el país para
          compartir conocimientos, experiencias y tendencias que impulsan la
          innovación digital en nuestra universidad.
        </p>

        <!-- Código estilo ventana -->
        <div class="footer-code" ref="codeCard">
          <pre class="code-window"><code class="code-typing">
<span class="tok-console">console</span>.<span class="tok-log">log</span>(<span class="tok-str">"Innovando el futuro, conectando el presente"</span>);</code></pre>
        </div>

        <!-- Contacto -->
        <div class="footer-contact">
          <!-- Teléfono -->
          <div class="contact-item">
            <i class="mdi mdi-phone contact-icon"></i> <!-- Icono de teléfono -->
            <div class="contact-label">Teléfono</div>
            <a href="tel:+522225378503" class="contact-content">+52 222 537 8503</a>
          </div>

          <!-- Ubicación -->
          <div class="contact-item">
            <i class="mdi mdi-map-marker contact-icon"></i> <!-- Icono de ubicación -->
            <div class="contact-label">Ubicación</div>
            <span class="contact-content">Avenida, Universidad Tecnológica, Barrio la Villita.</span>
          </div>
        </div>
      </div>

      <!-- Enlaces rápidos -->
      <div class="footer-links">
        <h4>Enlaces rápidos</h4>
        <ul>
          <li><NuxtLink to="#Inicio">Inicio</NuxtLink></li>
          <li><NuxtLink to="#Enfoque">Enfoque</NuxtLink></li>
          <li><NuxtLink to="#Galeria">Galería</NuxtLink></li>
          <li><NuxtLink to="#Ubicacion">Ubicación</NuxtLink></li>
          <li><NuxtLink to="#Ubicacion">Mapa</NuxtLink></li>
          <li><NuxtLink to="#Ubicacion">Preguntas</NuxtLink></li>
        </ul>
      </div>

      <!-- Redes -->
      <div class="footer-right">
        <h4>Síguenos en:</h4>
        <div class="social-icons">
          <!-- Iconos con MDI -->
          <a href="#" aria-label="Facebook" class="facebook"><i class="mdi mdi-facebook"></i></a>
          <a href="#" aria-label="X" class="x"><i class="mdi mdi-twitter"></i></a>
          <a href="#" aria-label="Instagram" class="instagram"><i class="mdi mdi-instagram"></i></a>
          <a href="#" aria-label="YouTube" class="youtube"><i class="mdi mdi-youtube"></i></a>
        </div>

        <div class="footer-impact">
          <h5>Nuestro Impacto en 8 Años:</h5>
          <ul>
            <li><span>2160+</span> Alumnos</li>
            <li><span>225+</span> Ponentes</li>
            <li><span>3</span> Países</li>
            <li><span>3</span> Días</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Línea inferior -->
    <div class="footer-bottom">
      © 2025 3er Congreso Internacional de Tecnologías de la Información e
      Innovación Digital. Todos los derechos reservados.
    </div>
  </footer>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const codeCard = ref(null)
const footerRoot = ref(null)
let io

onMounted(() => {
  const card = codeCard.value
  if (!card) return

  const typingEl = card.querySelector('.code-typing')
  if (!typingEl) return

  const text = typingEl.textContent
  const charCount = text.length

  typingEl.style.setProperty('--n', String(charCount))
  typingEl.style.setProperty('--ch', `${charCount}ch`)

  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        card.classList.add('start')
        const total = 0.2 + 2.4 + 3.0
        setTimeout(() => card.classList.add('done'), total * 1000)
        io.disconnect()
      }
    })
  }, { threshold: 0.3 })

  io.observe(card)
})

onBeforeUnmount(() => {
  if (io) io.disconnect()
})
</script>

- <style scoped src="@/assets/css/styles/footer.css"></style> 
