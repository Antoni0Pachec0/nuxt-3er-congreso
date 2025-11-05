<template>
    <section class="inscP" aria-labelledby="gifts-title">
        <header class="insc-hdr">
            <h2 id="gifts-title" class="insc-title">¡Tu inscripción incluye regalos oficiales!</h2>
            <div class="insc-underline" aria-hidden="true"></div>
            <p class="insc-subtitle">
                Tu pago asegura productos exclusivos para disfrutar del Congreso y recordar esta experiencia.
            </p>
        </header>

        <div class="insc-grid">
            <GiftsCard title="Playera"
                description="Algodón suave premium, corte unisex y confort diario con serigrafía del Congreso 2025."
                :image-src="playeraImg" image-alt="Playera oficial del Congreso 2025"
                accent="indigo" />
            <GiftsCard title="Botella"
                description="Reutilizable y ecológica; impresión de logo oficial, ligera y resistente para uso diario."
                :image-src="botellaImg" image-alt="Botella reutilizable azul con logo del Congreso"
                accent="sky" />
            <GiftsCard title="Bolsa"
                description="Lona gruesa resistente; estilo minimalista para uso diario y estampado duradero."
                :image-src="bolsaImg" image-alt="Bolsa de lona azul con logo del Congreso"
                accent="blue" />
        </div>

        <div class="insc-cta-wrap">
            <GiftsCta :label="ctaText" @click="$emit('cta')" />
        </div>
    </section>
</template>

<script setup lang="ts">
import GiftsCard from '@/components/sections/inscription/gift-card.vue'
import GiftsCta from '@/components/sections/inscription/gift-cta.vue'
import playeraImg from '@/assets/img/pages/inscription/playera_1.webp';
import botellaImg from '@/assets/img/pages/inscription/termo_1.webp';
import bolsaImg from '@/assets/img/pages/inscription/bolsa.webp';

defineProps<{ ctaText?: string }>()
defineEmits<{ (e: 'cta'): void }>()
</script>
