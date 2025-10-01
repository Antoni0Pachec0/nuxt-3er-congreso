<template>
  <section class="speakers" id="speakers">
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
import '~/assets/css/styles/conferees/Speakers.css'


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

