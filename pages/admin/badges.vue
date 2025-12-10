<template>
  <div class="admin-users-view">
    <div class="table-container">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="title">Generación de Gafetes</h1>
            <p class="subtitle">Filtra, selecciona y genera gafetes en una sola vista.</p>
          </div>

          <!-- Acciones -->
          <div class="header-actions">
            <button class="btn-logout" @click="logout">
              <SvgIcon type="mdi" :path="mdiLogout" class="icon-left" />
              Cerrar sesión
            </button>

            <button class="btn-outline" @click="clearSelection">
              <SvgIcon type="mdi" :path="mdiClose" class="icon-left" />
              Limpiar selección
            </button>
          </div>
        </div>
      </div>

      <div class="hr-line"></div>

      <!-- Filtros -->
      <div class="filters">
        <div class="search-container">
          <input
            :value="searchInput"
            @input="onSearchInput($event.target.value)"
            type="text"
            placeholder="Buscar por nombre, correo o matrícula/ID…"
            class="search-input"
            aria-label="Buscar"
          />
        </div>

        <div class="filter-row">
          <FilterMini
            label="Tipo"
            :options="typeOptions"
            :model-value="selectedType"
            @update:model-value="pickType"
          />

          <FilterMini
            label="Estado"
            :options="stateOptions"
            :model-value="selectedState"
            @update:model-value="pickState"
          />

          <FilterMini
            label="Pago"
            :options="payOptions"
            :model-value="selectedPay"
            @update:model-value="pickPay"
          />

          <FilterMini
            label="Grado"
            :options="gradeOptions"
            :model-value="selectedGrade"
            @update:model-value="pickGrade"
          />

          <FilterMini
            label="Grupo"
            :options="groupOptions"
            :model-value="selectedGroup"
            @update:model-value="pickGroup"
          />

          <div class="filter-group grow-right">
            <label class="filter-label">&nbsp;</label>
            <div class="actions-row">
              <button class="btn-secondary" @click="clearFilters" :disabled="busyCombined">
                Limpiar
              </button>

              <div class="page-size">
                <label for="psel" class="psel-label">Mostrar</label>
                <select
                  id="psel"
                  class="psel"
                  :value="pageSize"
                  @change="onChangePageSize($event.target.value)"
                  :disabled="busyCombined"
                >
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>

              <label class="checkbox-inline">
                <input type="checkbox" v-model="showOnlyPendingBadges" />
                Solo pendientes de imprimir
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="top-info">
        <span class="muted">Total: {{ total }}</span>
        <span class="muted">|</span>
        <span class="muted">Página {{ page }} de {{ totalPages }}</span>
        <span class="muted">|</span>
        <span class="muted">Seleccionados: {{ selectedCount }}</span>
      </div>

      <!-- Tabla -->
      <table class="user-table">
        <thead>
          <tr>
            <th class="col-min">
              <button
                class="chip-select"
                :class="{ active: isPageFullySelected }"
                @click="toggleSelectPage"
                title="Seleccionar página actual"
              >
                ✓
              </button>
            </th>
            <th>Usuario</th>
            <th>Tipo</th>
            <th>Grado/Grupo</th>
            <th>Matrícula/ID</th>
            <th>Impresión</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="busyCombined">
            <td colspan="6" style="text-align:center; padding:16px;">Cargando…</td>
          </tr>
          <tr v-else-if="visibleUsers.length === 0">
            <td colspan="6" style="text-align:center; padding:16px;">
              No hay usuarios para los filtros actuales.
            </td>
          </tr>
          <tr
            v-else
            v-for="u in visibleUsers"
            :key="u.id"
            :class="{ 'row-selected': isSelected(u.id) }"
            @click="toggleSelect(u.id)"
            style="cursor: pointer;"
          >
            <td class="col-min">
              <button
                class="chip-select"
                :class="{ active: isSelected(u.id) }"
                @click.stop="toggleSelect(u.id)"
              >
                ✓
              </button>
            </td>

            <td>
              <div class="name-user">{{ u.name }}</div>
              <div class="email">{{ u.email }}</div>
            </td>

            <td>
              <span class="badge" :class="mapTypeColor(u.type)">{{ u.type }}</span>
            </td>

            <td>
              <div class="grade-group">
                <span v-if="u.grade" class="grade">{{ u.grade }}</span>
                <span v-if="u.group" class="group">{{ u.group }}</span>
                <span v-if="!u.grade && !u.group" class="no-data">-</span>
              </div>
            </td>

            <td class="code">{{ u.code }}</td>

            <td>
              <span v-if="u.isBadgePrinted" class="badge badge-printed">Impreso</span>
              <span v-else class="badge badge-pending">Pendiente</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="page <= 1 || busyCombined" @click="goPage(page - 1)">Anterior</button>
        <span>Página {{ page }} de {{ totalPages }}</span>
        <button :disabled="page >= totalPages || busyCombined" @click="goPage(page + 1)">
          Siguiente
        </button>
      </div>

      <!-- Barra de acción masiva SIEMPRE visible -->
      <div class="bulk-bar-sticky">
        <div class="bulk-left">
          <span class="muted">
            Listos para generar:
            <strong>{{ selectedCount }}</strong>
          </span>
        </div>
        <div class="bulk-right">
          <button
            class="btn success lg"
            :disabled="busyCombined || selectedCount === 0"
            @click="generateBadges"
          >
            Generar PDF de Gafetes
          </button>

          <button
            class="btn outline lg"
            :disabled="busyCombined || selectedCount === 0"
            @click="sendSelectedCertificates"
          >
            Certificados
          </button>
        </div>
      </div>
    </div>

    <div class="toast-container"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiLogout, mdiClose } from '@mdi/js'
