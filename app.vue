<!-- app.vue -->
<template>
  <div>
    <LoadingOverlay />

    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";

</script>
