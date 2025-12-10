<template>
  <div class="admin-finance-view">
    <div class="table-container">
      <!-- HEADER -->
      <div class="header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="title">Panel financiero</h1>
            <p class="subtitle">
              Resume todos los ingresos y gastos del 3er Congreso.
            </p>
          </div>

          <div class="header-actions">
            <button class="btn-logout" @click="logout">
              <SvgIcon type="mdi" :path="mdiLogout" class="icon-left" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div class="hr-line"></div>

      <!-- KPI CARDS -->
      <div class="kpi-grid" :class="{ loading: busy }">
        <div class="kpi-card">
          <div class="kpi-icon kpi-purple">
            <SvgIcon type="mdi" :path="mdiAccountGroup" />
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Usuarios pagados</span>
            <span class="kpi-value">{{ summary.paidUsersCount }}</span>
            <span class="kpi-caption">Evento Pagado</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-blue">
            <SvgIcon type="mdi" :path="mdiCashMultiple" />
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Precio por boleto</span>
            <div class="price-input-row">
              <span class="currency">$</span>
              <input
                type="number"
                min="1"
                step="1"
                v-model.number="ticketPrice"
                @change="onChangePrice"
              />
            </div>
            <span class="kpi-caption">Se guarda solo en este navegador</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-green">
            <SvgIcon type="mdi" :path="mdiTrendingUp" />
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Ingresos por boletos</span>
            <span class="kpi-value money">
              {{ formatCurrency(summary.ticketsRevenue) }}
            </span>
            <span class="kpi-caption">
              {{ summary.paidUsersCount }} × {{ formatCurrency(ticketPrice) }}
            </span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-orange">
            <SvgIcon type="mdi" :path="mdiScaleBalance" />
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Balance total</span>
            <span
              class="kpi-value money"
              :class="{
                'money-positive': summary.balance > 0,
                'money-negative': summary.balance < 0
              }"
            >
              {{ formatCurrency(summary.balance) }}
            </span>
            <span class="kpi-caption">
              Ingresos extra:
              {{ formatCurrency(summary.totalIngresosDb) }} ·
              Gastos: {{ formatCurrency(summary.totalGastosDb) }}
            </span>
          </div>
        </div>
      </div>

      <!-- FILTROS TIPO (INGRESO/GASTO) -->
      <div class="filters-row">
        <div class="chips-type">
          <button
            class="chip-type"
            :class="{ active: selectedTipo === 'ALL' }"
            @click="selectedTipo = 'ALL'"
          >
            Todos
          </button>
          <button
            class="chip-type income"
            :class="{ active: selectedTipo === 'INGRESO' }"
            @click="selectedTipo = 'INGRESO'"
          >
            Ingresos
          </button>
          <button
            class="chip-type expense"
            :class="{ active: selectedTipo === 'GASTO' }"
            @click="selectedTipo = 'GASTO'"
          >
            Gastos
          </button>
        </div>

        <div class="right-actions">
          <span class="muted small">
            Movimientos visibles: {{ visibleMovements.length }}
          </span>
        </div>
      </div>

      <!-- CATEGORÍAS -->
      <div class="categories-row">
        <span class="categories-label">Categorías:</span>

        <button
          class="chip-cat"
          :class="{ active: selectedCategoryId === 0 }"
          @click="selectedCategoryId = 0"
        >
          Todas
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          class="chip-cat"
          :class="{ active: selectedCategoryId === cat.id }"
          @click="selectedCategoryId = cat.id"
        >
          <span class="chip-cat-name">{{ cat.nombre }}</span>

          <!-- Editar categoría -->
          <span
            class="chip-cat-edit"
            @click.stop="onEditCategory(cat)"
            title="Editar categoría"
          >
            ✎
          </span>

          <!-- Eliminar categoría -->
          <span
            class="chip-cat-delete"
            @click.stop="onDeleteCategory(cat)"
            title="Eliminar categoría"
          >
            ×
          </span>
        </button>

        <button class="chip-cat add" @click="onAddCategory">
          <SvgIcon type="mdi" :path="mdiPlus" class="icon-inline" />
          Nueva categoría
        </button>
      </div>

      <!-- CONTENIDO PRINCIPAL (LISTA + FORM) -->
      <div class="content-grid">
        <!-- LISTA DE MOVIMIENTOS -->
        <div class="movements-panel">
          <div class="panel-header">
           <h3 class="panel-title">Movimientos registrados</h3>

            <div class="panel-actions">
              <button class="btn-secondary" @click="onDownloadGeneralPdf">
                Descargar análisis general
              </button>

              <button class="btn-secondary" @click="onDownloadPdf">
                Descargar categoría
              </button>
            </div>
          </div>

          <div v-if="busyMovements" class="state-text">
            Cargando movimientos…
          </div>

          <div v-else-if="visibleMovements.length === 0" class="state-text">
            No hay movimientos para los filtros actuales.
          </div>

          <div
            v-else
            v-for="m in visibleMovements"
            :key="m.id"
            :class="[
              'movement-item',
              m.tipo === 'INGRESO' ? 'income' : 'expense',
              { 'menu-open': activeMenuId === m.id }
            ]"
          >
            <div class="bar"></div>

            <div class="movement-main">
              <div class="movement-top">
                <span class="movement-type-pill">
                  {{ m.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto' }}
                </span>
                <span class="movement-date">
                  {{ formatDate(m.fecha) }}
                </span>
              </div>

              <div class="movement-desc">
                {{ m.descripcion || '(Sin descripción)' }}
              </div>

              <div class="movement-meta">
                <span v-if="m.categoria" class="pill pill-cat">
                  {{ m.categoria.nombre }}
                </span>
                <span v-if="m.usuario" class="pill pill-user">
                  {{ m.usuario.nombre }}
                </span>
                <span class="pill">
                  {{ m.medio_pago }}
                </span>
              </div>
            </div>

            <div class="movement-side">
              <div
                class="amount"
                :class="m.tipo === 'INGRESO' ? 'positive' : 'negative'"
              >
                {{ formatCurrency(m.monto) }}
              </div>

              <!-- Menú de 3 puntos estilo To Do -->
              <div class="todo-menu-wrapper" @click.stop>
                <button
                  class="todo-menu-btn"
                  @click="toggleMenu(m.id)"
                  aria-label="Acciones del movimiento"
                >
                  <SvgIcon type="mdi" :path="mdiDotsVertical" />
                </button>

                <div
                  v-if="activeMenuId === m.id"
                  class="todo-menu-dropdown"
                >
                  <button @click="onEditMovement(m)">Editar</button>
                  <button @click="onDeleteMovement(m)">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FORM NUEVO MOVIMIENTO -->
        <div class="form-panel">
          <h3 class="panel-title">
            {{ editingId ? 'Editar movimiento' : 'Registrar movimiento' }}
          </h3>
          <p class="panel-subtitle">
            Usa este formulario para registrar ingresos adicionales (patrocinios,
            venta de productos, etc.) o gastos del evento.
          </p>

          <form @submit.prevent="onSubmitMovement">
            <div class="form-grid">
              <div class="form-row">
                <label>Tipo</label>
                <select v-model="form.tipo">
                  <option value="INGRESO">Ingreso</option>
                  <option value="GASTO">Gasto</option>
                </select>
              </div>

              <div class="form-row">
                <label>Monto</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  v-model.number="form.monto"
                  required
                />
              </div>

              <div class="form-row">
                <label>Medio de pago</label>
                <select v-model="form.medio_pago">
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TARJETA">Tarjeta</option>
                </select>
              </div>

              <div class="form-row">
                <label>Categoría</label>
                <select v-model.number="form.id_categoria" required>
                  <option disabled value="0">Selecciona una categoría</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-row full">
                <label>Descripción</label>
                <input
                  type="text"
                  v-model="form.descripcion"
                  placeholder="Ej. Coffee break día 1, patrocinio empresa X…"
                />
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                v-if="editingId"
                class="btn-secondary"
                @click="resetForm"
              >
                Cancelar edición
              </button>

              <button
                type="submit"
                class="btn-primary"
                :disabled="busyCreate"
              >
                {{ editingId ? 'Guardar cambios' : 'Guardar movimiento' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toasts globales -->
    <div class="toast-container"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiLogout,
  mdiPlus,
  mdiCashMultiple,
  mdiTrendingUp,
  mdiScaleBalance,
  mdiAccountGroup,
  mdiDotsVertical
} from '@mdi/js'

import api from '@/backend/http/api'
import { ROUTES } from '@/backend/http/routes'
import { createNotifyAdapter } from '@/utils/notify/adapter'
import { useFinance } from '@/composables/admin/use-finance'
import '@/assets/css/styles/admin/users.css'

// -------------------------
// Toasts personalizados
// -------------------------
const notify =
  typeof createNotifyAdapter === 'function' ? createNotifyAdapter() : null

const toast = {
  ok: (t, m) => notify?.('success', t, m),
  err: (t, m) => notify?.('error', t, m),
  warn: (t, m) => notify?.('warning', t, m)
}

// Middleware admin
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
  name: 'admin-finance',
  middleware: [adminOnly],
  path: '/admin/finance',
  alias: ['/admin-finance'],
  requiresAuth: true
})

const router = useRouter()

function logout() {
  try {
    localStorage.removeItem('auth_store')
  } catch {}
  router.push('/login')
}

// composable de finanzas
const {
  ticketPrice,
  summary,
  categories,
  visibleMovements,
  selectedTipo,
  selectedCategoryId,
  busy,
  busyMovements,
  busyCreate,
  setTicketPrice,
  addCategory,
  editCategory,
  addMovement,
  updateMovement,
  deleteMovement,
  deleteCategory
} = useFinance()

// menú de 3 puntos
const activeMenuId = ref(null)

// formulario nuevo/editar movimiento
const editingId = ref(null)

const form = ref({
  tipo: 'GASTO',
  monto: null,
  descripcion: '',
  medio_pago: 'EFECTIVO',
  id_categoria: 0
})

function resetForm() {
  editingId.value = null
  form.value = {
    tipo: 'GASTO',
    monto: null,
    descripcion: '',
    medio_pago: 'EFECTIVO',
    id_categoria: 0
  }
}

async function onChangePrice() {
  await setTicketPrice(ticketPrice.value)
}

async function onAddCategory() {
  const nombre = window.prompt('Nombre de la nueva categoría:')
  if (!nombre || !nombre.trim()) return
  await addCategory(nombre.trim())
}

// Editar nombre de categoría
async function onEditCategory(cat) {
  if (!cat?.id) return
  const nuevoNombre = window.prompt(
    'Nuevo nombre para la categoría:',
    cat.nombre || ''
  )
  if (!nuevoNombre || !nuevoNombre.trim() || nuevoNombre === cat.nombre) {
    return
  }

  await editCategory(cat.id, nuevoNombre.trim())
}

// Eliminar categoría (solo si el backend lo permite)
async function onDeleteCategory(cat) {
  if (!cat?.id) return

  const ok = window.confirm(
    `¿Eliminar la categoría "${cat.nombre}"?\n\nSolo se eliminará si no tiene movimientos asociados.`
  )
  if (!ok) return

  await deleteCategory(cat.id)

  // Si la categoría eliminada era la seleccionada, regresamos a "Todas"
  if (selectedCategoryId.value === cat.id) {
    selectedCategoryId.value = 0
  }
}

function toggleMenu(id) {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

function onEditMovement(m) {
  editingId.value = m.id
  activeMenuId.value = null
  form.value = {
    tipo: m.tipo,
    monto: Number(m.monto),
    descripcion: m.descripcion || '',
    medio_pago: m.medio_pago,
    id_categoria: m.id_categoria
  }
}

async function onDeleteMovement(m) {
  activeMenuId.value = null
  const ok = window.confirm('¿Eliminar este movimiento?')
  if (!ok) return
  await deleteMovement(m.id)
}

async function onDownloadGeneralPdf() {
  try {
    // Usamos el precio actual del boleto para que el análisis incluya
    // correctamente los ingresos por boletos.
    const response = await api.get(ROUTES.ADMIN.FINANCE.ANALYSIS_PDF, {
      params: {
        price: ticketPrice.value || 380, // fallback por si va vacío
      },
      responseType: 'blob',
      withCredentials: true,
      timeout: 300000,
    })

    const blob = response.data
    if (!blob) {
      toast.err('Análisis general', 'No se pudo generar el PDF.')
      return
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'analisis-general-finanzas.pdf'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    toast.ok('Análisis general', 'PDF descargado correctamente.')
  } catch (err) {
    console.error(err)

    let msg =
      'Ocurrió un error al descargar el análisis general. Revisa el servidor.'

    const res = err?.response
    const data = res?.data

    if (data instanceof Blob) {
      try {
        const text = await data.text()
        const json = JSON.parse(text)
        if (json?.message) {
          msg = Array.isArray(json.message) ? json.message.join(', ') : json.message
        }
      } catch {
        // no era JSON, dejamos el mensaje por defecto
      }
    }

    toast.err('Análisis general', msg)
  }
}

// Descargar PDF usando axios + manejo de error (mensaje del backend)
async function onDownloadPdf() {
  const tipo = selectedTipo.value || 'ALL'
  const categoriaId = selectedCategoryId.value || 0

  try {
    const pdfRoute = `${ROUTES.ADMIN.FINANCE.MOVEMENTS}/pdf`

    const response = await api.get(pdfRoute, {
      params: { tipo, categoriaId },
      responseType: 'blob',
      withCredentials: true,
      timeout: 300000
    })

    // Si todo bien, debe ser un PDF
    const blob = response.data
    if (!blob) {
      toast.err('PDF de movimientos', 'No se pudo generar el PDF.')
      return
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'reporte-financiero.pdf'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    toast.ok('PDF de movimientos', 'Reporte descargado correctamente.')
  } catch (err) {
    console.error(err)

    // Intentar leer el mensaje real que viene del backend
    let msg =
      'Ocurrió un error al descargar el PDF. Revisa el servidor o los parámetros.'
    const res = err?.response
    const data = res?.data

    if (data instanceof Blob) {
      try {
        const text = await data.text()
        // Puede ser JSON de Nest con { message, error, statusCode }
        const json = JSON.parse(text)
        if (json?.message) {
          msg = Array.isArray(json.message) ? json.message.join(', ') : json.message
        }
      } catch {
        // si no es JSON, lo dejamos con el mensaje por defecto
      }
    }

    toast.err('PDF de movimientos', msg)
  }
}

async function onSubmitMovement() {
  if (!form.value.id_categoria || !form.value.monto || form.value.monto <= 0) {
    toast.warn(
      'Movimiento',
      'Completa el monto y selecciona una categoría válida.'
    )
    return
  }

  const payload = {
    tipo: form.value.tipo,
    monto: form.value.monto,
    descripcion: form.value.descripcion,
    medio_pago: form.value.medio_pago,
    id_categoria: form.value.id_categoria
  }

  if (editingId.value) {
    await updateMovement(editingId.value, payload)
  } else {
    await addMovement(payload)
  }

  resetForm()
}

// helpers de formato
function formatCurrency(value) {
  const n = Number(value) || 0
  return n.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2
  })
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.admin-finance-view {
  padding: 20px;
  background: #f3f5fb;
}

.table-container {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 22px 24px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

/* ====================== HEADER ====================== */

.admin-finance-view .title {
  font-size: 2.2rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.admin-finance-view .subtitle {
  font-size: 0.95rem;
  color: #64748b;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

/* Botón cerrar sesión */
.header-actions .btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid #fca5a5;
  background: linear-gradient(135deg, #fff1f2, #ffffff);
  color: #b91c1c;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(248, 113, 113, 0.25);
  transition: all 0.18s ease;
}

.header-actions .btn-logout:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 6px 16px rgba(248, 113, 113, 0.45);
  transform: translateY(-1px);
}

.header-actions .btn-logout:active {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(239, 68, 68, 0.45);
}

.icon-left {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Separador */
.hr-line {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 16px 0 18px;
}

/* ====================== KPI CARDS ====================== */

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.kpi-grid.loading {
  opacity: 0.6;
  filter: grayscale(0.2);
}

.kpi-card {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: radial-gradient(circle at top left, #f8fafc, #ffffff);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
}

.kpi-icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon svg {
  width: 22px;
  height: 22px;
  color: #ffffff;
}

.kpi-purple { background: linear-gradient(135deg, #7c3aed, #a855f7); }
.kpi-blue   { background: linear-gradient(135deg, #2563eb, #38bdf8); }
.kpi-green  { background: linear-gradient(135deg, #16a34a, #4ade80); }
.kpi-orange { background: linear-gradient(135deg, #f97316, #facc15); }

.kpi-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kpi-label {
  font-size: 12px;
  color: #6b7280;
}

.kpi-value {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.kpi-value.money {
  font-feature-settings: "tnum" on, "lnum" on;
}

.money-positive { color: #16a34a; }
.money-negative { color: #dc2626; }

.kpi-caption {
  margin-top: 2px;
  font-size: 11px;
  color: #9ca3af;
}

/* Input precio */
.price-input-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.price-input-row .currency {
  font-size: 16px;
  color: #475569;
}

.price-input-row input {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 4px 7px;
  font-size: 13px;
  outline: none;
  transition: all 0.15s ease;
}

.price-input-row input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
}

/* ====================== FILTROS TIPO ====================== */

.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.chips-type {
  display: inline-flex;
  gap: 8px;
  padding: 4px;
  border-radius: 999px;
  background: #edf2ff;
}

.chip-type {
  padding: 4px 12px;
  border-radius: 999px;
  border: none;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
  transition: all 0.15s ease;
}

.chip-type:hover {
  background: rgba(255, 255, 255, 0.9);
}

.chip-type.active {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
}

.chip-type.income.active {
  background: #16a34a;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.4);
}

.chip-type.expense.active {
  background: #dc2626;
  box-shadow: 0 2px 6px rgba(248, 113, 113, 0.5);
}

.right-actions .small {
  font-size: 12px;
}

.muted {
  color: #6b7280;
}

/* ====================== CATEGORÍAS ====================== */

.categories-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 18px;
  padding: 8px 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #eef2ff, #fdf2ff);
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 10px rgba(129, 140, 248, 0.18);
}

.categories-label {
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
  margin-right: 4px;
}

.chip-cat {
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  cursor: pointer;
  color: #4338ca;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.chip-cat::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #a855f7;
}

.chip-cat:hover {
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(129, 140, 248, 0.35);
}

.chip-cat.active {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #ffffff;
  border-color: transparent;
}

.chip-cat.active::before {
  background: #fbbf24;
}

.chip-cat.add {
  border-style: dashed;
  border-color: rgba(129, 140, 248, 0.6);
  color: #1d4ed8;
  background: rgba(255, 255, 255, 0.85);
}

.chip-cat.add::before {
  background: transparent;
}

.icon-inline {
  width: 16px;
  height: 16px;
}

/* ====================== GRID PRINCIPAL ====================== */

.content-grid {
  display: grid;
  grid-template-columns: 2.1fr 1.1fr;
  gap: 18px;
}

/* Panels */
.movements-panel,
.form-panel {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 14px 16px 16px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

.panel-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

.panel-subtitle {
  margin: 0 0 10px;
  font-size: 12px;
  color: #6b7280;
}

.state-text {
  text-align: center;
  padding: 16px;
  font-size: 13px;
  color: #6b7280;
}

/* ====================== MOVIMIENTOS ====================== */

.movement-item {
  position: relative;
  display: flex;
  align-items: stretch;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  margin-top: 8px;
  overflow: visible;               /* importante para el menú */
  background: #f9fafb;
  transition: box-shadow 0.15s ease, background 0.15s ease, transform 0.08s ease;
  z-index: 1;
}

.movement-item.income {
  background: #f0fdf4;
}

.movement-item.expense {
  background: #fef2f2;
}

.movement-item:hover {
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

/* cuando el menú está abierto, elevar la card */
.movement-item.menu-open {
  z-index: 200;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.22);
  border-color: #cbd5e1;
}

/* Barra lateral */
.movement-item .bar {
  width: 4px;
  background: #2563eb;
}

.movement-item.income .bar {
  background: #22c55e;
}

.movement-item.expense .bar {
  background: #ef4444;
}

/* Contenido principal */
.movement-main {
  flex: 1;
  padding: 8px 10px;
}

.movement-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  align-items: center;
}

.movement-type-pill {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 500;
}

.movement-item.income .movement-type-pill {
  background: #dcfce7;
  color: #15803d;
}

.movement-item.expense .movement-type-pill {
  background: #fee2e2;
  color: #b91c1c;
}

/* FECHA: estilo chip, similar a info secundaria de usuarios */
.movement-date {
  font-size: 11px;
  color: #6b7280;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.movement-desc {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #111827;
}

.movement-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.pill {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
}

.pill-cat {
  border-color: #4ade80;
  background: rgba(22, 163, 74, 0.06);
}

.movement-item.expense .pill-cat {
  border-color: #fb7185;
  background: rgba(248, 113, 113, 0.06);
}

.pill-user {
  border-color: #60a5fa;
  background: rgba(59, 130, 246, 0.06);
}

/* Lado derecho: monto + menú */
.movement-side {
  padding: 8px 8px 8px 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 130px;
  justify-content: flex-end;
}

.amount {
  font-size: 15px;
  font-weight: 700;
  font-feature-settings: "tnum" on, "lnum" on;
}

.amount.positive { color: #15803d; }
.amount.negative { color: #b91c1c; }

/* ====================== MENÚ 3 PUNTOS ====================== */

.todo-menu-wrapper {
  position: relative;
}

.todo-menu-btn {
  border: none;
  background: transparent;
  border-radius: 999px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.12s ease, transform 0.08s ease;
}

.todo-menu-btn:hover {
  background: rgba(148, 163, 184, 0.15);
  transform: translateY(-1px);
}

.todo-menu-btn svg {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.todo-menu-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  min-width: 140px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.22);
  padding: 4px 0;
  z-index: 5000; /* por encima de cualquier card */
}

.todo-menu-dropdown button {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 7px 12px;
  font-size: 13px;
  cursor: pointer;
  color: #111827;
}

.todo-menu-dropdown button:hover {
  background: #f1f5f9;
}

/* ====================== FORMULARIO ====================== */

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
  margin-top: 8px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 12px;
}

.form-row.full {
  grid-column: 1 / -1;
}

.form-row label {
  color: #6b7280;
}

.form-row input,
.form-row select {
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 5px 7px;
  font-size: 13px;
  outline: none;
  transition: all 0.15s ease;
  background: #f9fafb;
}

.form-row input:focus,
.form-row select:focus {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18);
}

.form-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Botones formulario */
.btn-primary {
  padding: 7px 16px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);
  transition: all 0.18s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 7px 18px rgba(37, 99, 235, 0.6);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 13px;
  cursor: pointer;
  color: #475569;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

/* Toasts */
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  pointer-events: none;
}

/* ====================== RESPONSIVE ====================== */

@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .admin-finance-view {
    padding: 12px;
  }

  .table-container {
    padding: 16px 14px 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .movement-item {
    flex-direction: column;
  }

  .movement-side {
    justify-content: space-between;
    padding-top: 4px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
