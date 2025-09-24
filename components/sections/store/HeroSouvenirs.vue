<template>
  <v-sheet class="hero py-10 py-md-14">
    <v-container fluid class="px-0">
      <v-row align="center" no-gutters class="mt-8">
        <!-- Texto -->
        <v-col cols="12" md="" class="px-6 px-md-10 pe-md-8">
          <div class="text-white hero-subtitle mb-2">Souvenirs oficiales</div>

          <div
            class="text-white font-orbitron text-h3 text-md-h2 font-weight-black mb-5"
          >
            Innovación que trasciende
          </div>

          <div
            class="text-white text-body-2 text-md-body-1 mb-8"
            style="opacity: 0.95"
          >
            Playeras, termos y accesorios del Congreso de TI. Un detalle para
            recordar la experiencia más allá del evento.
          </div>

          <v-btn
            variant="outlined"
            rounded="xl"
            size="large"
            class="text-white"
            color="white"
            @click="$emit('go-products')"
          >
            <template v-slot:prepend>
              <ShoppingCart :size="20" stroke-width="2" class="lucide mr-2" />
            </template>
            Ver productos
          </v-btn>
        </v-col>

        <!-- Ola -->
<svg
  class="wave"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1440 180"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path
    fill="#ffffff"
    d="M0,130 C220,30 500,60 740,130 C980,170 1220,160 1440,120 L1440,180 L0,180 Z"
  />
</svg>

        
        <!-- Imagen pegada a la orilla derecha -->
        <v-col cols="12" md="5" class="pa-0 d-flex justify-end mt-15">
          <v-img :src="heroImg" class="hero-img d-block" height="100%" cover />
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import heroImg from "~/assets/images/store/heroStore.png";
import { ChevronDown } from "lucide-vue-next";
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800&display=swap");

.font-orbitron {
  font-family: "Orbitron", system-ui, sans-serif;
}

/* ============================
  Estilo general de la hero
================================ */
.hero {
  position: relative;
  background: linear-gradient(135deg, #10308b 0%, #1e66ff 55%, #1ca2ff 100%);
  padding-bottom: 120px; /* Espaciado inferior */
  overflow: hidden;
}

/* ============================
  Estilo del subtítulo
================================ */
.hero-subtitle {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* ============================
  Estilo de la imagen principal
================================ */
.hero-img {
  width: 100%; 
  aspect-ratio: 4 / 5;
  object-position: right center;
  filter: drop-shadow(0 18px 45px rgba(0, 0, 0, 0.35));
  position: relative;
  z-index: 5;
}

/* ============================
  Estilo de la ola
================================ */
.wave {
  position: absolute;
  left: 50%;
  bottom: -4px;
  width: 100%;
  height: auto;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}

/* ============================
  Para pantallas grandes (Macbook, Desktop)
================================ */
@media (min-width: 1280px) {
  .hero-img {
    max-height: 90vh; /* Altura de la imagen en pantallas grandes */
    margin-top: 20vh; /* Espaciado superior */
    object-position: center center; /* Centrar la imagen */
    object-fit: cover; /* Ajustar la imagen para cubrir el área */
  }

  .hero-subtitle {
    font-size: 22px;
  }

  .hero-title {
    font-size: 50px;
  }

  .hero-blurb {
    font-size: 20px;
    margin-bottom: 30px;
  }

  .wave {
    height: 200px;
    margin-top: 50px; /* Ajuste de la ola */
  }
}

/* ============================
  Para tabletas (iPad, Android Tablets)
================================ */
@media (min-width: 820px) and (max-width: 1279px) {
  .hero-img {
    max-height: 140vh; /* Altura de la imagen en tabletas */
    margin-top: 10vh; /* Espaciado superior */
  }

  .wave {
    height: 160px; /* Ajuste de la ola */
  }

  /* Ajustes del texto en tabletas */
  .hero-subtitle {
    font-size: 18px;
    line-height: 1.4; /* Mejorar la legibilidad */
  }

  .hero-title {
    font-size: 45px;
    line-height: 1.3;
  }

  .hero-blurb {
    font-size: 18px;
    margin-bottom: 28px;
    line-height: 1.5;
  }
}

/* ============================
================================ */
@media (min-width: 360px) and (max-width: 819px) {
  .hero-img {
    max-height: 80vh; /* Altura de la imagen en smartphones medianos */
    margin-top: 12.5vh; /* Espaciado superior */
  }

  /* Ajuste de los textos */
  .hero-subtitle {
    font-size: 16px;
    line-height: 1.4; /* Aumentar el interlineado */
  }

  .hero-title {
    font-size: 30px;
    line-height: 1.3;
  }

  .hero-blurb {
    font-size: 12px;
    line-height: 1.4;
  }

  .wave {
    height: 100px;
    margin-top: 5vh; /* Ajuste de la ola */
  }
}

/* ============================
  Para pantallas muy pequeñas (iPhone 5, hasta 320px)
================================ */
@media (max-width: 320px) {
  /* Ajuste de la imagen */
  .hero-img {
    max-height: 60vh; /* Reduce la altura de la imagen */
    margin-top: -5vh; 
  }

  /* Ajuste del texto */
  .hero-subtitle {
    font-size: 14px;
    line-height: 1.4; /* Aumentar el interlineado */
  }

  .hero-title {
    font-size: 24px;
    line-height: 1.3;
  }

  .hero-blurb {
    font-size: 10px;
    line-height: 1.4; /* Mejorar la legibilidad */
  }

  /* Ajuste de la ola */
  .wave {
    height: 70px; /* Reduce la altura de la ola en pantallas pequeñas */
    margin-top: 5vh;
  }

  /* Reducir el padding-bottom para pantallas pequeñas */
  .hero {
    padding-bottom: 5px;
  }
}
</style>
