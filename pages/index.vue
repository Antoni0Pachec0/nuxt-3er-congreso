<template>
    <main>
    <Hero id="Inicio"/>
    <Description id="Enfoque"/>
    <PrincipalSpeaker id="Conferencista"/>
    <SectionsGalleryCarousel id="Galeria" :slides="slides" :stats="stats" :autoplay="true" :intervalMs="5000" />
    <Maps id="Ubicacion" />
    <Location_uni id="Mapa" />
    <SectionsFaqAccordion id="PregFrec" :items="faqItems" :singleOpen="true" />
    <Logos/>
  </main>
</template>

<script setup lang="ts">
import Hero from '@/components/sections/hero.vue'
import Description from '~/components/sections/description.vue'
import sectionsGalleryCarousel from '@/components/sections/gallery-carousel.vue'
import Maps from '~/components/sections/mapa.vue'
import Location_uni from '@/components/sections/location-uni.vue'
import sectionsFaqAccordion from '@/components/sections/sections-faq-accordion.vue'
import Logos from '~/components/sections/logos-uni.vue'

import PrincipalSpeaker from '@/components/sections/conferees/principal-speaker.vue'

import evento2018 from '@/assets/img/events/evento-2018.jpeg'
import evento2019 from '@/assets/img/events/evento-2019.jpeg'
import evento2021 from '@/assets/img/events/evento-2021.jpeg'
import evento2022 from '@/assets/img/events/evento-2022.jpeg'
import evento2023 from '@/assets/img/events/evento-2023.jpeg'
import evento2024 from '@/assets/img/events/evento-2024.jpeg'

definePageMeta({
  name: 'home',
  path: '/',
  guestOnly: true, // 🧍 solo accesible si NO hay sesión
})

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
import {
  mdiCash,
  mdiAccountGroup,
  mdiMapMarker,
  mdiClipboardList,
  mdiCertificate,
  mdiCreditCard,
  mdiGift
} from '@mdi/js'

const faqItems = [
  {
    q: '¿Tiene algún costo la inscripción?',
    a: 'Sí, la inscripción tiene un costo de <strong>$380 MXN</strong>.',
    icon: mdiCash
  },
  {
    q: '¿Quiénes pueden asistir al congreso?',
    a: 'Cualquier persona interesada y apasionada en la tecnología puede participar.',
    icon: mdiAccountGroup
  },
  {
    q: '¿El evento será presencial, en línea o híbrido?',
    a: 'El congreso será <strong>totalmente presencial</strong> dentro de la universidad.',
    icon: mdiMapMarker
  },
  {
    q: '¿Puedo inscribirme a todos los talleres o tienen cupo limitado?',
    a: 'Con tu inscripción pagada puedes elegir <strong>un taller</strong> con cupo para <strong>20 personas</strong>...',
    icon: mdiClipboardList
  },
  {
    q: '¿Habrá constancia o certificado de participación?',
    a: 'Sí, se habilitará tu constancia si cumples con al menos el <strong>80% de asistencia</strong>.',
    icon: mdiCertificate
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos <strong>efectivo</strong> y <strong>pago en línea</strong>.',
    icon: mdiCreditCard
  },
  {
    q: '¿Qué incluye mi registro?',
    a: 'Tu registro incluye: <strong>Conferencia, taller, souvenirs</strong> (playera oficial y cilindro) y <strong>snacks</strong>.',
    icon: mdiGift
  }
]

</script>