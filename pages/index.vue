<template>
    <main>
    <Hero/>
    <Description/>
    <Location/>    
    <SectionsGalleryCarousel :slides="slides" :stats="stats" :autoplay="true" :intervalMs="5000" />
    <Maps/>
    <Location_uni />
    <SectionsFaqAccordion :items="faqItems" :singleOpen="true" />
  </main>
</template>

<script setup lang="ts">
import Hero from '@/components/sections/Hero.vue'
import Description from '@/components/sections/Description.vue'
import Maps from '@/components/sections/Mapa.vue'
import Location_uni from '@/components/sections/Location_Uni.vue'

import evento2018 from '@/assets/img/gallery/evento2018.jpeg'
import evento2019 from '@/assets/img/gallery/evento2019.jpeg'
import evento2021 from '@/assets/img/gallery/evento2021.jpeg'
import evento2022 from '@/assets/img/gallery/evento2022.jpeg'
import evento2023 from '@/assets/img/gallery/evento2023.jpeg'
import evento2024 from '@/assets/img/gallery/evento2024.jpeg'


const slides = [
  {
    year: '2024',
    title: '2do Congreso De Tecnología De La Información E Innovación Digital',
    description: 'Se contó con la presencia de invitados externos que compartieron experiencias sobre innovación y tendencias en TI.',
    image: evento2024,
    thumb: evento2024
  },
  {
    year: '2023',
    title: '1er Congreso De Tecnología De La Información E Innovación Digital',
    description: 'Un primer esfuerzo por reunir a la comunidad estudiantil con conferencistas invitados del sector tecnológico.',
    image: evento2023,
    thumb: evento2023
  },
  {
    year: '2022',
    title: 'Software Freedom Day 2022',
    description: 'Se ofrecieron pláticas introductorias al software libre y a la cultura open source, impartidas por invitados especiales.',
    image: evento2022,
    thumb: evento2022
  },
  {
    year: '2021',
    title: 'Software Freedom Day 2021',
    description: 'Invitados presentaron temas básicos de ciberseguridad y programación, fomentando la participación de alumnos.',
    image: evento2021,
    thumb: evento2021
  },
  {
    year: '2019',
    title: 'Software Freedom Day 2019',
    description: 'Pequeño encuentro con charlas sobre desarrollo web y la importancia del uso de software libre.',
    image: evento2019,
    thumb: evento2019

  },
  {
    year: '2018',
    title: 'Software Freedom Day 2018',
    description: 'Primera edición organizada en la universidad con invitados que hablaron sobre herramientas tecnológicas abiertas.',
    image: evento2018,
    thumb: evento2018
  },
]


const stats = [
  { number: '7+', label: 'Años de Historia' },
  { number: '225+', label: 'Ponentes' },
  { number: '2160+', label: 'Participantes' },
  { number: '3+', label: 'Países' }
]
const faqItems = [
  {
    q: '¿Tiene algún costo la inscripción?',
    a: 'Sí, la inscripción tiene un costo de <strong>$380 MXN</strong>.'
  },
  {
    q: '¿Quiénes pueden asistir al congreso?',
    a: 'Cualquier persona interesada y apasionada en la tecnología puede participar.'
  },
  {
    q: '¿El evento será presencial, en línea o híbrido?',
    a: 'El congreso será <strong>totalmente presencial</strong> dentro de la universidad.'
  },
  {
    q: '¿Puedo inscribirme a todos los talleres o tienen cupo limitado?',
    a: 'Con tu inscripción pagada puedes elegir <strong>un taller</strong> con cupo para <strong>20 personas</strong>. En caso de que se llene, se te asignará otro disponible.'
  },
  {
    q: '¿Habrá constancia o certificado de participación?',
    a: 'Sí, se habilitará tu constancia si cumples con al menos el <strong>80% de asistencia</strong> al evento.'
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos <strong>efectivo</strong> y <strong>pago en línea</strong>.'
  },
  {
    q: '¿Qué incluye mi registro?',
    a: 'Tu registro incluye: <strong>Conferencia, taller, souvenirs</strong> (playera oficial, cilindro y regalo sorpresa) y <strong>snacks</strong>.'
  },

]
</script>