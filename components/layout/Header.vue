<template>
    <header class="appheader">
        <div class="logo">
            <img :src="logo" alt="Logo">
        </div>

        <nav class="nav-links">
            <a href="#">Inicio</a>
            <a href="#">Servicios</a>
            <a href="#">Contacto</a>
            <button href="/login">Login</button>
            <button href="">Registro</button>
        </nav>
    </header>
</template>

<script setup>
import logo from '/assets/images/logo.svg'
import '@/assets/css/styles/Header.css'

onMounted(() => {
    const header = document.querySelector('.appheader')

    const handleScroll = () => {
        if (window.scrollY > window.innerHeight) {
            header.classList.add('scrolled')
        } else {
            header.classList.remove('scrolled')
        }
    }

    window.addEventListener('scroll', handleScroll)
})

</script>
