<template lang="">
    <section 
        class="principal-speaker-section" 
        :class="[currentSpeaker.theme, { 'is-fading': isFading }]"
    >
        <div class="principal-speaker-img fade-in-section">
            <div class="image-circle-container">
                <img :src="currentSpeaker.photo" :alt="currentSpeaker.name" class="speaker-photo">
            </div>
            <div :class="currentSpeaker.flag"></div>
        </div>
        <div class="container-speaker fade-in-section">
            <h2 class="section-title">{{currentSpeaker.title }}</h2>
            <h1 class="speaker-name">{{currentSpeaker.name }}</h1>
            <p class="speaker-description">{{currentSpeaker.description }}</p>
            
            <a href="#speakers" class="all-speakers-btn fade-in-section">
                <div class="btn-speker">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Ver todos los ponentes
                </div>
            </a>
        </div>
    </section>
</template>

<script>
// Importa ambas imágenes
import speakerImage1 from '@/assets/images/speaker.png';
import speakerImage2 from '@/assets/images/spekaer1.png';

export default {
    data() {
        return {
            // Índice del ponente que se está mostrando actualmente
            currentSpeakerIndex: 0,
            // Estado para controlar la animación de desvanecimiento
            isFading: false,
            // Intervalo para el cambio automático
            speakerInterval: null,
            // Array con la información de todos los ponentes
            speakers: [
                {
                    name: 'Nasly Barrero',
                    title: 'Experta en Ciberseguridad y Transformación Digital:',
                    description: 'Desde Colombia, especialista en ciberseguridad y transformación digital, compartiendo su experiencia internacional en el Congreso TI.',
                    photo: speakerImage1,
                    theme: 'theme-orange',
                    flag: 'flag-colombia'
                },
                {
                    name: 'Benjamín Guzmán',
                    title: 'Desarrollador de Software y Aprendiz Permanente:',
                    description: 'Desarrollador mexicano experto en NodeJS y Go, comparte su visión sobre innovación y mentalidad hacker en el Congreso TI.',
                    photo: speakerImage2,
                    theme: 'theme-blue-purple',
                    flag: 'flag-mexico'
                }
            ]
        };
    },
    computed: {
        // Propiedad computada para obtener fácilmente el objeto del ponente actual
        currentSpeaker() {
            return this.speakers[this.currentSpeakerIndex];
        }
    },
    methods: {
        // Método para cambiar al siguiente ponente con efecto de desvanecimiento
        changeSpeaker() {
            this.isFading = true; // Inicia el desvanecimiento (hace la sección transparente)

            // Espera a que termine la animación de fade-out (500ms) para cambiar el contenido
            setTimeout(() => {
                // Cambia al siguiente ponente, volviendo al primero si llega al final
                this.currentSpeakerIndex = (this.currentSpeakerIndex + 1) % this.speakers.length;
                this.isFading = false; // Termina el desvanecimiento (hace la sección visible de nuevo)
            }, 500); // Este tiempo debe coincidir con la duración de la transición en el CSS
        }
    },
    mounted() {
        // Inicia el cambio automático de ponentes cada 4 segundos
        this.speakerInterval = setInterval(this.changeSpeaker, 4000);
    },
    beforeUnmount() {
        // Es importante limpiar el intervalo cuando el componente se destruye para evitar fugas de memoria
        clearInterval(this.speakerInterval);
    }
};
</script>

<style scoped>
    /* Importa tus estilos existentes */
    @import '~/assets/css/styles/PrincipalSpeaker.css';
</style>