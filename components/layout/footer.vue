<template>
  <footer class="footer" ref="footerRoot">
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
            <stop offset="0%" stop-color="#09122E"/>
            <stop offset="50%" stop-color="#182D6B"/>
            <stop offset="100%" stop-color="#1E6397"/>
          </linearGradient>
        </defs>

        <path class="wave-desktop"
              d="M0,150
                  C220,55 500,100 740,150
                  C980,185 1220,175 1440,90
                  L1440,800 L0,800 Z"
              fill="url(#footerGrad)"/>
      </svg>
    </div>

    <div class="footer-container">
      <div class="footer-left">
        <div class="footer-brand">
          <img src="@/assets/img/pages/logo.png" alt="Logo Congreso" class="footer-logo" />
          <div class="brand-text">
            <h3 class="brand-title">3er. Congreso Internacional 2025</h3>
            <p class="brand-subtitle">Tecnologías de la Información e Innovación</p>
          </div>
        </div>

        <p>
          Un congreso tecnológico que reúne a especialistas de todo el país para
          compartir conocimientos, experiencias y tendencias que impulsan la
          innovación digital en nuestra universidad.
        </p>

        <!-- En tablet: 3 columnas -->
        <div class="footer-code-contact">
          <div class="footer-code" ref="codeCard">
            <pre class="code-window"><code class="code-typing">
<span class="tok-console">console</span>.<span class="tok-log">log</span>(<span class="tok-str">"Innovando el futuro, conectando el presente"</span>);</code></pre>
          </div>

          <div class="footer-contact">
            <div class="contact-item">
              <i class="mdi mdi-phone contact-icon"></i> 
              <div class="contact-label">Teléfono</div>
              <a href="tel:+522225378503" class="contact-content">+52 222 537 8503</a>
            </div>
          </div>

          <div class="footer-location">
            <div class="contact-item">
              <i class="mdi mdi-map-marker contact-icon"></i> 
              <div class="contact-label">Ubicación</div>
              <a href="https://www.google.com/maps/place/Universidad+Tecnol%C3%B3gica+de+Tecamachalco/@18.8651404,-97.7256649,17z/data=!3m1!4b1!4m6!3m5!1s0x85cfbf640db83211:0x86fce97bd24ed08e!8m2!3d18.8651353!4d-97.72309!16s%2Fg%2F1tfccj1t?entry=ttu&g_ep=EgoyMDI1MDkyNC4wIKXMDSoASAFQAw%3D%3D" class="contact-content">
                UTTECAM
              </a>
            </div>
          </div>
        </div>
      </div>

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

      <div class="footer-right">
        <h4>Síguenos en:</h4>
        <div class="social-icons">
          <a href="https://www.facebook.com/profile.php?id=61581205033138" aria-label="Facebook" class="facebook"><i class="mdi mdi-facebook"></i></a>
          <a href="https://twitter.com" aria-label="X" class="x"><i class="mdi mdi-twitter"></i></a>
          <a href="https://www.instagram.com" aria-label="Instagram" class="instagram"><i class="mdi mdi-instagram"></i></a>
          <a href="https://www.youtube.com" aria-label="YouTube" class="youtube"><i class="mdi mdi-youtube"></i></a>
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

    <div class="footer-bottom">
      <span @click="handleCopyrightClick">©</span> 2025 3er Congreso Internacional de Tecnologías de la Información e
      Innovación Digital. Todos los derechos reservados.
    </div>
  </footer>
</template>


<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import '@/assets/css/footer.css'

const codeCard = ref(null)
const footerRoot = ref(null)
let io
let clickCount = 0

const handleCopyrightClick = () => {
  clickCount++
  if (clickCount >= 3) {
    window.open('https://www.youtube.com/shorts/suTR_Q3KttA', '_blank')
    clickCount = 0; // Opcional: reiniciar el contador después de la redirección
  }
}

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