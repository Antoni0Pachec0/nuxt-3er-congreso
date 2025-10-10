<template>
  <div class="table-container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Usuarios</h1>
      <p class="subtitle">Administra los usuarios registrados en el congreso</p>
    </div>

    <div class="hr-line"></div>

    <!-- Filtros -->
    <div class="filters">
      <!-- Buscador -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre, correo o matrícula/ID..."
        class="search-input"
        aria-label="Buscar"
      />

      <!-- Dropdown -->
      <div class="mini-select" ref="msRef">
        <button
          class="mini-trigger"
          type="button"
          :aria-expanded="msOpen ? 'true' : 'false'"
          aria-haspopup="listbox"
          @click="msToggle()"
        >
          <span>{{ selectedFilter }}</span>
          <svg class="chev" viewBox="0 0 24 24" width="18" height="18">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        <transition name="ms">
          <ul
            v-if="msOpen"
            class="mini-options"
            role="listbox"
            :aria-activedescendant="`ms-${msActive}`"
            @keydown.stop.prevent="onMsListKeydown"
            @mousedown.stop
          >
            <li
              v-for="(opt, i) in options"
              :key="opt"
              :id="`ms-${i}`"
              class="mini-option"
              :class="{ active: i === msActive, selected: opt === selectedFilter }"
              role="option"
              @mousemove="msActive = i"
              @mousedown.prevent.stop="pickMs(opt)"
            >
              {{ opt }}
            </li>
          </ul>
        </transition>
      </div>

      <!-- Botón exportar -->
      <button class="btn-export" @click="exportData">
        <SvgIcon type="mdi" :path="mdiDownload" class="icon-left" />
        Exportar
      </button>
    </div>

    <div class="hr-line hr-line--flush"></div>

    <!-- Tabla desktop -->
    <table class="user-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Estatus de pago</th>
        </tr>
      </thead>
      <transition-group name="rows" tag="tbody" appear>
        <tr v-for="user in filteredUsers" :key="user.code">
          <td>
            <div class="name">{{ user.name }}</div>
            <div class="email">{{ user.email }}</div>
            <div class="code">
              <span class="code-label">{{ getIdLabel(user.type) }}:</span>
              {{ user.code }}
            </div>
          </td>
          <td><span class="badge" :class="user.typeColor">{{ user.type }}</span></td>
          <td><span class="badge" :class="user.stateColor">{{ user.state }}</span></td>
          <td>
            <span v-if="user.type === 'Ponente/Tallerista'" class="badge payment-noaplica">
              No aplica
            </span>
            <div v-else class="payment-status">
              <label class="switch">
                <input
                  type="checkbox"
                  :checked="user.payment === 'Pagado'"
                  @change="confirmToggle(user.code, $event)"
                />
                <span class="slider"></span>
              </label>
              <span class="badge" :class="user.paymentColor">
                {{ user.payment }}
              </span>
            </div>
          </td>
        </tr>
      </transition-group>
    </table>

    <!-- Cards mobile -->
    <div class="user-cards">
      <transition-group name="rows" tag="div" appear>
        <div v-for="user in filteredUsers" :key="user.code" class="user-card">
          <div class="uc-header">
            <div class="name">{{ user.name }}</div>
            <div class="email">{{ user.email }}</div>
          </div>
          <div class="uc-body">
            <p><span class="code-label">{{ getIdLabel(user.type) }}:</span> {{ user.code }}</p>
            <p><span class="badge" :class="user.typeColor">{{ user.type }}</span></p>
            <p><span class="badge" :class="user.stateColor">{{ user.state }}</span></p>
            <div class="payment-status" v-if="user.type !== 'Ponente/Tallerista'">
              <label class="switch">
                <input
                  type="checkbox"
                  :checked="user.payment === 'Pagado'"
                  @change="confirmToggle(user.code, $event)"
                />
                <span class="slider"></span>
              </label>
              <span class="badge" :class="user.paymentColor">{{ user.payment }}</span>
            </div>
            <p v-else><span class="badge payment-noaplica">No aplica</span></p>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Modal confirmación -->
    <transition name="overlay-fade">
      <div v-if="showModal" class="modal-overlay">
        <transition name="modal-pop">
          <div class="modal" role="dialog" aria-modal="true">
            <p>
              ¿Seguro que deseas cambiar el estatus de pago de
              <strong>{{ currentUser?.name }}</strong> a
              <strong>{{ pendingChange }}</strong>?
            </p>
            <div class="modal-actions">
              <button class="btn confirm" ref="confirmBtn" @click="applyToggle">Aceptar</button>
              <button class="btn cancel" @click="cancelToggle">Cancelar</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import '@/assets/css/styles/admin/users.css'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDownload } from '@mdi/js'
import { useUsersStatic } from '@/composables/admin/use-users-static'

definePageMeta({
  name: 'admin-users',
  path: '/admin/users',
  alias: ['/admin-users'],
  requiresAuth: true
})

// Toda la lógica se maneja en el composable
const {
  searchQuery, options, selectedFilter,
  msRef, msOpen, msActive, msToggle, pickMs, onMsListKeydown,

  users, filteredUsers, getIdLabel,

  confirmToggle, applyToggle, cancelToggle,
  currentUser, showModal, pendingChange, confirmBtn,

  exportData
} = useUsersStatic()
</script>
