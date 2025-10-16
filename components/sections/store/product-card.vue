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
import '@/assets/css/styles/pages/conferees/speakers.css';
import {
  Briefcase,
  Lightbulb,
  Shield,
  Code,
  Users,
  Award,
} from 'lucide-vue-next';

const speakers = [
  {
    name: 'Nazly Borrero',
    level: 'empresarial',
    talk: 'Los juegos del hambre y los 6 Distritos de la Ciberguidad.',
    summary:
      'Una mirada a cómo la supervivencia digital se convierte en un juego de poder, control e información. En los 6 Distritos de la Ciberguidad, cada decisión define estrategias, amenazas y alianzas que marcan nuestra defensa tecnológica.',
    iconComponent: Shield,
  },
  {
    name: 'Elena Martínez',
    level: 'magistral',
    talk: 'Arquitecturas de agentes y LLMs locales',
    summary:
      'Cómo ensamblar agentes multi-herramienta con modelos locales, colas de tareas y observabilidad sin perder seguridad.',
    iconComponent: Lightbulb,
  },
  {
    name: 'Carlos Sánchez',
    level: 'empresarial',
    talk: 'Innovación y disrupción en el mercado tecnológico',
    summary:
      'Exploramos las claves para liderar en un entorno cambiante, adaptando estrategias y adoptando nuevas tecnologías para mantener la competitividad.',
    iconComponent: Briefcase,
  },
  {
    name: 'Ana García',
    level: 'magistral',
    talk: 'El futuro del desarrollo web con Vue 4',
    summary:
      'Un vistazo a las próximas características de Vue, optimizaciones de rendimiento y las mejores prácticas para construir aplicaciones escalables.',
    iconComponent: Code,
  },
  {
    name: 'Ricardo Pérez',
    level: 'empresarial',
    talk: 'Gestión de equipos remotos en la era digital',
    summary:
      'Estrategias efectivas para construir y mantener la cohesión en equipos distribuidos, fomentando la productividad y el bienestar.',
    iconComponent: Users,
  },
  {
    name: 'Laura Fernández',
    level: 'magistral',
    talk: 'Inteligencia Artificial y Ética: Desafíos y Oportunidades',
    summary:
      'Análisis de las implicaciones éticas de la IA, cómo diseñar sistemas responsables y el papel de los profesionales en su desarrollo.',
    iconComponent: Award,
  },
];
</script>

<style>
/* Sección */
.speakers {
  --card: #ffffff; /* fondo tarjeta */
  --ink: #0b1534; /* texto principal */
  --muted: #6b7280; /* texto secundario */
  --primary: #2563eb; /* azul marca por defecto */
  --primary-2: #5b8aff; /* azul claro para gradiente por defecto */
  --shadow: 0 20px 45px rgba(4, 14, 44, 0.18);

  background: var(--bg);
  padding: clamp(1.6rem, 4vw, 3rem) 1rem;
}

.speakers-header {
  max-width: 980px;
  margin: 0 auto 1.4rem;
  text-align: center;
  color: #e5e7eb;
}
.speakers-title {
  margin: 0;
  font-weight: 800;
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  color: #0b1534;
}
.faq__underline {
  width: 92px;
  height: 4px;
  border-radius: 999px;
  margin: 0.6rem auto 0.9rem;
  background: var(--primary);
}
.speakers-subtitle {
  margin: 0 auto;
  max-width: 820px;
  color: #0b1534;
  line-height: 1.65;
  font-size: clamp(0.95rem, 1.7vw, 1.05rem);
}

/* Grid */
.speakers-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(1rem, 2.2vw, 1.2rem);
}

/* Card */
.spk-card {
  grid-column: span 12; /* por defecto una por fila */
  background: var(--card);
  border-radius: 18px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.22s ease, filter 0.2s ease;
}
.spk-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 60px rgba(4, 14, 44, 0.22);
}

/* Modificadores de color para tarjetas */
.spk-card--magistral .spk-card__bar {
  background: linear-gradient(90deg, #973bf9, #b86eff); /* Morado */
}
.spk-card--magistral .spk-icon {
  color: #973bf9;
  background: #f0e6ff;
  box-shadow: inset 0 -2px 0 #e0ccff;
}
.spk-card--magistral .spk-pill {
  color: #973bf9;
  background: #f0e6ff;
  border: 1px solid #e0ccff;
}

.spk-card--empresarial .spk-card__bar {
  background: linear-gradient(90deg, #3b6df9, #6a95ff); /* Azul */
}
.spk-card--empresarial .spk-icon {
  color: #3b6df9;
  background: #e6f0ff;
  box-shadow: inset 0 -2px 0 #ccddff;
}
.spk-card--empresarial .spk-pill {
  color: #3b6df9;
  background: #e6f0ff;
  border: 1px solid #ccddff;
}

/* Barra superior */
.spk-card__bar {
  height: 14px;
  background: linear-gradient(90deg, var(--primary), var(--primary-2)); /* Fallback */
}

/* Cuerpo */
.spk-card__body {
  padding: clamp(1rem, 2.6vw, 1.4rem) clamp(1rem, 3vw, 1.6rem);
}

/* Cabecera: icono + nombre + pill */
.spk-head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.35rem;
}
.spk-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #4f75ff; /* Fallback */
  background: #e9efff; /* Fallback */
  box-shadow: inset 0 -2px 0 #dbe7ff; /* Fallback */
}
.spk-titlebox {
  display: grid;
  gap: 0.25rem;
}
.spk-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 0.6rem;
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.2px;
  border-radius: 999px;
  color: #2b59ff; /* Fallback */
  background: #eaf1ff; /* Fallback */
  border: 1px solid #dbe7ff; /* Fallback */
  width: fit-content;
}
.spk-name {
  margin: 0;
  font-weight: 800;
  font-size: clamp(1.05rem, 2.2vw, 1.28rem);
  color: var(--ink);
}

/* Título charla */
.spk-talk {
  margin: 0.35rem 0 0.4rem 0;
  font-weight: 800;
  color: #1f2a44;
  font-size: clamp(1rem, 2.1vw, 1.05rem);
}

/* Descripción */
.spk-desc {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
  font-size: clamp(0.95rem, 1.6vw, 1rem);
}

/* Responsive */
@media (min-width: 700px) {
  .spk-card {
    grid-column: span 6;
  } /* 2 por fila */
}
@media (min-width: 1000px) {
  .spk-card {
    grid-column: span 6;
  } /* 2 por fila (cozy) */
}
</style>