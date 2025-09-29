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
import '~/assets/css/styles/Logos-uni.css'

import Edu from '@/assets/images/Edu.webp'
import Puebla from '@/assets/images/Puebla.webp'
import SecEdu from '@/assets/images/SecEdu.webp'
import Peg from '@/assets/images/Peg.webp'
import Pap from '@/assets/images/Pap.webp'
import Utp from '@/assets/images/Utp.webp'
import Uttecam from '@/assets/images/Uttecam.webp'

const logos = [Edu, Puebla, SecEdu, Peg, Pap, Utp, Uttecam]

const repeatedLogos = [...logos, ...logos, ...logos]
</script>