import { useAdminUsers } from '@/composables/admin/use-users'
import { useBadges } from '@/composables/admin/use-badges'
import { useCertificates } from '@/composables/admin/use-certificates' // 👈 nuevo
import FilterMini from '@/components/admin/filter-mini.vue'
import '@/assets/css/styles/admin/users.css'

definePageMeta({
  name: 'admin-badges',
  path: '/admin/badges',
  alias: ['/admin-badges'],
  requiresAuth: true,
})

const {
  users,
  total,
  page,
  pageSize,
  busy: listBusy,
  searchInput,
  onSearchInput,
  typeOptions,
  selectedType,
  pickType,
  stateOptions,
  selectedState,
  pickState,
  payOptions,
  selectedPay,
  pickPay,
  gradeOptions,
  selectedGrade,
  pickGrade,
  groupOptions,
  selectedGroup,
  pickGroup,
  clearFilters,
  totalPages,
  goPage,
  onChangePageSize,
  selectedIds,
  isSelected,
  toggleSelect,
  toggleSelectPage,
  isPageFullySelected,
  clearSelection,
  selectedCount,
  mapTypeColor,
  logout,
  fetchUsers,
} = useAdminUsers()

const showOnlyPendingBadges = ref(true)

const visibleUsers = computed(() =>
  users.value.filter((u) => (showOnlyPendingBadges.value ? !u.isBadgePrinted : true)),
)

// 👉 aquí ya usas dos composables: gafetes y certificados
const { busy: badgesBusy, downloadBadges } = useBadges(selectedIds)
const { busy: certsBusy, sendCertificates } = useCertificates(selectedIds)

// 👉 busyCombined ahora también considera el envío de certificados
const busyCombined = computed(() => listBusy.value || badgesBusy.value || certsBusy.value)

async function generateBadges() {
  await downloadBadges(true)
  await fetchUsers()
  clearSelection()
}

// 👉 esta función la llama el botón "Certificados"
async function sendSelectedCertificates() {
  await sendCertificates()
}

</script>

<style scoped>
.row-selected {
  background-color: rgba(25, 118, 210, 0.08);
}

.badge-printed {
  background-color: #4caf50;
  color: #fff;
}

.badge-pending {
  background-color: #f57c00;
  color: #fff;
}

.checkbox-inline {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-left {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* 👉 Barra fija corregida - con estilos completos */
.admin-users-view .bulk-bar-sticky {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 1000 !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 16px 24px !important;
  background: #ffffff !important;
  border-top: 1px solid #e0e0e0 !important;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1) !important;
  margin: 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

/* Ajuste del contenedor principal */
.admin-users-view .table-container {
  padding-bottom: 100px !important;
}

/* Estructura de la barra */
.admin-users-view .bulk-bar-sticky .bulk-left,
.admin-users-view .bulk-bar-sticky .bulk-right {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}

/* Botones específicos para esta vista */
.admin-users-view .bulk-bar-sticky .btn.success.lg {
  background-color: #00B394 !important;
  color: #fff !important;
  border: none !important;
  padding: 12px 24px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  min-height: 44px !important;
  white-space: nowrap !important;
}

.admin-users-view .bulk-bar-sticky .btn.outline.lg {
  background-color: transparent !important;
  color: #1976d2 !important;
  border: 2px solid #1976d2 !important;
  padding: 12px 24px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  min-height: 44px !important;
  white-space: nowrap !important;
}

/* Hover states */
.admin-users-view .bulk-bar-sticky .btn.success.lg:hover:not(:disabled) {
  background-color: #009580 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0, 179, 148, 0.3) !important;
}

.admin-users-view .bulk-bar-sticky .btn.outline.lg:hover:not(:disabled) {
  background-color: rgba(25, 118, 210, 0.08) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2) !important;
}

/* Estados deshabilitados */
.admin-users-view .bulk-bar-sticky .btn.success.lg:disabled,
.admin-users-view .bulk-bar-sticky .btn.outline.lg:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-users-view .bulk-bar-sticky {
    flex-direction: column !important;
    gap: 16px !important;
    padding: 16px !important;
  }
  
  .admin-users-view .bulk-bar-sticky .bulk-left,
  .admin-users-view .bulk-bar-sticky .bulk-right {
    width: 100% !important;
    justify-content: center !important;
  }
  
  .admin-users-view .bulk-bar-sticky .bulk-right {
    flex-wrap: wrap !important;
  }
  
  .admin-users-view .bulk-bar-sticky .btn.success.lg,
  .admin-users-view .bulk-bar-sticky .btn.outline.lg {
    width: 100% !important;
    max-width: 300px !important;
  }
  
  .admin-users-view .table-container {
    padding-bottom: 160px !important;
  }
}

@media (max-width: 480px) {
  .admin-users-view .bulk-bar-sticky {
    padding: 12px 16px !important;
  }
  
  .admin-users-view .bulk-bar-sticky .btn.success.lg,
  .admin-users-view .bulk-bar-sticky .btn.outline.lg {
    padding: 10px 16px !important;
    font-size: 0.9rem !important;
  }
}
</style>