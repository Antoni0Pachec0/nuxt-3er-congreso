<template>
    <section id="logos-uni" class="logos-uni-section">
        <div class="carousel">
            <div class="logos-track">
                <div class="logo-uni" v-for="(logo, index) in logos" :key="index">
                    <img :src="logo" alt="Logo" />
                </div>
                <div class="logo-uni" v-for="(logo, index) in logos" :key="'dup-' + index">
                    <img :src="logo" alt="Logo" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import '@/assets/css/styles/Logos-uni.css'

import Edu from '@/assets/images/Edu.png'
import Puebla from '@/assets/images/Puebla.png'
import SecEdu from '@/assets/images/SecEdu.png'
import Peg from '@/assets/images/Peg.png'
import Pap from '@/assets/images/Pap.png'
import Utp from '@/assets/images/Utp.png'
import Uttecam from '@/assets/images/Uttecam.jpeg'

const logos = [Edu, Puebla, SecEdu, Peg, Pap, Utp, Uttecam]
</script>

