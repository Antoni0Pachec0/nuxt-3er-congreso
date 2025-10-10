<template>
  <div class="table-container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Talleres</h1>
      <p class="subtitle">Administra los talleres del congreso</p>
    </div>

    <div class="hr-line"></div>

    <!-- Barra de búsqueda + filtro + botón -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre, instructor o salón..."
        class="search-input"
      />

      <div class="mini-select" ref="msRef">
        <button class="mini-trigger" type="button" @click="msToggle()">
          <span>{{ selectedFilter }}</span>
          <svg class="chev" viewBox="0 0 24 24" width="18" height="18">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>

        <transition name="ms">
          <ul v-if="msOpen" class="mini-options">
            <li
              v-for="(opt, i) in filterOptions"
              :key="opt"
              class="mini-option"
              :class="{ active: i === msActive, selected: opt === selectedFilter }"
              @mouseenter="msActive = i"
              @mousedown.prevent.stop="pickMs(opt)"
            >
              {{ opt }}
            </li>
          </ul>
        </transition>
      </div>

      <button class="btn-add" @click="onClickNewWorkshop">
        <i class="mdi mdi-plus"></i>
        Nuevo Taller
      </button>
    </div>

    <div class="hr-line"></div>

    <!-- Grid de cards -->
    <transition-group name="cards" tag="section" class="cards-grid" appear>
      <article
        v-for="w in filteredWorkshops"
        :key="w.id"
        class="workshop-card"
      >
        <div class="wk-head">
          <div class="wk-left">
            <div class="wk-icon">
              <i :class="['mdi', w.icon || 'mdi-briefcase-outline']"></i>
            </div>
            <div class="wk-titlebox">
              <h3 class="wk-title">{{ w.title }}</h3>
              <p v-if="w.category" class="wk-subtitle">{{ w.category }}</p>
            </div>
          </div>
          <span class="wk-badge" :class="badgeClass(w.level)">{{ w.level }}</span>
        </div>

        <p class="wk-desc">
          {{ w.description || 'Sin descripción proporcionada.' }}
        </p>

        <div v-if="w.tools?.length" class="wk-tools">
          <span v-for="(t, i) in w.tools" :key="i" class="wk-chip">{{ t }}</span>
        </div>

        <ul class="wk-meta">
          <li><i class="mdi mdi-account-tie-outline"></i> {{ w.speaker }}</li>
          <li><i class="mdi mdi-office-building-marker-outline"></i> {{ w.room }}</li>
          <li><i class="mdi mdi-clock-outline"></i> {{ w.time }}</li>
          <li><i class="mdi mdi-account-group-outline"></i> {{ w.enrolled }} / {{ w.capacity }} participantes</li>
        </ul>

        <div class="wk-progress">
          <div class="wk-progress__bar">
            <span class="wk-progress__fill" :style="{ width: occupancy(w) + '%' }"></span>
          </div>
          <div class="wk-progress__row">
            <span class="wk-progress__caption">{{ occupancy(w) }}% ocupado</span>
            <span v-if="isClosed(w)" class="wk-status wk-status--full">Cerrado</span>
          </div>
        </div>

        <div class="wk-divider"></div>
        <div class="wk-actions">
          <button type="button" class="btn-edit" @click="onClickEdit(w)">
            <i class="mdi mdi-pencil"></i> Editar
          </button>
        </div>
      </article>
    </transition-group>

    <!-- Modal nuevo taller -->
    <NewWorkshop
      v-if="newOpen"
      :levels="levels"
      :rooms="rooms"
      :speakers="speakers"
      @close="newOpen = false"
      @save="onCreateWorkshop"
    />

    <!-- Modal editar taller -->
    <EditWorkshop
      v-if="editOpen"
      :workshop="editData"
      :levels="levels"
      :rooms="rooms"
      :speakers="speakers"
      @close="editOpen = false"
      @save="onUpdateWorkshop"
      @delete="onDeleteWorkshop"
    />
  </div>
</template>

<script setup>
import '@mdi/font/css/materialdesignicons.min.css'
import '@/assets/css/styles/admin/workshops.css'
import NewWorkshop from '@/components/admin/new-workshop.vue'
import EditWorkshop from '@/components/admin/edit-workshop.vue'
import { useWorkshopsStatic } from '@/composables/admin/use-workshops-static'

definePageMeta({
  name: 'admin-workshop',
  path: '/admin-workshop',
  alias: ['/admin-workshop'],
  requiresAuth: true
})

// Toda la lógica (estado, filtros, helpers y CRUD local) vive en el composable
const {
  // filtro / mini select
  searchQuery, filterOptions, selectedFilter,
  msRef, msOpen, msActive, msToggle, pickMs,

  // data derivada
  filteredWorkshops,

  // helpers de UI
  occupancy, isClosed, badgeClass,

  // modales + catálogos
  newOpen, levels, rooms, speakers, onClickNewWorkshop,
  editOpen, editData, onClickEdit, onCreateWorkshop, onUpdateWorkshop, onDeleteWorkshop
} = useWorkshopsStatic()
</script>
