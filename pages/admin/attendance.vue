<template>
  <div class="admin-attendance-page">
    <div class="page-header">
      <h1 class="page-title">Lector de gafetes</h1>
      <p class="page-subtitle">
        Escanea el código QR de los gafetes para registrar la asistencia.
      </p>
    </div>

    <div class="att-layout">
      <!-- Columna izquierda: cámara -->
      <section class="att-panel att-panel-left">

        <div class="scanner-box" :class="{ 'scanner-box--active': cameraOn }">
          <!-- Video SIEMPRE está en el DOM -->
          <video
            ref="videoRef"
            class="scanner-video"
            autoplay
            playsinline
            muted
          ></video>

          <canvas ref="canvasRef" class="scanner-canvas"></canvas>

          <!-- Overlay cuando la cámara está apagada -->
          <div v-if="!cameraOn" class="scanner-overlay">
            <p class="scanner-placeholder-title">Cámara apagada.</p>
            <p class="scanner-placeholder-text">
              Haz clic en <strong>Encender cámara</strong> para comenzar.
            </p>
          </div>
        </div>

        <div class="scanner-actions">
          <button class="btn-primary" @click="toggleCamera">
            {{ cameraOn ? 'Apagar cámara' : 'Encender cámara' }}
          </button>
        </div>
      </section>

      <!-- Columna central: barra muy delgada con dos botones de icono -->
      <div class="att-middle-bar">
        <button
          class="middle-btn middle-btn-primary"
          @click="openEventModal"
          title="Seleccionar evento / sesión"
        >
          <span class="middle-btn-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" fill="none" />
              <circle cx="12" cy="12" r="1.8" fill="currentColor" />
            </svg>
          </span>
          <span class="sr-only">Seleccionar evento / sesión</span>
        </button>

        <button
          class="middle-btn middle-btn-secondary"
          :disabled="!currentWorkshop"
          @click="openListsModal"
          title="Ver listas de asistencia"
        >
          <span class="middle-btn-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="6" width="14" height="2" rx="1" />
              <rect x="5" y="11" width="14" height="2" rx="1" />
              <rect x="5" y="16" width="14" height="2" rx="1" />
            </svg>
          </span>
          <span class="sr-only">Ver listas de asistencia</span>
        </button>
      </div>

      <!-- Columna derecha: información del último registro -->
      <section class="att-panel att-panel-right">
        <h2 class="panel-title">Información</h2>

        <div v-if="lastScan" class="info-card">
          <p class="info-label">Evento</p>
          <p class="info-value">
            {{ currentWorkshop?.name || lastScan.workshop?.name || '—' }}
          </p>

          <p class="info-label">Sesión</p>
          <p class="info-value">
            {{ currentSession?.label || 'Todas las sesiones' }}
          </p>

          <p class="info-label">Participante</p>
          <p class="info-value">
            {{ lastScan.user?.name || '—' }}
          </p>

          <p class="info-label">Tipo de usuario</p>
          <p class="info-value">
            {{ lastScan.user?.type || '—' }}
          </p>

          <p class="info-label">Hora de lectura</p>
          <p class="info-value">
            {{ new Date(lastScan.at || lastScan.time).toLocaleTimeString('es-MX') }}
          </p>

          <p
            class="info-message"
            :class="{ ok: lastScan.status === 'ok', error: lastScan.status !== 'ok' }"
          >
            {{ lastScan.message }}
          </p>
        </div>

        <div v-else class="info-empty">
          Aún no hay asistencias registradas en esta sesión.
        </div>
      </section>
    </div>

    <!-- Modal seleccionar evento / sesión -->
    <div v-if="showEventModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Seleccionar evento / sesión</h3>
        </div>

        <div class="modal-body">
          <label class="modal-label">Taller / Workshop</label>
          <select v-model.number="selectedWorkshopId" class="modal-select">
            <option disabled value="0">Selecciona un taller…</option>
            <option v-for="w in workshops" :key="w.id" :value="w.id">
              {{ w.name }}
            </option>
          </select>

          <label class="modal-label">Sesión / Horario</label>
          <select v-model.number="selectedScheduleId" class="modal-select">
            <option :value="0">Todas las sesiones</option>
            <option v-for="s in currentSessions" :key="s.id" :value="s.id">
              {{ s.label }}
            </option>
          </select>
        </div>

        <div class="modal-footer">
          <button class="btn-ghost" @click="closeEventModal">Cancelar</button>
          <button class="btn-primary" @click="confirmEventSelection">
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal listas de asistencia -->
    <div v-if="showListsModal" class="modal-overlay">
      <div class="modal modal-wide">
        <div class="modal-header">
          <h3>Listas de asistencia</h3>
          <p class="modal-subtitle">
            {{ currentWorkshop?.name || 'Sin taller seleccionado' }}
          </p>
        </div>

        <div class="modal-body">
          <div class="lists-filters">
            <button
              v-for="t in filterTypes"
              :key="t.value"
              class="chip"
              :class="{ active: listsFilterType === t.value }"
              @click="setFilterType(t.value)"
            >
              {{ t.label }}
            </button>

            <input
              v-model="searchTerm"
              class="lists-search"
              type="text"
              placeholder="Buscar por nombre, correo o matrícula…"
            />
          </div>

          <div class="lists-container">
            <p v-if="listsLoading" class="lists-empty">
              Cargando asistencias…
            </p>

            <p v-else-if="!visibleUsers.length" class="lists-empty">
              No hay registros para este filtro.
            </p>

            <table v-else class="lists-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Correo</th>
                  <th>Matrícula</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                    v-for="(u, idx) in visibleUsers"
                    :key="u.id || idx"
                    :class="[
                    u.attended ? 'row-attended' : 'row-not-attended',
                    lastScan && lastScan.user?.id === u.id ? 'row-last' : '',
                    ]"
                >
                    <td>{{ idx + 1 }}</td>
                    <td>{{ u.name }}</td>
                    <td>{{ u.type }}</td>
                    <td>{{ u.email }}</td>
                    <td>{{ u.matricula || '—' }}</td>

                    <td>
                    <span
                        class="badge"
                        :class="u.attended ? 'badge-ok' : 'badge-pending'"
                    >
                        {{ u.attended ? 'Asistió' : 'Pendiente' }}
                    </span>
                    <span v-if="u.attendance_time" class="badge-time">
                        {{ new Date(u.attendance_time).toLocaleTimeString('es-MX') }}
                    </span>
                    </td>
                </tr>
                </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-ghost" @click="closeListsModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAttendance } from '@/composables/admin/use-attendance'

