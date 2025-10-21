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
      <article
        v-for="speaker in speakers"
        :key="speaker.name"
        class="spk-card"
        :class="{
          'spk-card--magistral': speaker.level === 'magistral',
          'spk-card--empresarial': speaker.level === 'empresarial',
        }"
      >
        <div class="spk-card__bar"></div>

        <div class="spk-card__body">
          <div class="spk-head">
            <div class="spk-icon">
              <component :is="speaker.iconComponent" :size="28" />
            </div>
            <div class="spk-titlebox">
              <span class="spk-pill">{{ speaker.level }}</span>
              <h3 class="spk-name">{{ speaker.name }}</h3>
            </div>
          </div>

          <h4 class="spk-talk">{{ speaker.talk }}</h4>

          <p class="spk-desc">{{ speaker.summary }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>

// Importa los iconos que necesites de lucide-vue-next
import {
  Briefcase,
  Lightbulb,
  Shield,
  Code,
  Users,
  Award,
} from 'lucide-vue-next';

import "@/assets/css/styles/pages/conferees/speakers.css";

const speakers = [

    {
    name: "Adolfo Mateos",
    level: "empresarial",
    talk: "Construyendo asistentes virtuales con IA local y Ollama",
    summary: "Aprende a implementar modelos de IA locales para crear asistentes inteligentes privados, rápidos y personalizables, sin depender de la nube.",
    iconComponent: Users,
  },
  
 
  {
    name: "Benjamín Guzmán",
    level: "magistral",
    talk: "Más allá del título: Resiliencia y aprendizaje continuo",
    summary: "Una invitación a descubrir el valor de la constancia. Lo que define a una persona no es su título, sino su capacidad de seguir aprendiendo.",
    iconComponent: Award, // Icono que representa logro/inspiración
  },
    {
    name: "Natividad Turán",
    level: "empresarial",
    talk: "Uso de librerías de IA para análisis de archivos",
    summary: "Descubre cómo las librerías de IA permiten interpretar, clasificar y extraer información valiosa de grandes volúmenes de documentos de manera automatizada.",
    iconComponent: Lightbulb,
  },
    {
    name: "Diana Reynoso",
    level: "magistral",
    talk: "Blockchain y Tecnologías de Privacidad",
    summary: "Descubre cómo el blockchain redefine la forma en que protegemos nuestros datos e identidades, construyendo un futuro digital sobre bloques de transparencia.",
    iconComponent: Code,
  },

   {
    name: "Nazly Borrero",
    level: "empresarial",
    talk: "Blindaje digital: Construyendo la resiliencia de su empresa.",
    summary: "En un entorno donde la información es valiosa, la protección es prioridad. Blindar una empresa significa anticiparse, adaptarse y fortalecer su capacidad de respuesta.",
    iconComponent: Shield,
  },
  {
    name: "Miguel Ángel Vargas Lomeli",
    level: "magistral",
    talk: "Temática en Inteligencia Artificial",
    summary: "Un recorrido por la mente digital que está transformando el mundo. Una mirada al poder, los límites y la ética de la tecnología que aprende de nosotros.",
    iconComponent: Lightbulb,
  },
    {
    name: "Benjamín Guzmán",
    level: "empresarial",
    talk: "La práctica real del desarrollador de software.",
    summary: "Más allá del código, la práctica real implica resolver problemas y aprender cada día. Un recorrido por los retos y metodologías que moldean el trabajo en software.",
    iconComponent: Briefcase,
  },

  
  {
    name: "Zoreyda Jara Ramos",
    level: "magistral",
    talk: "Alguien fuera de serie",
    summary: "Una historia que celebra la autenticidad, la perseverancia y el poder de ser diferente. Porque destacar no es seguir un patrón, sino atreverse a romperlo.",
    iconComponent: Award,
  },
  {
    name: "Ricardo Hernández",
    level: "empresarial",
    talk: "Realidad Virtual",
    summary: "Una experiencia inmersiva que borra los límites entre lo físico y lo digital, redefiniendo la forma en que aprendemos, creamos y nos conectamos con el mundo.",
    iconComponent: Briefcase,
  },
    {
    name: "Nazly Borrero",
    level: "magistral",
    talk: "La liga de justicia en la Ciberseguridad y sus riesgos míticos.",
    summary: "Una mirada a cómo la supervivencia digital se convierte en un juego de poder, control e información. Cada decisión define estrategias y alianzas.",
    iconComponent: Shield,
  },
  {
    name: "Iván Rosales",
    level: "empresarial",
    talk: "Decisiones Estratégicas frente al Ciber Riesgo",
    summary: "Comprender y gestionar el ciber riesgo permite anticipar amenazas y fortalecer la resiliencia organizacional en un entorno impulsado por la tecnología.",
    iconComponent: Briefcase,
  },
];
</script>
