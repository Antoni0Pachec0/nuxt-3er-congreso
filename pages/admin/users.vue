<template>
  <div class="table-container">
    <!-- Header con botón de cerrar sesión -->
    <div class="header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="title">Gestión de Usuarios</h1>
          <p class="subtitle">Administra los usuarios registrados en el congreso</p>
        </div>
        <button class="btn-logout" @click="logout" aria-label="Cerrar sesión">
          <SvgIcon type="mdi" :path="mdiLogout" class="icon-left" />
          Cerrar Sesión
        </button>
      </div>
    </div>

    <div class="hr-line"></div>

    <!-- Filtros mejorados -->
    <div class="filters">
      <!-- Buscador principal -->
      <div class="search-container">
        <input
          :value="searchInput"
          @input="onSearchInput($event.target.value)"
          type="text"
          placeholder="Buscar por nombre, correo o matrícula/ID..."
          class="search-input"
          aria-label="Buscar"
        />
      </div>

      <!-- Filtros en fila -->
      <div class="filter-row">
        <!-- Filtro tipo/estado -->
        <div class="filter-group">
          <label class="filter-label">Tipo/Estado</label>
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
        </div>

        <!-- Filtro grado -->
        <div class="filter-group">
          <label class="filter-label">Grado</label>
          <div class="mini-select" ref="gradeRef">
            <button
              class="mini-trigger"
              type="button"
              :aria-expanded="gradeOpen ? 'true' : 'false'"
              aria-haspopup="listbox"
              @click="gradeToggle()"
            >
              <span>{{ selectedGrade || 'Todos' }}</span>
              <svg class="chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>

            <transition name="ms">
              <ul
                v-if="gradeOpen"
                class="mini-options"
                role="listbox"
                :aria-activedescendant="`grade-${gradeActive}`"
                @keydown.stop.prevent="onGradeListKeydown"
                @mousedown.stop
              >
                <li
                  class="mini-option"
                  :class="{ selected: !selectedGrade }"
                  role="option"
                  aria-selected="true"
                  tabindex="-1"
                  @mousedown.prevent.stop="() => pickGrade(null)"
                >
                  Todos
                </li>
                <li
                  v-for="(grade, i) in gradeOptions"
                  :key="grade"
                  :id="`grade-${i}`"
                  class="mini-option"
                  :class="{ active: i === gradeActive, selected: grade === selectedGrade }"
                  role="option"
                  :aria-selected="grade === selectedGrade ? 'true' : 'false'"
                  tabindex="-1"
                  @mousemove="() => (gradeActive = i)"
                  @mousedown.prevent.stop="() => pickGrade(grade)"
                >
                  {{ grade }}
                </li>
              </ul>
            </transition>
          </div>
        </div>

        <!-- Filtro grupo -->
        <div class="filter-group">
          <label class="filter-label">Grupo</label>
          <div class="mini-select" ref="groupRef">
            <button
              class="mini-trigger"
              type="button"
              :aria-expanded="groupOpen ? 'true' : 'false'"
              aria-haspopup="listbox"
              @click="groupToggle()"
            >
              <span>{{ selectedGroup || 'Todos' }}</span>
              <svg class="chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>

            <transition name="ms">
              <ul
                v-if="groupOpen"
                class="mini-options"
                role="listbox"
                :aria-activedescendant="`group-${groupActive}`"
                @keydown.stop.prevent="onGroupListKeydown"
                @mousedown.stop
              >
                <li
                  class="mini-option"
                  :class="{ selected: !selectedGroup }"
                  role="option"
                  aria-selected="true"
                  tabindex="-1"
                  @mousedown.prevent.stop="() => pickGroup(null)"
                >
                  Todos
                </li>
                <li
                  v-for="(group, i) in groupOptions"
                  :key="group"
                  :id="`group-${i}`"
                  class="mini-option"
                  :class="{ active: i === groupActive, selected: group === selectedGroup }"
                  role="option"
                  :aria-selected="group === selectedGroup ? 'true' : 'false'"
                  tabindex="-1"
                  @mousemove="() => (groupActive = i)"
                  @mousedown.prevent.stop="() => pickGroup(group)"
                >
                  {{ group }}
                </li>
              </ul>
            </transition>
          </div>
        </div>

        <!-- Botón exportar -->
        <div class="filter-group">
          <label class="filter-label">&nbsp;</label>
          <button class="btn-export" @click="exportData" aria-label="Exportar CSV">
            <SvgIcon type="mdi" :path="mdiDownload" class="icon-left" />
            Exportar
          </button>
        </div>
      </div>
    </div>

    <div class="hr-line hr-line--flush"></div>

    <!-- Tabla -->
    <table class="user-table">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Tipo</th>
          <th>Grado/Grupo</th>
          <th>Estado</th>
          <th>Pago</th>
          <th>Acceso al evento</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="busy">
          <td colspan="6" style="text-align:center; padding:16px;">Cargando...</td>
        </tr>
        <tr v-else-if="users.length === 0">
          <td colspan="6" style="text-align:center; padding:16px;">Sin resultados</td>
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
            <div class="grade-group">
              <span v-if="user.grade" class="grade">{{ user.grade }}</span>
              <span v-if="user.group" class="group">{{ user.group }}</span>
              <span v-if="!user.grade && !user.group" class="no-data">-</span>
            </div>
          </td>

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

    <!-- Paginación -->
    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="page <= 1 || busy" @click="goPage(page - 1)">Anterior</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button :disabled="page >= totalPages || busy" @click="goPage(page + 1)">Siguiente</button>
    </div>
  </div>

  <!-- Modal confirmación mejor posicionado -->
  <transition name="overlay-fade">
    <div v-if="showModal" class="modal-overlay">
      <transition name="modal-pop">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Confirmación de activación">
          <div class="modal-header">
            <h3>Confirmar Acción</h3>
          </div>
          
          <div class="modal-body">
            <p>
              ¿Seguro que deseas
              <strong>{{ pendingActivate ? 'HABILITAR' : 'DESHABILITAR' }}</strong>
              el acceso al evento para <strong>{{ currentUser?.name }}</strong>?
            </p>
            
            <div v-if="!pendingActivate && currentUser?.eventEnabled" class="alert alert-warning">
              ⚠️ El usuario perderá acceso a las funciones del evento.
            </div>
            
            <div v-if="pendingActivate && currentUser?.paymentStatus !== 'Pagado'" class="alert alert-info">
              ℹ️ No tiene pago válido. Puedes forzar si lo verificaste manualmente.
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn confirm" ref="confirmBtn" @click="applyToggle(false)">
              {{ pendingActivate ? 'Activar' : 'Desactivar' }}
            </button>
            
            <button
              v-if="pendingActivate && currentUser?.paymentStatus !== 'Pagado'"
              class="btn force"
              @click="applyToggle(true)"
              title="Forzar activación sin pago"
            >
              Forzar Activación
            </button>
            
            <button class="btn cancel" @click="cancelToggle">Cancelar</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

  <!-- Notificaciones toast mejor posicionadas -->
  <div class="toast-container">
    <!-- Las notificaciones de Notivue aparecerán aquí -->
  </div>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDownload, mdiLogout } from '@mdi/js'
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
  middleware: [adminOnly],
  path: '/admin/users',
  alias: ['/admin-users'],
  requiresAuth: true
})

const {
  // estado principal
  users, total, page, pageSize, busy,
  // filtros
  searchInput, onSearchInput,
  options, selectedFilter, 
  gradeOptions, selectedGrade, gradeOpen, gradeActive, gradeRef, gradeToggle, pickGrade, onGradeListKeydown,
  groupOptions, selectedGroup, groupOpen, groupActive, groupRef, groupToggle, pickGroup, onGroupListKeydown,
  msOpen, msActive, msRef, msToggle, pickMs, onMsListKeydown,
  // helpers
  mapTypeColor, getIdLabel,
  // paginación
  totalPages, goPage,
  // modal
  showModal, pendingActivate, currentUser, confirmBtn,
  onToggleActivation, applyToggle, cancelToggle,
  // export
  exportData,
  // logout
  logout
} = useAdminUsers()
</script>

