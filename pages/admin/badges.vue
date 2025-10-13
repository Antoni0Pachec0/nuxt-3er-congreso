<!-- pages/admin/badges.vue -->
<template>
  <div class="table-container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gafetes</h1>
      <p class="subtitle">Previsualiza e imprime gafetes para los usuarios seleccionados</p>
    </div>

    <div class="hr-line"></div>

    <!-- Acciones -->
    <div class="actions-row">
      <div class="paid-users">
        <span class="label">Usuarios con estatus de pagado</span>
        <span class="count">({{ paidCount }})</span>
      </div>

      <div class="actions-right">
        <button class="btn-outline" @click="onExportPdf" aria-label="Exportar PDF">
          <SvgIcon type="mdi" :path="mdiDownload" class="icon-left" />
          Exportar PDF
        </button>

        <button class="btn-solid" @click="onPrintBadges" aria-label="Imprimir gafetes">
          <SvgIcon type="mdi" :path="mdiPrinter" class="icon-left" />
          Imprimir Gafetes
        </button>
      </div>
    </div>

    <div class="hr-line"></div>

    <!-- Lista tipo chips (Activos y Pagados) -->
    <h2 class="section-title">Pendientes de imprimir</h2>
    <p class="section-subtitle">Usuarios activos y con pago confirmado.</p>

    <!-- ✅ Animación al quitar: transition-group -->
    <transition-group name="card" tag="div" class="badge-list">
      <article
        v-for="u in paidUsers"
        :key="u.code"
        class="badge-item"
        aria-label="Usuario pagado activo"
      >
        <!-- Avatar con iniciales -->
        <div class="avatar" aria-hidden="true">
          <span>{{ initials(u.name) }}</span>
        </div>

        <!-- Info -->
        <div class="info">
          <div class="name">{{ u.name }}</div>
          <div class="email">{{ u.email }}</div>
          <div class="meta">
            <span class="code">{{ u.code }}</span>
            <span class="chip" :class="u.typeColor">{{ u.type }}</span>
          </div>
        </div>

        <!-- Acciones por item (activos) -->
        <div class="actions">
          <button
            class="icon-btn"
            aria-label="Ver previsualización del gafete"
            @click="preview(u)"
            title="Previsualizar"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>

          <button
            class="icon-btn"
            aria-label="Quitar de la lista de gafetes"
            @click="remove(u.code)"
            title="Quitar"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </article>

      <p v-if="!paidUsers.length" key="empty-paid" class="empty">No hay usuarios pagados activos.</p>
    </transition-group>

    <!-- Separador -->
    <div class="hr-line hr-spaced"></div>

    <!-- Lista de inactivos con badge "Gafete impreso" -->
    <h2 class="section-title">Gafetes ya impresos (inactivos)</h2>
    <p class="section-subtitle">Usuarios cuyo gafete ya fue impreso. Puedes reimprimir si es necesario.</p>

    <!-- ✅ También con transition-group por si en el futuro mueves ítems -->
    <transition-group name="card" tag="div" class="badge-list printed-list">
      <article
        v-for="u in printedUsers"
        :key="u.code"
        class="badge-item printed"
        aria-label="Usuario inactivo con gafete impreso"
      >
        <!-- Avatar -->
        <div class="avatar" aria-hidden="true">
          <span>{{ initials(u.name) }}</span>
        </div>

        <!-- Info -->
        <div class="info">
          <div class="name">
            {{ u.name }}
            <span class="badge-printed" aria-label="Gafete impreso">Gafete impreso</span>
          </div>
          <div class="email">{{ u.email }}</div>
          <div class="meta">
            <span class="code">{{ u.code }}</span>
            <span class="chip" :class="u.typeColor">{{ u.type }}</span>
          </div>
        </div>

        <!-- Acciones por item (inactivos: solo reimprimir) -->
        <div class="actions">
          <button
            class="icon-btn reprint"
            aria-label="Reimprimir gafete"
            @click="reprint(u)"
            title="Reimprimir"
          >
            <SvgIcon type="mdi" :path="mdiPrinter" class="icon-left" />
          </button>
        </div>
      </article>

      <p v-if="!printedUsers.length" key="empty-printed" class="empty">No hay gafetes impresos aún.</p>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue"
