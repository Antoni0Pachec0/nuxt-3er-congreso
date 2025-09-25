<template>
  <div class="hero">
    <!-- Contenedor Principal -->
    <div class="hero-inner">
      <!-- Texto del Hero -->
      <div class="hero-text">
        <p class="hero-subtitle">Souvenirs oficiales</p>
        <h1 class="hero-title">Innovación que trasciende</h1>
        <p class="hero-description">
          Playeras, termos y accesorios del Congreso de TI. Un detalle para
          recordar la experiencia más allá del evento.
        </p>
        <button class="hero-btn" @click="$emit('go-products')">
          <span class="icon">🛒</span> Ver productos
        </button>
      </div>
    </div>

    <!-- Imagen decorativa detrás de la ola -->
    <div class="bg-graphic">
      <img
        src="~/assets/images/store/heroStore.png"
        alt="Decoración"
        class="bg-img"
        loading="eager"
      />
    </div>

    <!-- Ola en la parte inferior -->
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" class="wave">
      <path
        d="M0,224 L60,212 C120,200 240,176 360,176 
           C480,176 600,200 720,200 
           C840,200 960,176 1080,170 
           C1200,164 1320,176 1380,184 
           L1440,192 L1440,320 L0,320 Z"
        fill="#ffffff"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');

/* Contenedor del Hero */
.hero {
padding: 1.2rem 0; 
  position: relative;
  background: linear-gradient(135deg, #10308b 0%, #1e66ff 55%, #1ca2ff 100%);
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  color: #fff;
  min-height: 85vh;
}

/* Contenido del Hero */
.hero-inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 4rem);
  min-height: inherit;
  position: relative;
  z-index: 2;
}

/* Texto dentro del Hero */
.hero-text {
  max-width: 600px;
}

/* Subtítulo */
.hero-subtitle {
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.9;
  margin-bottom: 0.75rem;
}

/* Título principal */
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1rem;
  text-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

/* Descripción */
.hero-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 400;
  line-height: 1.6;
  opacity: 0.95;
  margin-bottom: 1.75rem;
}

/* Botón */
.hero-btn {
  background-color: #fff;
  color: #1e66ff;
  border: 2px solid #fff;
  padding: 0.85rem 1.75rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: clamp(0.9rem, 1.1vw, 1rem);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}

.hero-btn:hover {
  background-color: #1e66ff;
  color: #fff;
  border-color: #1e66ff;
  transform: translateY(-2px);
}

/* Imagen detrás del Hero */
.bg-graphic {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  display: flex;
  justify-content: flex-end; /* derecha en PC */
}

/* Imagen */
.bg-img {
  max-width: 600px;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 25px rgba(0,0,0,0.25));
  z-index: 1;
}

/* Ola */
.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;  /* Tamaño de la ola */
  z-index: 5;    /* Delante de la imagen */
  display: block;
}

/* Responsive */
@media (max-width: 1023px) {
  .hero-inner {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.25rem;
    padding-bottom: calc(2rem + 12vh); /* Ajuste el fondo de la ola */
  }
  .hero-text { padding-right: 0; margin-bottom: 2rem; }
  .hero-img-container { width: 100%; justify-content: center; }
  .bg-graphic { justify-content: center; }
  .bg-img {
    max-width: 400px;
  }
}
@media (max-width: 1023px) {
    .hero{ padding: 5rem 0; }
  .hero-inner {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.25rem;
    padding-bottom: calc(2rem + 12vh); /* Ajusta el fondo de la ola */
  }

  .hero-text {
    padding-right: 0;
    margin-bottom: 2rem;
  }

  .bg-graphic {
    justify-content: center; /* Centra la imagen en tabletas */
  }

  .bg-img {
    max-width: 550px; /* Tamaño ajustado para tabletas */
    margin-top: 30px;  /* Ajusta la imagen para que no se quede pegada al texto */
  }
}

@media (max-width: 480px) {
  .hero{ padding: 5rem 0; }
  .hero-title { font-size: 1.75rem; }
  .hero-description { font-size: 0.95rem; }
  .hero-inner {
    padding-bottom: calc(17.25rem + 15vh); 
  }
}
</style>
