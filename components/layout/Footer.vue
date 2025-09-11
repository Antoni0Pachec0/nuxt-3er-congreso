<template>
  <footer class="footer" ref="footerRoot">
    <!-- Fondo del footer: wave + degradado -->
    <div class="footer-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="footerGrad" x1="0" y1="0" x2="1440" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stop-color="#09122E"/>
            <stop offset="50%"  stop-color="#182D6B"/>
            <stop offset="100%" stop-color="#1E6397"/>
          </linearGradient>
        </defs>
        <path
          d="M0,150
              C220,55 500,100 740,150
              C980,185 1220,175 1440,90
              L1440,800 L0,800 Z"
          fill="url(#footerGrad)"
        />
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
          <li><NuxtLink to="/">Inicio</NuxtLink></li>
          <li><NuxtLink to="/enfoque">Enfoque</NuxtLink></li>
          <li><NuxtLink to="/galeria">Galería</NuxtLink></li>
          <li><NuxtLink to="/ubicacion">Ubicación</NuxtLink></li>
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
      © 2024 3er Congreso Internacional de Tecnologías de la Información e
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

<style scoped>
.footer {
  position: relative;
  overflow: visible;
  padding: 160px 20px 20px;
  color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.footer-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.footer-bg svg {
  width: 100%;
  height: 100%;
  display: block;
}

.footer-container {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: auto;
}

.footer-left {
  max-width: none;
}

/* Logo + Títulos */
.footer-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.footer-logo {
  width: 56px;
  height: auto;
  flex: 0 0 auto;
  margin-bottom: 0;
}

.brand-text {
  line-height: 1.2;
}

.brand-title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}

.brand-subtitle {
  margin: 2px 0 0;
  font-size: 18px;
  font-weight: 400;
  color: #BFDBFE;
}

/* Párrafo */
.footer-left p {
  font-size: 16px;
  line-height: 1.6;
  opacity: .9;
  margin-bottom: 10px;
  color: #D1D5DB;
}

/* Code card */
.footer-code {
  position: relative;
  width: 85%;
  margin: 14px 0 8px;
  padding: 36px 16px 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, .06), rgba(255, 255, 255, .02));
  border: 1px solid rgba(76, 201, 239, .28);
  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, .10), 0 10px 24px rgba(0, 0, 0, .14);
  overflow-x: auto;
}

.footer-code::before {
  content: "";
  position: absolute;
  top: 10px;
  left: 12px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #FF5F56;
  box-shadow: 16px 0 0 #FFBD2E, 32px 0 0 #27C93F;
  opacity: .95;
}

.footer-code::after {
  content: "js";
  position: absolute;
  top: 7px;
  left: 60px;
  font-size: 12px;
  letter-spacing: .08em;
  color: rgba(255, 255, 255, .8);
  opacity: .9;
}

.code-window {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
}

.footer-code code {
  display: inline-block;
  color: #fff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.code-typing {
  white-space: nowrap;
  overflow: hidden;
  width: 0ch;
  border-right: 2px solid rgba(255, 255, 255, .7);
}

.footer-code.start .code-typing {
  animation: typing 2.4s steps(var(--n)) 0.2s forwards, blink 1s step-end 0.2s 3;
}

.footer-code.done .code-typing {
  border-right-color: transparent;
}

.tok-console {
  color: #2563EB;
  font-weight: 600;
}

.tok-log {
  color: #4CC9EF;
  font-weight: 600;
}

.tok-str {
  color: #ffffff;
}

@keyframes typing {
  from {
    width: 0ch;
  }

  to {
    width: var(--ch);
  }
}

@keyframes blink {
  0%,
  100% {
    border-right-color: transparent;
  }

  50% {
    border-right-color: rgba(255, 255, 255, .7);
  }
}

.contact-item {
  display: grid;
  grid-template-columns: 22px 1fr;
  grid-template-rows: auto auto;
  column-gap: 10px;
  row-gap: 4px;
  align-items: start;
  margin-bottom: 16px;
}

.contact-icon {
  grid-column: 1;
  grid-row: 1 / span 2;
  font-size: 20px;
  color: #60A5FA;
  align-self: center;
}

.contact-label {
  grid-column: 2;
  grid-row: 1;
  font-size: 13px;
  color: #9CA3AF;
  margin: 0;
}

.contact-content {
  grid-column: 2;
  grid-row: 2;
  color: #D1D5DB;
  font-size: 16px;
  line-height: 1.4;
  text-decoration: none;
}

.contact-content[href^="tel:"]:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Enlaces / Redes / Impacto */
.footer-links h4,
.footer-right h4 {
  font-size: 16px;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, .3);
  padding-bottom: 5px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin: 8px 0;
}

.footer-links a {
  color: #fff;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.25s, color 0.25s;
}

.footer-links a:hover {
  opacity: 1;
  color: #51a2ff; 
}

.social-icons {
  display: flex;
  gap: 12px;
  margin: 10px 0 16px;
}

/* Iconos sociales */
.social-icons a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1); /* Fondo ligeramente transparente */
  color: #fff; /* Blanco por defecto */
  font-size: 28px;
  transition: transform 0.15s, color 0.25s;
}

.social-icons a:hover {
  transform: translateY(-2px); /* Solo desplazamiento del icono */
}

.social-icons .facebook:hover {
  color: #0e76ff; /* Azul de Facebook */
}

.social-icons .x:hover {
  color: #6ec7ff; /* Azul de Twitter (ahora X) */
}

.social-icons .instagram:hover {
  color: #ff65f5; /* Rosa de Instagram */
}

.social-icons .youtube:hover {
  color: #ed0000; /* Rojo de YouTube */
}
.footer-impact {
  background: linear-gradient(135deg, rgba(255, 255, 255, .06), rgba(255, 255, 255, .02));
  border: 1px solid rgba(255, 255, 255, .15);
  border-radius: 12px;
  padding: 14px 16px;
}

.footer-impact h5 {
  margin: 0 0 10px;
  font-size: 14px;
  opacity: .9;
}

.footer-impact ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 16px;
  justify-items: center; /* Centra los elementos horizontalmente */
  text-align: center; /* Centra el texto dentro de los elementos */
}

.footer-impact li {
  font-size: 13px;
  opacity: .9;
  color: #9CA3AF; /* Color general del texto */
}

.footer-impact li span {
  display: block;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px; /* Separación entre el número y el texto */
}

/* Colores específicos */
.footer-impact li:nth-child(1) span {
  color: #22D3EE; /* Alumnos */
}

.footer-impact li:nth-child(2) span {
  color: #C084FC; /* Ponentes */
}

.footer-impact li:nth-child(3) span {
  color: #F472B6; /* Países */
}

.footer-impact li:nth-child(4) span {
  color: #FB923C; /* Días */
}

/* Línea inferior */
.footer-bottom {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 30px;
  font-size: 12px;
  border-top: 1px solid rgba(255, 255, 255, .2);
  padding-top: 15px;
  opacity: .75;
}

/* Responsive */
@media (max-width: 900px) {
  .footer-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .footer {
    padding-top: 140px;
  }

  .footer-impact ul {
    grid-template-columns: 1fr 1fr;
  }

  .brand-title {
    font-size: 20px;
  }

  .brand-subtitle {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-code.start .code-typing {
    animation: typing 0.01s steps(var(--n)) 0s forwards;
  }
}
</style>

<!-- - <style scoped src="@/assets/css/styles/footer.css"></style> --> -->
