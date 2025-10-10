<template>
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
            <h2 class="section-title">{{ currentSpeaker.title }}</h2>
            <h1 class="speaker-name">{{ currentSpeaker.name }}</h1>
            <p class="speaker-description">{{ currentSpeaker.description }}</p>
            
            <a href="#" @click.prevent="showModal" class="all-speakers-btn fade-in-section">
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
// Importa ambas imágenes
import speakerImage1 from '@/assets/images/speaker.png';
import speakerImage2 from '@/assets/images/spekaer1.png';

export default {
    data() {
        return {
            currentSpeakerIndex: 0,
            isFading: false,
            speakerInterval: null,
            isModalVisible: false, 
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
        currentSpeaker() {
            return this.speakers[this.currentSpeakerIndex];
        }
    },
    methods: {
        changeSpeaker() {
            this.isFading = true; 

            setTimeout(() => {
                this.currentSpeakerIndex = (this.currentSpeakerIndex + 1) % this.speakers.length;
                this.isFading = false;
            }, 500);
        },
        showModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        }
    },
    mounted() {
        this.speakerInterval = setInterval(this.changeSpeaker, 4000);
    },
    beforeUnmount() {
        clearInterval(this.speakerInterval);
    }
};
</script>

<style scoped>
    /* Importa tus estilos existentes */
    @import '~/assets/css/styles/PrincipalSpeaker.css';

    /* Estilos para el Modal con clases renombradas */
    .speakers-modal__overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .speakers-modal__content {
        background-color: #fff;
        padding: 25px 35px;
        border-radius: 10px;
        text-align: center;
        position: relative;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        color: #333;
        max-width: 90%;
        width: 350px;
    }

    .speakers-modal__content h2 {
        margin-top: 0;
        font-size: 24px;
        color: #2c3e50;
    }
    
    .speakers-modal__content p {
        font-size: 16px;
        margin-bottom: 0;
    }

    .speakers-modal__close-button {
        position: absolute;
        top: 10px;
        right: 15px;
        border: none;
        background: transparent;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: #aaa;
        padding: 0;
        line-height: 1;
    }

    .speakers-modal__close-button:hover {
        color: #333;
    }
</style>