definePageMeta({
  name: 'admin-attendance',
  path: '/admin/attendance',
  alias: ['/admin/lector-qr'],
  requiresAuth: true,
})

const {
  // cámara
  cameraOn,
  videoRef,
  canvasRef,
  toggleCamera,

  // eventos
  workshops,
  selectedWorkshopId,
  selectedScheduleId,
  currentWorkshop,
  currentSessions,
  currentSession,

  // modales evento
  showEventModal,
  openEventModal,
  closeEventModal,
  confirmEventSelection,

  // modales listas
  showListsModal,
  openListsModal,
  closeListsModal,
  listsUsers,
  listsFilterType,
  listsLoading,
  setFilterType,

  // filtros/búsqueda
  searchTerm,
  visibleUsers,

  // último escaneo
  lastScan,
} = useAttendance()

const filterTypes = computed(() => [
  { value: 'all', label: 'Todos' },
  { value: 'students', label: 'Estudiantes' },
  { value: 'teachers', label: 'Docentes' },
  { value: 'externals', label: 'Externos' },
  { value: 'others', label: 'Otros' },
])
</script>

<style scoped>
.admin-attendance-page {
  padding: 24px;
}

/* ---------- Encabezado ---------- */
.page-header {
  margin-bottom: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px;
}

.page-subtitle {
  margin: 0;
  color: #667085;
}

/* ---------- Layout principal ---------- */
.att-layout {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) 70px minmax(0, 2fr); /* barra central delgada */
  gap: 24px;
  margin-top: 24px;
  align-items: stretch;
}

.att-panel {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 22px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
}

.att-panel-left,
.att-panel-right {
  min-height: 420px;
}

