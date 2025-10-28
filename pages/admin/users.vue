<template>
  <div class="table-container">
    <div class="header">
      <h1 class="title">Gestión de Usuarios</h1>
      <p class="subtitle">Administra los usuarios registrados en el congreso</p>
    </div>

    <div class="hr-line"></div>

    <div class="filters">
      <input
        :value="searchInput"
        @input="onSearchInput($event.target.value)"
        type="text"
        placeholder="Buscar por nombre, correo o matrícula/ID..."
        class="search-input"
        aria-label="Buscar"
      />

      <div class="mini-select" ref="msRef">
        <button
          class="mini-trigger"
          type="button"
          :aria-expanded="msOpen ? 'true' : 'false'"
          aria-haspopup="listbox"
          @click="msToggle()"
        >
          <span>{{ selectedFilter }}</span>
          <svg class="chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
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
              :aria-selected="opt === selectedFilter ? 'true' : 'false'"
              tabindex="-1"
              @mousemove="() => (msActive = i)"
              @mousedown.prevent.stop="() => pickMs(opt)"
            >
              {{ opt }}
            </li>
          </ul>
        </transition>
      </div>

      <button class="btn-export" @click="exportData" aria-label="Exportar CSV">
        <SvgIcon type="mdi" :path="mdiDownload" class="icon-left" />
        Exportar
      </button>
    </div>

    <div class="hr-line hr-line--flush"></div>

    <table class="user-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Pago</th>
          <th>Acceso al evento</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="busy">
          <td colspan="5" style="text-align:center; padding:16px;">Cargando...</td>
        </tr>
        <tr v-else-if="users.length === 0">
          <td colspan="5" style="text-align:center; padding:16px;">Sin resultados</td>
        </tr>
        <tr v-else v-for="user in users" :key="user.id">
          <td>
            <div class="name-user">{{ user.name }}</div>
            <div class="email">{{ user.email }}</div>
            <div class="code">
              <span class="code-label">{{ getIdLabel(user.type) }}:</span>
              {{ user.code }}
            </div>
          </td>

          <td><span class="badge" :class="mapTypeColor(user.type)">{{ user.type }}</span></td>

          <td>
            <span class="badge" :class="user.isActive ? 'state-activo' : 'state-inactivo'">
              {{ user.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>

          <td>
            <span class="badge" :class="user.paymentStatus === 'Pagado' ? 'payment-pagado' : 'payment-no'">
              {{ user.paymentStatus }}
            </span>
          </td>

          <td>
            <div class="payment-status">
              <label class="switch">
                <input
                  type="checkbox"
                  :checked="user.eventEnabled"
                  @change="(e) => onToggleActivation(user, e)"
                  :aria-label="`Cambiar acceso del evento para ${user.name}`"
                />
                <span class="slider"></span>
              </label>
              <span class="badge" :class="user.eventEnabled ? 'state-activo' : 'state-inactivo'">
                {{ user.eventEnabled ? 'Habilitado' : 'Deshabilitado' }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="page <= 1 || busy" @click="goPage(page - 1)">Anterior</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button :disabled="page >= totalPages || busy" @click="goPage(page + 1)">Siguiente</button>
    </div>
  </div>

  <!-- Modal confirmación -->
  <transition name="overlay-fade">
    <div v-if="showModal" class="modal-overlay">
      <transition name="modal-pop">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Confirmación de activación">
          <p>
            ¿Seguro que deseas
            <strong>{{ pendingActivate ? 'HABILITAR' : 'DESHABILITAR' }}</strong>
            el acceso al evento para <strong>{{ currentUser?.name }}</strong>?
          </p>
          <p v-if="!pendingActivate && currentUser?.eventEnabled" class="hint">
            El usuario perderá acceso a las funciones del evento.
          </p>
          <p v-if="pendingActivate && currentUser?.paymentStatus !== 'Pagado'" class="warn">
            No tiene pago válido. Puedes forzar si lo verificaste manualmente.
          </p>

          <div class="modal-actions">
            <button class="btn confirm" ref="confirmBtn" @click="applyToggle(false)">Aceptar</button>
            <button
              v-if="pendingActivate && currentUser?.paymentStatus !== 'Pagado'"
              class="btn force"
              @click="applyToggle(true)"
              title="Forzar activación sin pago"
            >
              Forzar
            </button>
            <button class="btn cancel" @click="cancelToggle">Cancelar</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDownload } from '@mdi/js'
import { useAdminUsers } from '@/composables/admin/use-users'
import '@/assets/css/styles/admin/users.css'

const adminOnly = defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return
  try {
    const raw = localStorage.getItem('auth_store') || '{}'
    const auth = JSON.parse(raw)
    const roleId = Number(auth?.user?.roleId || auth?.user?.type_user_id || 0)
    if (roleId !== 5) return navigateTo('/user-home')
  } catch {
    return navigateTo('/user-home')
  }
})

definePageMeta({
  name: 'admin-users',
  middleware: [adminOnly],   // 👈 sin archivos ni carpetas nuevas
  path: '/admin/users',
  alias: ['/admin-users'],
  requiresAuth: true
})

const {
  // estado principal
  users, total, page, pageSize, busy,
  // filtros
  searchInput, onSearchInput,
  options, selectedFilter, msOpen, msActive, msRef, msToggle, pickMs, onMsListKeydown,
  // helpers
  mapTypeColor, getIdLabel,
  // paginación
  totalPages, goPage,
  // modal
  showModal, pendingActivate, currentUser, confirmBtn,
  onToggleActivation, applyToggle, cancelToggle,
  // export
  exportData,
} = useAdminUsers()
</script>