// @ts-expect-error
import SvgIcon from "@jamescoyle/vue-icon"
import { mdiDownload, mdiPrinter } from "@mdi/js"

definePageMeta({
  name: 'admin-badges',
  path: '/admin/badges',
  alias: ['/admin-badges'],
  requiresAuth: true
})

type User = {
  name: string
  email: string
  code: string
  type: "Estudiante" | "Docente" | "Ponente/Tallerista" | "Externo"
  typeColor: string
  state: "Activo" | "Inactivo"
  stateColor: string
  payment: "Pagado" | "No pagado" | "No aplica"
  paymentColor: string
}

/* === Datos demo === */
const users = reactive<User[]>([
  // Activos + Pagados (pendientes de imprimir)
  { name: "Laura Hernández Torres", email: "laura.hernandez@universidad.edu.mx", code: "EST2024002", type: "Estudiante", typeColor: "type-estudiante", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Fernando López", email: "fernando.lopez@yahoo.com", code: "EXT2024002", type: "Externo", typeColor: "type-externo", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Sofía Martínez", email: "sofia.martinez@universidad.edu.mx", code: "EST2024003", type: "Estudiante", typeColor: "type-estudiante", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Lic. Andrés Ramírez", email: "andres.ramirez@universidad.edu.mx", code: "DOC2024003", type: "Docente", typeColor: "type-docente", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Ing. Daniela Pineda", email: "daniela.pineda@empresa.com", code: "EMP2024003", type: "Ponente/Tallerista", typeColor: "type-ponente", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Alejandro Cruz", email: "alejandro.cruz@gmail.com", code: "EXT2024003", type: "Externo", typeColor: "type-externo", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Mtra. Karla Villaseñor", email: "karla.villasenor@universidad.edu.mx", code: "DOC2024004", type: "Docente", typeColor: "type-docente", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Juan Pablo Estrada", email: "juanpablo.estrada@universidad.edu.mx", code: "EST2024004", type: "Estudiante", typeColor: "type-estudiante", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  // Inactivos (ya impresos, listados abajo)
  { name: "Arq. Beatriz Salas", email: "beatriz.salas@estudio.com", code: "EMP2024004", type: "Ponente/Tallerista", typeColor: "type-ponente", state: "Inactivo", stateColor: "state-inactivo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Verónica Chávez", email: "veronica.chavez@gmail.com", code: "EXT2024004", type: "Externo", typeColor: "type-externo", state: "Inactivo", stateColor: "state-inactivo", payment: "Pagado", paymentColor: "payment-pagado" },
])

/** Listas computadas */
const paidUsers = computed(() =>
  users.filter((u: { payment: string; state: string }) => u.payment === "Pagado" && u.state === "Activo")
)

const printedUsers = computed(() =>
  users.filter((u: { state: string }) => u.state === "Inactivo")
)

/** Iniciales para el avatar (máx. 2 letras) */
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0]!.toUpperCase())
    .join("")

/** Contador visible en el header de acciones (solo activos pagados) */
const paidCount = computed(() => paidUsers.value.length)

/** Placeholder: exportar PDF (demo visual) */
function onExportPdf() {
  window.print()
}

/** Imprimir gafetes (vista actual) */
function onPrintBadges() {
  window.print()
}

/** Reimprimir gafete individual (inactivos) */
function reprint(user: User) {
  console.log("Reimprimiendo gafete ->", user)
  window.print()
}

/** Abrir un preview de un gafete (implementa tu modal si quieres) */
function preview(user: User) {
  console.log("Preview gafete ->", user)
}

/** Quitar de la lista: cambia a "No pagado" para que desaparezca del computed (solo demo) */
function togglePaidByCode(code: string) {
  const u = users.find((u: { code: string }) => u.code === code)
  if (!u) return
  if (u.payment === "Pagado") {
    u.payment = "No pagado"
    u.paymentColor = "payment-no"
  } else {
    u.payment = "Pagado"
    u.paymentColor = "payment-pagado"
  }
}

