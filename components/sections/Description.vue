<template>
    <section id="description" class="description">
        <div class="tittle-description fade-in-bottom" ref="titleRef">
            <h2>El Congreso que Marca el Futuro Digital</h2>
            <div class="line"></div>
        </div>

        <p class="description-text fade-in-bottom" ref="descriptionRef">
            <span class="circle circle-top">
                <SvgIcon type="mdi" :path="pathTop" />
            </span>
            <span class="circle circle-bottom">
                <SvgIcon type="mdi" :path="pathBottom" />
            </span>
            El Congreso de Tecnologías de la Información e Innovación Digital es un espacio académico y
            profesional diseñado para compartir conocimientos, experiencias y tendencias sobre las
            soluciones tecnológicas que están transformando el mundo. Reúne a expertos, estudiantes,
            investigadores y profesionales interesados en temas como desarrollo de software,
            inteligencia artificial, ciberseguridad, innovación digital y transformación empresarial.
        </p>

        <div class="cards-container fade-in-bottom" ref="cardsRef">
            <div v-for="(item, index) in cards" :key="index" class="card">
                <div class="icon">
                    <SvgIcon v-if="item.iconType && item.iconPath" :type="item.iconType" :path="item.iconPath" />
                    <span v-else>{{ item.iconEmoji }}</span>
                </div>
                <h3>{{ item.title }}</h3>
                <div class="line-card"></div>
                <p>{{ item.description }}</p>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import '@/assets/css/styles/Description.css';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiWeb, mdiCloudUploadOutline, mdiBrain, mdiBookOpenVariantOutline, mdiConnection, mdiDumbbell } from '@mdi/js'

const pathTop = mdiWeb
const pathBottom = mdiCloudUploadOutline
const pathBrain = mdiBrain
const pathBook = mdiBookOpenVariantOutline
const pathConnection = mdiConnection
const pathDumbbell = mdiDumbbell

// CAMBIO (1/3): Crear una referencia para el título
const titleRef = ref(null);
const descriptionRef = ref(null);
const cardsRef = ref(null);

let observer;

onMounted(() => {
    const options = {
        root: null, 
        threshold: 0.1,
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // CAMBIO (2/3): Empezar a observar el elemento del título
    if (titleRef.value) {
        observer.observe(titleRef.value);
    }
    if (descriptionRef.value) {
        observer.observe(descriptionRef.value);
    }
    if (cardsRef.value) {
        observer.observe(cardsRef.value);
    }
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
// FIN DEL CAMBIO (3/3): No se necesita hacer nada más.

// Cards (sin cambios)
const cards = [
    {
        title: "Difusión del conocimiento",
        description: "Presentar las últimas tendencias, investigaciones y casos de éxito en tecnologías de la información e innovación digital.",
        iconType: "mdi",
        iconPath: pathBrain,
    },
    {
        title: "Fomentar la innovación",
        description: "Impulsar el uso de soluciones digitales que promuevan la competitividad y la transformación de organizaciones.",
        iconType: "mdi",
        iconPath: pathBook,
    },
    {
        title: "Conexión entre sectores",
        description: "Crear un espacio de networking entre estudiantes, profesionales, empresas e instituciones educativas.",
        iconType: "mdi",
        iconPath: pathConnection,
    },
    {
        title: "Desarrollo de talento",
        description: "Motivar a los participantes a adquirir nuevas habilidades digitales y fortalecer sus competencias tecnológicas.",
        iconType: "mdi",
        iconPath: pathDumbbell,
    },
]
</script>