/* ---------- Lector (cámara) ---------- */
.scanner-box {
  position: relative;
  flex: 1;
  border-radius: 16px;
  background: radial-gradient(circle at top, #020617, #020617);
  border: 2px dashed rgba(148, 163, 184, 0.4);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-box--active {
  border-style: solid;
  border-color: #2563eb;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-canvas {
  display: none;
}

/* Overlay cuando la cámara está apagada */
.scanner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.95));
  color: #e5e7eb;
  text-align: center;
  padding: 16px;
}

.scanner-placeholder-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.scanner-placeholder-text {
  font-size: 13px;
  color: #9ca3af;
}

.scanner-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

/* ---------- Barra central (botones redondos) ---------- */
.att-middle-bar {
  background: #020617;
  border-radius: 24px;
  padding: 14px 8px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.middle-btn {
  border: none;
  border-radius: 999px;
  padding: 10px;
  width: 46px;
  height: 46px;
  background: #1f2937;
  color: #e5e7eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease,
    opacity 0.12s ease;
}

.middle-btn-primary {
  background: #2563eb;
}

.middle-btn-secondary {
  background: #374151;
}

.middle-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.middle-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.5);
}

.middle-btn-icon svg {
  width: 22px;
  height: 22px;
}

/* accesibilidad */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* ---------- Panel de información ---------- */
.att-panel-right {
  background: #f9fafb;
}

.info-card {
  margin-top: 10px;
  background: radial-gradient(circle at top left, #0b1220, #020617);
  border-radius: 18px;
  padding: 18px 20px;
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 6px;
  column-gap: 12px;
  font-size: 14px;
  color: #e5e7eb;
}

.info-label {
  font-weight: 600;
  color: #cbd5f5;
}

.info-value {
  color: #f9fafb;
}

/* Mensaje de estado (éxito / error) */
.info-message {
  grid-column: 1 / -1;
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  text-align: center;
  background: #e5e7eb;
}

.info-message.ok {
  background: #bbf7d0;
  color: #166534;
}

.info-message.error {
  background: #fee2e2;
  color: #b91c1c;
}

.info-empty {
  margin-top: 16px;
  color: #94a3b8;
  font-size: 14px;
}

/* ---------- Botones generales ---------- */
.btn-primary {
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition:
    background 0.12s ease,
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);
}

.btn-ghost {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  cursor: pointer;
}

/* ---------- Modales ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.modal {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px 20px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.45);
}

.modal-wide {
  max-width: 820px;
}

.modal-header h3 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
}

.modal-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.modal-body {
  margin-top: 14px;
}

.modal-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #4b5563;
}

.modal-select {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 8px 14px;
  margin-bottom: 12px;
  font-size: 14px;
}

.modal-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* ---------- Listas de asistencia ---------- */
.lists-filters {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.chip {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  background: #f9fafb;
}

.chip.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.lists-search {
  flex: 1;
  min-width: 220px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 6px 12px;
  font-size: 13px;
}

.lists-container {
  max-height: 360px;
  overflow: auto;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.lists-empty {
  padding: 16px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.lists-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.lists-table th,
.lists-table td {
  padding: 6px 10px;
  border-bottom: 1px solid #e5e7eb;
}

.lists-table th {
  background: #f9fafb;
  text-align: left;
  font-weight: 600;
}

/* ---------- Estados de fila ---------- */
.row-attended {
  background-color: #ecfdf3; /* verde suave */
}

.row-not-attended {
  background-color: #fef2f2; /* rojo suave */
}

/* último escaneado: resaltar sobre cualquier color */
.row-attended.row-last,
.row-not-attended.row-last {
  background-color: #1d4ed8 !important;
  color: #ffffff;
}

.row-last td {
  color: inherit;
}

.row-last .badge {
  background-color: rgba(15, 23, 42, 0.25);
  color: #f9fafb;
}

/* ---------- Badges ---------- */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.badge-ok {
  background: #22c55e33;
  color: #15803d;
}

.badge-pending {
  background: #f9737333;
  color: #b91c1c;
}

.badge-time {
  margin-left: 6px;
  font-size: 11px;
  color: #4b5563;
}

/* ---------- Responsive ---------- */
@media (max-width: 1024px) {
  .att-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .att-middle-bar {
    flex-direction: row;
    height: auto;
    padding: 10px;
  }
}
</style>