function remove(code: string) {
  togglePaidByCode(code)
}
</script>

<style scoped>
.hr-line { height: 1px; background: #E5E7EB; width: 100%; margin: 16px 0 16px; }
.hr-spaced { margin-top: 28px; }

.section-title { font-size: clamp(1.1rem, 1.8vw, 1.2rem); font-weight: 800; color: #0f172a; }
.section-subtitle { font-size: .95rem; color:#64748b; margin-top: 4px; }

.badge-list { display:flex; flex-direction:column; gap:14px; margin-top:14px; }
.badge-item {
  display:flex; align-items:center; gap:16px;
  background:#fff; border:1px solid #e5e7eb; border-radius:14px;
  padding:16px 18px;
}
.badge-item.printed {
  background: #fcfdfd;
  border-color: #e5efe9;
}

.avatar {
  width:48px; height:48px; border-radius:50%;
  background:#eef2ff; color:#374151; display:grid; place-items:center;
  font-weight:800;
}
.info { flex:1; min-width:0; }
.name { font-weight:800; color:#0f172a; line-height:1.2; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.email { color:#475569; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.meta { display:flex; align-items:center; gap:10px; margin-top:6px; }
.code { color:#6b7280; font-size:0.85rem; }
.chip {
  font-size:0.8rem; font-weight:700; padding:4px 10px; border-radius:999px;
  color:#2563eb; background:#f5faff;
}

/* Badge "Gafete impreso" */
.badge-printed {
  font-size: .75rem;
  font-weight: 800;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 3px 8px;
  border-radius: 999px;
}

/* Colores ya usados */
.type-estudiante { color: #1e40af; background: #dbeafe; }
.type-docente    { color: #9d174d; background: #fce7f3; }
.type-ponente    { color: #6b21a8; background: #f3e8ff; }
.type-externo    { color: #dd6c15; background: #ffedd5; }

.actions { display:flex; gap:10px; }
.icon-btn {
  width:40px; height:40px; border-radius:10px; background:#fff; color:#2563eb;
  border:1.5px solid #2563eb; display:grid; place-items:center; cursor:pointer;
  transition:transform .15s ease, background .2s ease;
}
.icon-btn:hover { transform: translateY(-1px); background:#f5faff; }

/* Variación para reimprimir */
.icon-btn.reprint {
  color:#0f766e;
  border-color:#0f766e;
}
.icon-btn.reprint:hover { background:#ecfdf5; }

.actions-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-top:6px; }
.paid-users { display:flex; align-items:baseline; gap:6px; font-size:clamp(0.95rem,2vw,1rem); }
.paid-users .label { color:#0f172a; font-weight:600; }
.paid-users .count { color:#1f2937; font-weight:700; }

.actions-right { margin-left:auto; display:flex; gap:10px; }
.btn-outline { display:inline-flex; align-items:center; gap:8px; padding:8px 14px; background:#fff; color:#2563eb; border:2px solid #2563eb; border-radius:6px; cursor:pointer; font-weight:700; transition:background .3s ease, transform .2s ease; }
.btn-outline:hover { transform: translateY(-1px); }
.btn-solid { display:inline-flex; align-items:center; gap:8px; padding:8px 14px; background:#2563eb; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:700; transition:background .3s ease, transform .2s ease; }
.btn-solid:hover { background:#1d4ed8; transform: translateY(-1px); }
.icon-left { width:18px; height:18px; fill:currentColor; }

/* === Animaciones de removal con <transition-group name="card"> === */
.card-enter-active,
.card-leave-active {
  transition: 220ms ease;
}
.card-move {
  transition: transform 220ms ease; /* reacomodo suave del resto */
}
.card-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
.card-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.card-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.card-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  height: 0 !important; /* colapso visual */
  overflow: hidden;
}

@media (max-width:640px){
  .actions-right{ width:100%; justify-content:flex-end; }
}
</style>