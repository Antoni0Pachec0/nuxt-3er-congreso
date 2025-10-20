<template>
  <div class="logos-carousel">
    <div class="logos-track">
      <!-- repetimos 3 veces el set para asegurar continuidad -->
      <div
        class="logo-box"
        v-for="(logo, index) in repeatedLogos"
        :key="index"
      >
        <img :src="logo" alt="logo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/styles/pages/logos-uni.css' 

import Edu from '@/assets/img/pages/logo.png'
import Puebla from '@/assets/img/pages/puebla.webp'
import SecEdu from '@/assets/img/pages/sec-edu.webp'
import Peg from '@/assets/img/pages/peg.webp'
import Pap from '@/assets/img/pages/pap.webp'
import Utp from '@/assets/img/pages/utp.webp'
import Uttecam from '@/assets/img/pages/uttecam.webp'

const logos = [Edu, Puebla, SecEdu, Peg, Pap, Utp, Uttecam]

const repeatedLogos = [...logos, ...logos, ...logos]
</script>
