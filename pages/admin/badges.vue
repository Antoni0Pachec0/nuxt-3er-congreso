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

/* 👉 Barra siempre visible, fija abajo de la pantalla solo en esta vista */
.bulk-bar-sticky {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.06);
}

/* opcional: que no quede pegado a los bordes en pantallas grandes */
.admin-users-view .bulk-bar-sticky {
  max-width: 1200px;
  margin: 0 auto;
}

/* botón de generar, consistente con el resto del admin */
.bulk-bar-sticky .btn.success.lg {
  background-color: #1976d2;
  color: #fff;
  border: none;
}

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

/* 👉 Barra siempre visible, fija abajo de la pantalla solo en esta vista */
.bulk-bar-sticky {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.06);
}

.admin-users-view .bulk-bar-sticky {
  max-width: 1200px;
  margin: 0 auto;
}

/* Botones de la barra */
.bulk-right {
  display: flex;
  gap: 8px;
}

.bulk-bar-sticky .btn.success.lg {
  background-color: #1976d2;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 500;
}

/* nuevo botón outline */
.bulk-bar-sticky .btn.outline.lg {
  background-color: transparent;
  color: #1976d2;
  border-radius: 999px;
  border: 1px solid #1976d2;
  padding: 8px 18px;
  font-weight: 500;
}

.bulk-bar-sticky .btn.outline.lg:disabled,
.bulk-bar-sticky .btn.success.lg:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>
