<template>
  <div class="table-container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Usuarios</h1>
      <p class="subtitle">Administra los usuarios registrados en el congreso</p>
    </div>

    <!-- Línea divisora -->
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

      <!-- Dropdown custom -->
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
              @mousemove="msActive = i"
              @mousedown.prevent.stop="pickMs(opt)"
            >
              {{ opt }}
            </li>
          </ul>
        </transition>
      </div>

      <!-- Botón exportar -->
      <button class="btn-export" @click="exportData" aria-label="Exportar CSV">
        <SvgIcon type="mdi" :path="mdiDownload" class="icon-left" />
        Exportar
      </button>
    </div>

    <!-- Línea divisora pegada a la tabla -->
    <div class="hr-line hr-line--flush"></div>

    <!-- Tabla en desktop -->
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
                  :aria-label="`Cambiar pago de ${user.name}`"
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

    <!-- Cards en mobile -->
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
  </div>

  <!-- Modal confirmación con animación mejorada -->
  <transition name="overlay-fade">
    <div v-if="showModal" class="modal-overlay">
      <transition name="modal-pop">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Confirmación de cambio de pago">
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
</template>

<script setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import '~/assets/css/styles/admin/users.css';
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDownload } from "@mdi/js";

/* === Filtros === */
const searchQuery = ref("");
const options = ["Todos","Estudiante","Docente","Ponente/Tallerista","Externo","Activo","Inactivo","Pagado","No pagado"];
const selectedFilter = ref("Todos");

/* === Helper etiqueta de ID === */
function getIdLabel(type) {
  return type === "Estudiante" || type === "Docente" ? "Matrícula" : "ID";
}

/* === Datos demo === */
const users = reactive([
  { name: "Ana García López", email: "ana.garcia@universidad.edu.mx", code: "EST2024001", type: "Estudiante", typeColor: "type-estudiante", state: "Activo", stateColor: "state-activo", payment: "No pagado", paymentColor: "payment-no" },
  { name: "Dr. Carlos Mendoza", email: "carlos.mendoza@universidad.edu.mx", code: "DOC2024001", type: "Docente", typeColor: "type-docente", state: "Activo", stateColor: "state-activo", payment: "No pagado", paymentColor: "payment-no" },
  { name: "María Elena Ruiz", email: "maria.ruiz@techcorp.com", code: "EMP2024001", type: "Ponente/Tallerista", typeColor: "type-ponente", state: "Activo", stateColor: "state-activo", payment: "No aplica", paymentColor: "payment-noaplica" },
  { name: "Roberto Silva", email: "roberto.silva@gmail.com", code: "EXT2024001", type: "Externo", typeColor: "type-externo", state: "Inactivo", stateColor: "state-inactivo", payment: "No pagado", paymentColor: "payment-no" },

  { name: "Laura Hernández Torres", email: "laura.hernandez@universidad.edu.mx", code: "EST2024002", type: "Estudiante", typeColor: "type-estudiante", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Mtro. Javier Ortega", email: "javier.ortega@universidad.edu.mx", code: "DOC2024002", type: "Docente", typeColor: "type-docente", state: "Inactivo", stateColor: "state-inactivo", payment: "No pagado", paymentColor: "payment-no" },
  { name: "Ing. Patricia Morales", email: "patricia.morales@empresa.com", code: "EMP2024002", type: "Ponente/Tallerista", typeColor: "type-ponente", state: "Activo", stateColor: "state-activo", payment: "No aplica", paymentColor: "payment-noaplica" },
  { name: "Fernando López", email: "fernando.lopez@yahoo.com", code: "EXT2024002", type: "Externo", typeColor: "type-externo", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },

  { name: "Sofía Martínez", email: "sofia.martinez@universidad.edu.mx", code: "EST2024003", type: "Estudiante", typeColor: "type-estudiante", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
  { name: "Lic. Andrés Ramírez", email: "andres.ramirez@universidad.edu.mx", code: "DOC2024003", type: "Docente", typeColor: "type-docente", state: "Activo", stateColor: "state-activo", payment: "Pagado", paymentColor: "payment-pagado" },
]);

/* Filtro combinado */
const filteredUsers = computed(() =>
  users.filter((u) => {
    const q = searchQuery.value.trim().toLowerCase();
    const matchText = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.code.toLowerCase().includes(q);
    const f = selectedFilter.value;
    const matchFilter = f === "Todos" || u.type === f || u.state === f || u.payment === f;
    return matchText && matchFilter;
  })
);

/* === Toggle con confirmación === */
const showModal = ref(false);
const selectedCode = ref(null);
const pendingChange = ref(null);
const confirmBtn = ref(null);

const currentUser = computed(() => users.find((u) => u.code === selectedCode.value) || null);

function confirmToggle(code, event) {
  const user = users.find((u) => u.code === code);
  if (!user) return;
  pendingChange.value = user.payment === "Pagado" ? "No pagado" : "Pagado";
  event.target.checked = user.payment === "Pagado"; // revertir hasta confirmar
  selectedCode.value = code;
  showModal.value = true;
}
function applyToggle() {
  const user = users.find((u) => u.code === selectedCode.value);
  if (!user) return;
  user.payment = pendingChange.value;
  user.paymentColor = user.payment === "Pagado" ? "payment-pagado" : "payment-no";
  showModal.value = false;
}
function cancelToggle() {
  showModal.value = false;
}

/* focus automático en botón confirmar */
watch(showModal, (val) => {
  if (val) nextTick(() => confirmBtn.value?.focus());
});

/* === Exportar CSV === */
function exportData() {
  const rows = [["Nombre", "Correo", "Matrícula/ID", "Tipo", "Estado", "Estatus de pago"], ...filteredUsers.value.map((u) => [u.name, u.email, u.code, u.type, u.state, u.payment])];
  const csv = rows.map((r) => r.map((s) => `"${String(s).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "usuarios.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/* === Mini-select === */
const msOpen = ref(false);
const msActive = ref(0);
const msRef = ref(null);

function msToggle(force) {
  msOpen.value = typeof force === "boolean" ? force : !msOpen.value;
  if (msOpen.value) {
    const idx = Math.max(0, options.findIndex(o => o === selectedFilter.value));
    msActive.value = idx;
    nextTick(() => {
      const el = msRef.value?.querySelector(`#ms-${msActive.value}`);
      el?.focus?.();
    });
  }
}
function pickMs(opt) {
  selectedFilter.value = opt;
  msOpen.value = false;
}
function onMsListKeydown(e) {
  if (!msOpen.value) return;
  if (e.key === "ArrowDown") msActive.value = (msActive.value + 1) % options.length;
  else if (e.key === "ArrowUp") msActive.value = (msActive.value - 1 + options.length) % options.length;
  else if (e.key === "Enter" || e.key === " ") pickMs(options[msActive.value]);
  else if (e.key === "Escape" || e.key === "Tab") msOpen.value = false;
}
function onClickOutside(ev) {
  if (!msRef.value) return;
  if (!msRef.value.contains(ev.target)) msOpen.value = false;
}
onMounted(() => document.addEventListener("click", onClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", onClickOutside));
</script>