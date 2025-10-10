<template>
    <section 
        class="principal-speaker-section" 
        :class="[currentSpeaker.theme, { 'is-animating-out': isAnimatingOut }]"
    >
        <div class="principal-speaker-img animatable-item">
            <div class="image-circle-container">
                <img :src="currentSpeaker.photo" :alt="currentSpeaker.name" class="speaker-photo">
            </div>
            <div :class="currentSpeaker.flag"></div>
        </div>

        <div class="container-speaker">
            <h2 class="section-title animatable-item">{{ currentSpeaker.title }}</h2>
            <h1 class="speaker-name animatable-item">{{ currentSpeaker.name }}</h1>
            <p class="speaker-description animatable-item">{{ currentSpeaker.description }}</p>
            
            <a href="#" @click.prevent="showModal" class="all-speakers-btn animatable-item">
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

        <div v-if="isModalVisible" class="speakers-modal__overlay" @click.self="closeModal">
            <div class="speakers-modal__content">
                <button @click="closeModal" class="speakers-modal__close-button">&times;</button>
                <h2>Próximamente</h2>
                <p>La lista completa de ponentes estará disponible muy pronto. ¡Mantente atento!</p>
            </div>
        </div>
    </section>
</template>

<script>
import speakerImage1 from '@/assets/images/speaker.png';
import speakerImage2 from '@/assets/images/spekaer1.png';
import speakerImage3 from '@/assets/images/speaker2.png';

export default {
    data() {
        return {
            currentSpeakerIndex: 0,
            isAnimatingOut: false, // NEW: Reemplaza a 'isFading' para un mejor control
            speakerInterval: null,
            isModalVisible: false, 
            speakers: [
                {
                    name: 'Nazly Borrero',
                    title: 'Experta en Ciberseguridad y Transformación Digital:',
                    description: 'Desde Colombia, especialista en ciberseguridad y transformación digital, compartiendo su experiencia internacional en el Congreso TI.',
                    photo: speakerImage1,
                    theme: 'theme-orange',
                    flag: 'flag-colombia'
                },
                {
                    name: 'Benjamín Guzmán',
                    title: 'Desarrollador de Software y Mentor Autodidacta:',
                    description: 'Desarrollador mexicano experto en NodeJS y Go, comparte su visión sobre innovación y mentalidad hacker en el Congreso TI.',
                    photo: speakerImage2,
                    theme: 'theme-blue-purple',
                    flag: 'flag-mexico'
                },
                {
                    name: 'Zoreyda Jara',
                    title: 'Líder e Inspiración Humana y Pofecional',
                    description: 'Conferencista magistral que inspira con “Alguien fuera de serie”, una charla sobre autenticidad, superación y destacar siendo uno mismo.',
                    photo: speakerImage3,
                    theme: 'theme-pink',
                    flag: 'flag-mexico'
                }
            ]
        };
    },
    computed: {
        currentSpeaker() {
            return this.speakers[this.currentSpeakerIndex];
        }
    },
    methods: {
        // NEW: Lógica de cambio reescrita para la animación escalonada
        changeSpeaker() {
            // 1. Inicia la animación de salida
            this.isAnimatingOut = true; 

            // 2. Espera a que termine la animación de salida (1000ms en este caso)
            // Este tiempo debe ser un poco mayor que la suma de la duración + el mayor retraso de la animación de salida en el CSS.
            setTimeout(() => {
                // 3. Cambia el ponente
                this.currentSpeakerIndex = (this.currentSpeakerIndex + 1) % this.speakers.length;
                
                // 4. Quita la clase de animación de salida.
                // Al quitarla, los elementos (ahora con nuevos datos) ejecutarán su animación de entrada por defecto.
                this.isAnimatingOut = false;
            }, 1000); // 1 segundo para que salgan todos los elementos
        },
        showModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        }
    },
    mounted() {
        // NEW: El intervalo ahora considera el tiempo de animación de entrada, salida y la pausa deseada.
        // Animación de salida (~1s) + Animación de entrada (~1.5s) + Pausa (3s) = 5.5s total
        this.speakerInterval = setInterval(this.changeSpeaker, 5500);
    },
    beforeUnmount() {
        clearInterval(this.speakerInterval);
    }
};
</script>

<style scoped>
    /* Importa tus estilos existentes */
    @import '~/assets/css/styles/PrincipalSpeaker.css';
</style>