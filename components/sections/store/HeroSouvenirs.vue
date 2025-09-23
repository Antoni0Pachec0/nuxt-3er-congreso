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
            d="M0,150 C220,55 500,100 740,150 C980,185 1220,175 1440,90 L1440,180 L0,180 Z"
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

.hero {
  position: relative;
  background: linear-gradient(135deg, #10308b 0%, #1e66ff 55%, #1ca2ff 100%);
  padding-bottom: 120px;
  overflow: hidden;
}

.hero-subtitle {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.hero-img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-position: right center;
  filter: drop-shadow(0 18px 45px rgba(0, 0, 0, 0.35));
  position: relative;
  z-index: -1;
}

.wave {
  position: absolute;
  left: 50%;
  bottom: -4px;
  width: 100%;
  height: auto;
  transform: translateX(-50%);
  z-index: 5;
  pointer-events: none;
}

/* Para pantallas grandes (Macbook, Desktop) */
@media (min-width: 1280px) {
  .hero-img {
    max-height: 120vh;  /* Ajustar la imagen para ocupar el 90% de la pantalla */
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
    height: 180px;
  }
}

/* Para tabletas (iPad, Android Tablets) */
@media (min-width: 768px) and (max-width: 1279px) {
  .hero-img {
    max-height: 80vh;
    margin-top: 20vh;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-title {
    font-size: 45px;
  }

  .hero-blurb {
    font-size: 18px;
    margin-bottom: 28px;
  }

  .wave {
    height: 160px;
  }
}

/* Para móviles (iPhone, Android) */
@media (max-width: 767px) {
  .hero-img {
    max-height: 100vh;
    margin-top: 35vh;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-blurb {
    font-size: 14px;
  }

  .wave {
    height: 100px;
   margin-top: 15vh;

  }

  .hero {
  /* Mantén el padding-bottom para otras vistas, pero puedes ajustarlo */
  padding-bottom: 10px;
}


}

</style>