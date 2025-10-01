<template>
  <section class="speakers">
    <div class="speakers-header">
      <h2 class="speakers-title">Conferencistas Destacados</h2>
      <div class="faq__underline"></div>

      <p class="speakers-subtitle">
        Participa en las conferencias guiadas por ponentes de gran trayectoria.
        Sus aportes fortalecen la formación académica y profesional de nuestra
        comunidad.
      </p>
    </div>

    <div class="speakers-grid">
      <div v-for="speaker in speakers" :key="speaker.name" class="speaker-card">
        <!-- Imagen -->
        <div class="speaker-img-wrapper">
          <img :src="speaker.image" :alt="speaker.name" class="speaker-img" />
        </div>

        <!-- Info -->
        <div class="speaker-info">
          <h3 class="speaker-name">{{ speaker.name }}</h3>
          <p class="speaker-role">{{ speaker.role }}</p>
          <p class="speaker-company">{{ speaker.company }}</p>

          <button class="speaker-tag">
            {{ speaker.tag }}
          </button>

          <p class="speaker-bio">{{ speaker.bio }}</p>

          <!-- Redes sociales -->
          <!-- Redes sociales -->
          <div class="speaker-socials">
            <a
              v-for="(social, i) in speaker.socials"
              :key="i"
              :href="social.link"
              target="_blank"
              class="social-icon"
              :class="social.name"
            >
              <!-- Si trae componente (lucide) -->
              <component v-if="social.icon" :is="social.icon" class="icon" />
              <!-- Si trae imagen (tu PNG/SVG) -->
              <img
                v-else-if="social.src"
                :src="social.src"
                alt=""
                class="icon"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Facebook, Linkedin, Instagram } from "lucide-vue-next";
import RobertoSpeaker from "~/assets/images/conferees/speakers/RobertoSpeaker.png";
import ElenaSpeaker from "~/assets/images/conferees/speakers/ElenaSpeaker.png";
import IconX from "~/assets/images/conferees/icon/IconX.png";

const speakers = [
  {
    name: "Roberto Silva",
    role: "AI Research Director",
    company: "Neural Networks Co.",
    tag: "AI & Machine Learning",
    bio: "PhD en Deep Learning por Stanford con 50+ publicaciones. Ex-investigador en Google DeepMind y OpenAI. Consultor principal para Microsoft, NVIDIA y las startups de IA más disruptivas del Silicon Valley.",
    image: RobertoSpeaker,
    socials: [
      { name: "facebook", icon: Facebook, link: "#" },
      { name: "linkedin", icon: Linkedin, link: "#" },
      { name: "x", iconType: "img", src: IconX, link: "#" }, // 👈 usa la variable importada

      { name: "instagram", icon: Instagram, link: "#" },
    ],
  },
  {
    name: "Elena Martínez",
    role: "Senior Architect",
    company: "TechVision Labs",
    tag: "Full Stack Development",
    bio: "Arquitecta de software con 12+ años creando aplicaciones escalables para Fortune 500. Pionera en microservicios y arquitecturas cloud-native. Speaker internacional en AWS re:Invent y Google Cloud Next.",
    image: ElenaSpeaker,
    socials: [
      { name: "facebook", icon: Facebook, link: "#" },
      { name: "linkedin", icon: Linkedin, link: "#" },
      { name: "x", iconType: "img", src: IconX, link: "#" }, // 👈 usa la variable importada

      { name: "instagram", icon: Instagram, link: "#" },
    ],
  },
    {
    name: "Roberto Silva",
    role: "AI Research Director",
    company: "Neural Networks Co.",
    tag: "AI & Machine Learning",
    bio: "PhD en Deep Learning por Stanford con 50+ publicaciones. Ex-investigador en Google DeepMind y OpenAI. Consultor principal para Microsoft, NVIDIA y las startups de IA más disruptivas del Silicon Valley.",
    image: RobertoSpeaker,
    socials: [
      { name: "facebook", icon: Facebook, link: "#" },
      { name: "linkedin", icon: Linkedin, link: "#" },
      { name: "x", iconType: "img", src: IconX, link: "#" }, // 👈 usa la variable importada

      { name: "instagram", icon: Instagram, link: "#" },
    ],
  },  {
    name: "Elena Martínez",
    role: "Senior Architect",
    company: "TechVision Labs",
    tag: "Full Stack Development",
    bio: "Arquitecta de software con 12+ años creando aplicaciones escalables para Fortune 500. Pionera en microservicios y arquitecturas cloud-native. Speaker internacional en AWS re:Invent y Google Cloud Next.",
    image: ElenaSpeaker,
    socials: [
      { name: "facebook", icon: Facebook, link: "#" },
      { name: "linkedin", icon: Linkedin, link: "#" },
      { name: "x", iconType: "img", src: IconX, link: "#" }, 

      { name: "instagram", icon: Instagram, link: "#" },
    ],
  },
];
</script>

