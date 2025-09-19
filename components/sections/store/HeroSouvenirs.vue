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

        <!-- Imagen pegada a la orilla derecha (sin bleed raro) -->
        <v-col cols="12" md="5" class="pa-0 d-flex justify-end mt-15">
          <v-img :src="heroImg" class="hero-img d-block" height="100%" cover />
        </v-col>
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
  padding-bottom: 120px; /* aumenta para cubrir el espacio que deja la onda */
  overflow: hidden;
}
.hero-subtitle {
  font-size: 20px; /* ajusta a lo que quieras */
  font-weight: 600; /* un poco más fuerte */
  letter-spacing: 0.5px; /* opcional, da aire */
  text-transform: uppercase; /* si lo quieres en mayúsculas */
}

.hero-img {
  width: 100%;
  aspect-ratio: 4 / 5; /* asegura área visible incluso si no hay altura padre */
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
  transform: translateX(-50%, -40px);
  z-index: 2;
  pointer-events: none;
}
@media (min-width: 960px) and (max-width: 1279.98px) {
  .hero-subtitle {
    font-size: 17px;
  }
  .hero-title {
    font-size: 40px;
  }
  .hero-blurb {
    font-size: 16px;
    margin-bottom: 26px;
  }

  .wave {
    height: 170px;
  }
  .hero-img {
    aspect-ratio: auto;
    max-height: 100%;
    margin-top: 14vh; /* ajusta el valor */
  }
}

@media (min-width: 600px) and (max-width: 959.98px) {
  .hero {
    padding-bottom: 120px;
  }
  .hero-copy {
    padding-left: 32px !important;
    padding-right: 32px !important;
  }

  .hero-subtitle {
    font-size: 16px;
  }
  .hero-title {
    font-size: 36px;
  }
  .hero-blurb {
    font-size: 15px;
    margin-bottom: 24px;
  }

  .hero-cta {
    width: 100%;
  } /* aún full-width, UX mobile-like */
  .hero-img {
    aspect-ratio: auto;
    max-height: 100%;
    margin-top: 14vh; /* ajusta el valor */
  }
}
</style>
