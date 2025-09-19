<!-- app.vue -->
<template>
  <div>
    <!-- Header solo si NO es login o register -->
    <Header
      v-if="
        $route.path !== '/login' &&
        $route.path !== '/register' &&
        $route.path !== '/verify'
      "
    />

    <NuxtPage />

    <!-- Footer solo si NO es login o register -->
    <Footer
      v-if="
        $route.path !== '/login' &&
        $route.path !== '/register' &&
        $route.path !== '/verify'
      "
    />
  </div>
</template>

<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
</script>