<style scoped>
.speakers {
  padding: 4rem 1rem;
  max-width: 1500px;
  margin: 0 auto;
}

.speakers-header {
  text-align: center;
  margin-bottom: 3rem;
}

.speakers-title {
  font-size: clamp(2rem, 5vw, 2.6rem);
  font-weight: 900;
}

.speakers-subtitle {
  max-width: 700px;
  margin: 0 auto;
  color: #555;
  font-size: 1rem;
  margin-bottom: 6rem;
}

/* Grid */
.speakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 5rem;
}

/* Card */
.speaker-card {
  position: relative;
  display: flex;
  background: linear-gradient(135deg, #bfdbfe, #ffffff);
  border: 2px solid #60a5fa;
  border-radius: 16px;
  padding: 2rem;
  overflow: visible;
  min-height: 420px;
}

/* Imagen */
.speaker-img-wrapper {
  position: absolute;
  bottom: 0;
  left: 1rem;
}

.speaker-img {
  width: 300px;
  height: 480px;
  border-radius: 12px;
  object-fit: cover;
}

/* Info */
.speaker-info {
  flex: 1;
  margin-left: 280px;
}

.speaker-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.speaker-role {
  font-weight: 600;
  color: #2563eb;
}

.speaker-company {
  margin-bottom: 0.8rem;
  color: #666;
}
.faq__underline {
  width: 80px;
  height: 4px;
  background: #2563eb;
  border-radius: 999px;
  margin: 10px auto 0;
  margin-bottom: 1rem;
}

.speaker-tag {
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 1rem 0;
}

.speaker-bio {
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  max-width: 90%;
}
/* Redes sociales estilo tarjeta */
.speaker-socials {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px; /* esquinas más redondeadas */
  width: 65px;
  height: 65px;
  background: #f9fafb; /* gris claro por defecto */
  transition: all 0.3s ease;
}

.social-icon .icon {
  width: 28px;
  height: 28px;
}

/* Estilos específicos por red */
.social-icon.facebook {
  background: #eff6ff; /* azul muy suave */
  color: #1877f2;
}
.social-icon.linkedin {
  background: #eef2ff;
  color: #0a66c2;
}
.social-icon.x {
  background: #f9fafb;
  color: #000;
}
.social-icon.instagram {
  background: #fff0f5;
  color: #e1306c;
}

/* Hover: un poco de sombra y escala */
.social-icon:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 992px) {
  .speaker-info {
    margin-left: 250px;
  }
}

@media (max-width: 768px) {
  .speakers-grid {
    grid-template-columns: 1fr;
  }

  .speaker-card {
    flex-direction: column;
    text-align: center;
    align-items: center;
    padding-top: 6rem;
    min-height: auto;
  }

  .speaker-img-wrapper {
    position: relative;
    bottom: auto;
    left: auto;
    margin-bottom: 1rem;
  }

  .speaker-img {
    width: 200px;
    height: auto;
    transform: translateY(-20px);
  }

  .speaker-info {
    margin-left: 0;
    text-align: center;
  }

  .speaker-socials {
    justify-content: center;
  }

  .social-icon {
    width: 50px;   
    height: 50px;
  }

  .social-icon .icon {
    width: 22px;   
    height: 22px;
  }
}

</style>
