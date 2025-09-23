<template>
    <section id="description" class="description">
        <div class="tittle-description">
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
// CAMBIO: Importar las funciones necesarias de Vue
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

// CAMBIO: Lógica para la animación con Intersection Observer
// 1. Crear referencias para los elementos del DOM que vamos a animar
const descriptionRef = ref(null);
const cardsRef = ref(null);

let observer;

// 2. Usar onMounted para asegurarnos de que el DOM esté listo
onMounted(() => {
    const options = {
        root: null, // Observa la intersección con el viewport
        threshold: 0.1, // La animación se activa cuando el 10% del elemento es visible
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento está visible en la pantalla...
            if (entry.isIntersecting) {
                // ...le añadimos la clase que activa la animación CSS
                entry.target.classList.add('is-visible');
                // Dejamos de observar el elemento para que la animación no se repita
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // 3. Empezar a observar los elementos que hemos referenciado
    if (descriptionRef.value) {
        observer.observe(descriptionRef.value);
    }
    if (cardsRef.value) {
        observer.observe(cardsRef.value);
    }
});

// 4. Limpiar el observador cuando el componente se desmonte para evitar fugas de memoria
onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
// FIN DEL CAMBIO

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