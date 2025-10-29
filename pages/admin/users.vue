<template>
  <div class="table-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="title">Gestión de Usuarios</h1>
          <p class="subtitle">Activa/desactiva usuarios manualmente</p>
        </div>

        <!-- Acciones: cerrar sesión + seleccionar (juntos) -->
        <div class="header-actions">
          <button class="btn-logout" @click="logout">
            <SvgIcon type="mdi" :path="mdiLogout" class="icon-left" />
            Cerrar sesión
          </button>

          <button class="btn-outline" @click="toggleSelectModeAndClear">
            <SvgIcon type="mdi" :path="selectionMode ? mdiClose : mdiSelect" class="icon-left" />
            {{ selectionMode ? 'Cancelar selección' : 'Seleccionar' }}
          </button>
        </div>
      </div>
    </div>

    <div class="hr-line"></div>

    <!-- Buscador -->
    <div class="filters">
      <div class="search-container">
        <input
          :value="searchInput"
          @input="onSearchInput($event.target.value)"
          type="text"
          placeholder="Buscar por nombre, correo o matrícula/ID (varios términos separados por espacio)…"
          class="search-input"
          aria-label="Buscar"
        />
      </div>

      <div class="filter-row">
        <!-- Tipo -->
        <FilterMini
          label="Tipo"
          :options="typeOptions"
          :model-value="selectedType"
          @update:model-value="pickType"
        />

        <!-- Estado -->
        <FilterMini
          label="Estado"
          :options="stateOptions"
          :model-value="selectedState"
          @update:model-value="pickState"
        />

        <!-- Pago -->
        <FilterMini
          label="Pago"
          :options="payOptions"
          :model-value="selectedPay"
          @update:model-value="pickPay"
        />

        <!-- Grado -->
        <FilterMini
          label="Grado"
          :options="gradeOptions"
          :model-value="selectedGrade"
          @update:model-value="pickGrade"
        />

        <!-- Grupo -->
        <FilterMini
          label="Grupo"
          :options="groupOptions"
          :model-value="selectedGroup"
          @update:model-value="pickGroup"
        />

        <div class="filter-group grow-right">
          <label class="filter-label">&nbsp;</label>
          <div class="actions-row">
            <button class="btn-secondary" @click="clearFilters" :disabled="busy">Limpiar</button>

            <div class="page-size">
              <label for="psel" class="psel-label">Mostrar</label>
              <select id="psel" class="psel" :value="pageSize" @change="onChangePageSize($event.target.value)">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>

            <button class="btn-export" @click="exportData" :disabled="busy || users.length===0">
              <SvgIcon type="mdi" :path="mdiDownload" class="icon-left" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="top-info">
      <span class="muted">Total: {{ total }}</span>
      <span class="muted">|</span>
      <span class="muted">Página {{ page }} de {{ totalPages }}</span>
    </div>

    <!-- Tabla -->
    <table class="user-table">
      <thead>
        <tr>
          <th class="col-min"></th>
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
          <td colspan="7" style="text-align:center; padding:16px;">Cargando…</td>
        </tr>
        <tr v-else-if="users.length===0">
          <td colspan="7" style="text-align:center; padding:16px;">Sin resultados</td>
        </tr>

        <tr
          v-else
          v-for="u in users" :key="u.id"
          :class="[{ 'row-selectable': selectionMode, 'row-selected': isSelected(u.id) }]"
          @click="selectionMode ? toggleSelect(u.id) : null"
        >
          <td class="col-min">
            <button
              v-if="selectionMode"
              class="chip-select"
              :class="{ active: isSelected(u.id) }"
              @click.stop="toggleSelect(u.id)"
              :aria-label="isSelected(u.id) ? 'Deseleccionar' : 'Seleccionar'"
            >
              {{ isSelected(u.id) ? '✓' : '+' }}
            </button>
          </td>

          <td>
            <div class="name-user">{{ u.name }}</div>
            <div class="email">{{ u.email }}</div>
            <div class="code"><span class="code-label">{{ getIdLabel(u.type) }}:</span> {{ u.code }}</div>
          </td>

          <td><span class="badge" :class="mapTypeColor(u.type)">{{ u.type }}</span></td>

          <td>
            <div class="grade-group">
              <span v-if="u.grade" class="grade">{{ u.grade }}</span>
              <span v-if="u.group" class="group">{{ u.group }}</span>
              <span v-if="!u.grade && !u.group" class="no-data">-</span>
            </div>
          </td>

          <td>
            <span class="badge" :class="u.isActive ? 'state-activo' : 'state-inactivo'">
              {{ u.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>

          <!-- Pago desde status_event (boolean) -->
          <td>
            <span class="badge" :class="u.status_event ? 'payment-pagado' : 'payment-no'">
              {{ u.status_event ? 'Pagado' : 'No pagado' }}
            </span>
          </td>

          <td>
            <div class="payment-status">
              <label class="switch" :class="{ disabled: selectionMode }" @click.stop>
                <input
                  type="checkbox"
                  :checked="u.eventEnabled"
                  :disabled="selectionMode"
                  @change="(e)=> onToggleActivationUI(u, e)"
                  :aria-label="`Cambiar acceso al evento para ${u.name}`"
                />
                <span class="slider"></span>
              </label>
              <span class="badge" :class="u.eventEnabled ? 'state-activo' : 'state-inactivo'">
                {{ u.eventEnabled ? 'Habilitado' : 'Deshabilitado' }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="page<=1 || busy" @click="goPage(page-1)">Anterior</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button :disabled="page>=totalPages || busy" @click="goPage(page+1)">Siguiente</button>
    </div>
  </div>

  <!-- Barra de acciones masivas -->
  <transition name="slide-up">
    <div v-if="selectionMode" class="bulk-bar-sticky">
      <div class="bulk-left">
        <button class="btn-light" :disabled="busy || users.length===0" @click="toggleSelectPage">
          {{ isPageFullySelected ? 'Deseleccionar página' : 'Seleccionar página' }}
        </button>
        <button class="btn-light" :disabled="busy || total===0" @click="selectAllFiltered">
          Seleccionar todos (filtrados)
        </button>
        <span class="muted"><strong>Seleccionados: {{ selectedCount }}</strong></span>
      </div>
      <div class="bulk-right">
        <button class="btn success lg" :disabled="busy || selectedCount===0" @click="openBulkConfirm(true)">
          Activar seleccionados
        </button>
        <button class="btn danger lg"  :disabled="busy || selectedCount===0" @click="openBulkConfirm(false)">
          Desactivar seleccionados
        </button>
      </div>
    </div>
  </transition>

  <!-- Modal individual -->
  <transition name="overlay-fade">
    <div v-if="showModal" class="modal-overlay">
      <transition name="modal-pop">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-header"><h3>Confirmar acción</h3></div>
          <div class="modal-body">
            <p>¿Deseas <strong>{{ pendingActivate ? 'HABILITAR' : 'DESHABILITAR' }}</strong> el acceso al evento para <strong>{{ currentUser?.name }}</strong>?</p>
          </div>
          <div class="modal-actions">
            <button class="btn confirm" ref="confirmBtn" @click="applyToggle()">
              {{ pendingActivate ? 'Activar' : 'Desactivar' }}
            </button>
            <button class="btn cancel" @click="cancelToggle">Cancelar</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

  <!-- Modal masivo -->
  <transition name="overlay-fade">
    <div v-if="showBulk" class="modal-overlay">
      <transition name="modal-pop">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3>Confirmar acción masiva</h3>
          </div>
          <div class="modal-body">
            <p>Vas a <strong>{{ bulkActivateFlag ? 'HABILITAR' : 'DESHABILITAR' }}</strong> a <strong>{{ selectedCount }}</strong> usuarios.</p>
            <p class="muted">Esta operación puede tardar unos segundos. ¿Continuar?</p>
          </div>
          <div class="modal-actions">
            <button class="btn confirm" @click="bulkActivateUI(bulkActivateFlag)">Sí, continuar</button>
            <button class="btn cancel" @click="showBulk=false">Cancelar</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>

  <!-- Toasts -->
  <div class="toast-container"></div>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDownload, mdiLogout, mdiSelect, mdiClose } from '@mdi/js'
import { useAdminUsers } from '@/composables/admin/use-users'
import FilterMini from '@/components/admin/filter-mini.vue'
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
  // estado
  users, total, page, pageSize, busy,

  // búsqueda y filtros
  searchInput, onSearchInput,
  typeOptions, selectedType, pickType,
  stateOptions, selectedState, pickState,
  payOptions, selectedPay, pickPay,
  gradeOptions, selectedGrade, pickGrade,
  groupOptions, selectedGroup, pickGroup,
  clearFilters,

  // paginación
  totalPages, goPage, onChangePageSize,

  // helpers
  mapTypeColor, getIdLabel,

  // selección
  selectionMode, toggleSelectModeAndClear,
  isSelected, toggleSelect, toggleSelectPage, isPageFullySelected,
  selectedCount, selectAllFiltered,

  // masivo
  openBulkConfirm, showBulk, bulkActivateFlag, bulkActivateUI,

  // individual
  showModal, pendingActivate, currentUser, confirmBtn,
  onToggleActivationUI, applyToggle, cancelToggle,

  // otros
  exportData, logout
} = useAdminUsers()
</script>

<style scoped>
/* chips y selección */
.toast-container{position:fixed;top:16px;right:16px;z-index:9999;pointer-events:none}
.col-min{width:44px}
.row-selectable{cursor:pointer}
.row-selected{background:rgba(0, 179, 148, .08); box-shadow: inset 0 0 0 2px rgba(0,179,148,.35)}
.chip-select{min-width:28px;height:28px;border-radius:999px;border:1px solid var(--ink,#0b1534);background:#fff;font-weight:700}
.chip-select.active{background:#00B394;color:#fff;border-color:#00B394}

/* Barra masiva visible y sin encimar */
.bulk-bar-sticky{
  position:sticky; bottom:0; left:0; right:0;
  display:flex; flex-wrap:wrap;
  align-items:center; justify-content:space-between;
  gap:.9rem;
  padding:.9rem 1.25rem; background:#fff; border-top:2px solid #00B39420; z-index:50;
  box-shadow:0 -10px 35px rgba(2,20,56,.12);
}
.bulk-left, .bulk-right{ display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; }
.bulk-right .btn.lg{ padding:.7rem 1rem; font-weight:700 }
.bulk-right .btn.success{ background:#00B394; color:#fff }
.bulk-right .btn.danger{ background:#EF4444; color:#fff }
@media (min-width: 768px){ .bulk-left, .bulk-right { flex-wrap: nowrap; } }

/* switch desactivado durante selección */
.switch.disabled{opacity:.5; pointer-events:none}

/* animación */
.slide-up-enter-active,.slide-up-leave-active{transition:all .2s ease}
.slide-up-enter-from,.slide-up-leave-to{transform:translateY(12px);opacity:0}

/* Alineación de botones en header */
.header-actions{ display:flex; gap:.6rem; align-items:center; }
</style>
