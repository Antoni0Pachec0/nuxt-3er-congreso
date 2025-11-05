<template>
  <section class="workshops-section" id="workshops">
    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`" role="status" aria-live="polite">
        <strong class="toast-title">{{ toast.type === 'success' ? 'Listo' : 'Aviso' }}</strong>
        <p class="toast-msg">{{ toast.message }}</p>
        <button class="toast-close" @click="toast.show = false" aria-label="Cerrar">×</button>
      </div>
    </transition>

    <!-- Modal pago -->
    <transition name="fade">
      <div v-if="showPaymentModal" class="confirm-backdrop" @click.self="showPaymentModal = false" role="dialog" aria-modal="true">
        <div class="payment-modal">
          <div class="modal-header">
            <h3 class="modal-title">Pago requerido</h3>
            <button @click="showPaymentModal = false" class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <p>Para poder inscribirte en un taller, debes:</p>
            <ul class="payment-steps">
              <li><CheckCircle class="mi-icon ok" /> Haber pagado el congreso</li>
              <li><Info class="mi-icon warn" /> Esperar la validación del administrador</li>
              <li><Info class="mi-icon warn" /> Para pago inmediato sin validación, usa tarjeta crédito/débito con el botón Inscríbete.</li>
            </ul>
            <p class="modal-note">Una vez verificado tu pago, podrás inscribirte.</p>
          </div>
          <div class="modal-footer">
            <button @click="showPaymentModal = false" class="btn btn-secondary">Entendido</button>
            
            <button @click="goToInscription" class="btn btn-primary">Inscríbete ahora</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal confirmación inscripción -->
    <transition name="fade">
      <div v-if="confirmModal.open" class="confirm-backdrop" @click.self="closeConfirm()" role="dialog" aria-modal="true">
        <div class="payment-modal">
          <div class="modal-header">
            <h3 class="modal-title">Confirmar inscripción</h3>
            <button @click="closeConfirm()" class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <p>
              ¿Confirmas tu inscripción al taller
              <strong v-if="confirmModal.workshopName">“{{ confirmModal.workshopName }}”</strong>?
            </p>
            <p class="modal-note">Solo puedes estar inscrito en <strong>un</strong> taller.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeConfirm()">Cancelar</button>
            <button class="btn btn-primary" :disabled="confirmModal.loading" @click="confirmEnroll()">
              {{ confirmModal.loading ? 'Inscribiendo…' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Carga / error -->
    <div v-if="loading" class="loading-state" role="status" aria-live="polite">
      <div class="loading-spinner"></div>
      <p>Cargando talleres...</p>
    </div>

    <div v-else-if="error && !hasWorkshops" class="error-state" role="alert">
      <div class="error-icon"><Info class="mi-icon lg" /></div>
      <h3>Error al cargar los talleres</h3>
      <p>{{ error }}</p>
      <button @click="loadWorkshops" class="btn retry-btn">Reintentar</button>
    </div>

    <!-- Contenido -->
    <div v-else>
      <header class="workshop-header">
        <h2 class="workshop-title">Talleres Prácticos</h2>
        <div class="workshop-underline"></div>
        <p class="workshop-subtitle">Explora todos los talleres disponibles del congreso.</p>

        <div v-if="isAuthenticated" class="user-workshop-status">
          <div v-if="userWorkshop" class="user-selected-workshop">
            <div class="selected-badge">
              <CheckCircle class="mi-icon ok" />
              <span class="badge-text">Ya estás inscrito en: <strong>{{ userWorkshop.name }}</strong></span>
            </div>
            <p class="selected-note">Solo puedes estar inscrito en un taller.</p>
          </div>
          <div v-else class="user-selection-info">
            <p>Selecciona el taller de tu preferencia</p>
            <p class="selection-subtitle">Tu estado de inscripción se mostrará en cada tarjeta.</p>
          </div>
        </div>
      </header>

      <!-- Cards -->
      <div v-if="hasWorkshops" class="workshop-grid">
        <article
          v-for="workshop in workshops"
          :key="workshop.id"
          class="workshop-card"
          :class="[levelClass(workshop), { 'user-enrolled': workshop.is_user_enrolled }]"
        >
          <div class="workshop-card-header" :style="{ background: workshop.gradient }">
            <div class="workshop-header-top">
              <div class="workshop-header-icon-wrap" :class="levelClass(workshop)">
                <component :is="iconMap[workshop.icon]" class="workshop-header-icon" />
              </div>
              <div class="workshop-badges">
                <span class="workshop-badge" :class="levelClass(workshop)">{{ workshop.level }}</span>
                <span v-if="workshop.is_user_enrolled" class="enrolled-badge">
                  <CheckCircle class="mi-icon ok" /> Tu taller
                </span>
                <span v-else-if="workshop.available_spots === 0 && workshop.spots_max > 0" class="full-badge">
                  <Lock class="mi-icon" /> Cupo lleno
                </span>
              </div>
            </div>
            <div class="workshop-header-info">
              <h3 class="workshop-name">{{ workshop.name }}</h3>
              <p class="workshop-category">{{ workshop.category }}</p>
            </div>
          </div>

          <div class="workshop-card-body">
            <p class="workshop-desc">{{ workshop.description }}</p>
            <ul v-if="Array.isArray(workshop.tools) && workshop.tools.length" class="tools-list" aria-label="Herramientas">
              <li v-for="t in workshop.tools" :key="t" class="tool-chip">{{ t }}</li>
            </ul>

            <div class="workshop-spots">
              <div class="spots-info">
                <span class="spots-text">
                  Cupos: {{ workshop.spots_occupied || 0 }}/{{ workshop.spots_max || 'Ilimitado' }}
                  <span v-if="workshop.available_spots > 0 && workshop.spots_max > 0" class="available-text">
                    ({{ workshop.available_spots }} disponibles)
                  </span>
                </span>
                <div v-if="workshop.spots_max > 0" class="spots-bar">
                  <div
                    class="spots-progress"
                    :class="{ 'spots-full': workshop.available_spots === 0 }"
                    :style="{ width: `${Math.min((workshop.spots_occupied / workshop.spots_max) * 100, 100)}%` }"
                  />
                </div>
              </div>
            </div>

            <ul class="workshop-info">
              <li><User class="infoiconw" /> {{ workshop.instructor }}</li>
              <li><Clock class="infoiconw" /> {{ workshop.duration }}</li>
              <li><Calendar class="infoiconw" /> {{ workshop.date }}</li>
              <li><MapPin class="infoiconw" /> {{ workshop.location }}</li>
            </ul>

            <div class="enrollment-section">
              <button
              v-if="getEnrollmentButton(workshop).showButton"
              @click="getEnrollmentButton(workshop).action && getEnrollmentButton(workshop).action()"
              :disabled="getEnrollmentButton(workshop).disabled"
              class="enroll-btn"
              :class="`enroll-btn--${getEnrollmentButton(workshop).variant}`"
              :title="getEnrollmentButton(workshop).tooltip"
            >
              {{ getEnrollmentButton(workshop).text }}
            </button>

              <!-- Ya no se muestra nota 'login-required' -->
              <div
                v-if="['needs-payment','disabled','selected','enroll'].includes(getEnrollmentButton(workshop).variant)"
                class="enrollment-note"
                :class="`note--${getEnrollmentButton(workshop).variant}`"
              >
                <span v-if="getEnrollmentButton(workshop).variant === 'needs-payment'">Requiere pago verificado</span>
                <span v-else-if="getEnrollmentButton(workshop).variant === 'disabled'">Cupo agotado</span>
                <span v-else-if="getEnrollmentButton(workshop).variant === 'selected'">Taller seleccionado</span>
                <span v-else-if="getEnrollmentButton(workshop).variant === 'enroll'">Disponible para inscripción</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon"><Info class="mi-icon xl" /></div>
        <h3>No hay talleres disponibles</h3>
        <p>No se encontraron talleres activos en este momento.</p>
        <button @click="loadWorkshops" class="btn retry-btn">Reintentar</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import "@/assets/css/styles/pages/workshops/workshops-list.css";
import {
  User, Clock, Calendar, MapPin, CheckCircle, Lock, Info,
  Code2, Cpu, Database, Smartphone, Shield, Network, Wrench, GitBranchPlus
} from "lucide-vue-next";
import { useRouter } from 'vue-router' // Asegúrate de que esto esté
import { useWorkshops } from "@/composables/workshop/use-workshops";

const iconMap = { Cpu, Code2, Smartphone, Shield, Network, Database, Wrench, GitBranchPlus }
const router = useRouter()
const {
  workshops, loading, error, toast, showPaymentModal,
  hasWorkshops, isAuthenticated, userWorkshop,
  loadWorkshops, getEnrollmentButton,
  confirmModal, openConfirm, closeConfirm, confirmEnroll
} = useWorkshops();
const goToInscription = () => {
  // Oculta el modal
  showPaymentModal.value = false // Asumiendo que showPaymentModal es un ref
  
  // Navega a la página de inscripción (sin recargar)
  router.push('/user/inscription')
}

const levelClass = (workshop) => {
  const lvl = (workshop.level || "").toLowerCase();
  if (lvl.includes("avanz")) return "level-advanced";
  if (lvl.includes("inter")) return "level-intermediate";
  return "level-beginner";
};
</script>
