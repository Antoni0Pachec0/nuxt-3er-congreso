// plugins/gsap.client.ts
import { gsap } from 'gsap';

export default defineNuxtPlugin(() => {
  // Registrar plugins si los necesitas
  // gsap.registerPlugin(ScrollTrigger, TextPlugin, etc.);
  
  return {
    provide: {
      gsap  // ✅ Esto hace que gsap esté disponible en toda la app
    }
  };
});