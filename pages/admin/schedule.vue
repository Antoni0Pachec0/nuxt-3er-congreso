<template>
  <div class="table-container">
    <!-- ===== Header ===== -->
    <div class="header">
      <h1 class="title">Cronograma del Congreso</h1>
      <p class="subtitle">Gestiona la programación de los 3 días del evento</p>
    </div>

    <div class="hr-line"></div>

    <!-- ===== Filtros + acciones ===== -->
    <div class="actions-bar">
      <div class="mini-select" ref="dayRef">
        <button class="mini-trigger" type="button" @click="toggleDay()">
          <span>{{ selectedDayLabel }}</span>
          <svg class="chev" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        <transition name="ms">
          <ul v-if="dayOpen" class="mini-options">
            <li
              v-for="(opt, i) in dayOptions"
              :key="opt.value"
              class="mini-option"
              :class="{ active: i === dayActive, selected: opt.value === selectedDay }"
              @mouseenter="dayActive = i"
              @mousedown.prevent.stop="pickDay(opt.value)"
            >
              {{ opt.label }}
            </li>
          </ul>
        </transition>
      </div>

      <div class="actions-right">
        <button type="button" class="btn-outline" @click="exportSchedule">
          <i class="mdi mdi-download"></i>
          Exportar
        </button>

        <button type="button" class="btn-add" @click="onClickNewActivity">
          <i class="mdi mdi-plus"></i>
          Nueva Actividad
        </button>
      </div>
    </div>

    <div class="hr-line"></div>

    <!-- ===== Lista del día ===== -->
    <section class="sched">
      <header class="sched-head">
        <h2 class="sched-title">{{ selectedDayTitle }}</h2>
        <div class="sched-date">{{ selectedDayDate }}</div>
      </header>

      <ul class="sched-list">
        <li v-for="item in currentItems" :key="item.id" class="sched-item">
          <div class="sched-card">
            <span class="type-badge" :class="badgeClass(item.type)">{{ typeLabel(item.type) }}</span>

            <div class="sched-left">
              <div :class="['sched-icon', iconClass(item.type)]">
                <i :class="['mdi', item.icon || 'mdi-calendar-blank']"></i>
              </div>

              <div class="sched-content">
                <div class="sched-row">
                  <h3 class="sched-item-title">{{ item.title }}</h3>
                  <button class="edit-btn" @click="onEdit(item)">
                    <i class="mdi mdi-pencil"></i>
                  </button>
                </div>

                <div class="sched-meta">
                  <span class="meta">
                    <i class="mdi mdi-clock-outline"></i>
                    {{ item.time }}
                  </span>
                  <span class="dot"></span>
                  <span class="meta">
                    <i class="mdi mdi-map-marker-outline"></i>
                    {{ item.place }}
                  </span>
                  <span class="dot" v-if="item.speaker"></span>
                  <span class="meta" v-if="item.speaker">
                    <i class="mdi mdi-account-outline"></i>
                    {{ item.speaker }}
                  </span>
                </div>

                <p class="sched-desc" v-if="item.description">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- ===== MODAL: Agregar actividad ===== -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="showNew"
          class="overlay"
          role="dialog"
          aria-modal="true"
          @keydown.esc="closeNew"
        >
          <div class="backdrop" @click="closeNew"></div>

          <div class="modal-shell" ref="modalRef" tabindex="-1" autofocus>
            <!-- Tu formulario de actividades -->
            <NewActivity
              :day="selectedDay"
              :label="selectedDayLabel"
              :date="selectedDayDate"
              @cancel="closeNew"
              @created="handleCreated"
            />
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import '@mdi/font/css/materialdesignicons.min.css'
import NewActivity from '@/components/admin/NewActivity.vue' // ⬅️ el formulario
import '~/assets/css/style_admin/Schedule.css'

/* ===== Estado día ===== */
const dayOptions = [
  { value: 'day1', label: 'Día 1 - Miércoles 12 Noviembre' },
  { value: 'day2', label: 'Día 2 - Jueves 13 Noviembre' },
  { value: 'day3', label: 'Día 3 - Viernes 14 Noviembre' }
]
const dayDates = { day1: '2025-11-12', day2: '2025-11-13', day3: '2025-11-14' }

const selectedDay = ref('day1')
const selectedDayLabel = computed(() => dayOptions.find(d => d.value === selectedDay.value)?.label ?? '')
const selectedDayTitle = computed(() => selectedDayLabel.value.split(' - ')[0])
const selectedDayDate = computed(() => dayDates[selectedDay.value] || '')

const dayOpen = ref(false)
const dayActive = ref(0)
const dayRef = ref(null)

function toggleDay () {
  dayOpen.value = !dayOpen.value
  if (dayOpen.value) {
    const idx = Math.max(0, dayOptions.findIndex(d => d.value === selectedDay.value))
    dayActive.value = idx
  }
}
function pickDay (val) {
  selectedDay.value = val
  dayActive.value = dayOptions.findIndex(d => d.value === val)
  dayOpen.value = false
}
function onClickOutside (e) {
  if (!dayRef.value?.contains(e.target)) dayOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

/* ===== Modal Nueva Actividad ===== */
const showNew = ref(false)
const modalRef = ref(null)

function onClickNewActivity () {
  showNew.value = true
}
function closeNew () {
  showNew.value = false
}
// bloquear scroll de fondo
watch(showNew, (v) => {
  document.body.classList.toggle('modal-open', v)
})

/* ===== Datos de ejemplo ===== */
function uid () { return Math.random().toString(36).slice(2, 9) }

const data = {
  day1: [
    { id: 1, type: 'registro', title: 'Registro y Bienvenida', time: '08:00 - 09:00', place: 'Entrada del salón', speaker: 'Director del salón', description: 'Acreditación de participantes y entrega de materiales', icon: 'mdi-magnify-scan' },
    { id: 2, type: 'conferencia', title: 'Inteligencia Artificial en el Futuro', time: '09:00 - 10:30', place: 'Auditorio Central', speaker: 'Dra. María González', description: 'Explorando tendencias emergentes en IA y su impacto en la sociedad', icon: 'mdi-presentation' },
    { id: 3, type: 'pausa', title: 'Pausa para el café', time: '10:30 - 11:00', place: 'Área de Networking', speaker: '', description: 'Pausa para networking y refrigerios', icon: 'mdi-coffee-outline' },
    { id: 4, type: 'conferencia', title: 'Blockchain y Criptomonedas', time: '11:00 - 12:30', place: 'Sala Beta', speaker: 'Ing. Carlos Rodríguez', description: 'Fundamentos y aplicaciones prácticas de la tecnología blockchain', icon: 'mdi-presentation' },
    { id: 5, type: 'taller', title: 'Taller: Desarrollo con React', time: '14:00 - 17:00', place: 'Laboratorio de Computación A', speaker: 'Ana Martínez', description: 'Sesión práctica de frontend con React y TypeScript', icon: 'mdi-laptop' }
  ],
  day2: [],
  day3: []
}
const currentItems = computed(() => data[selectedDay.value] || [])

/* ===== Helpers UI ===== */
function badgeClass(type){
  switch ((type||'').toLowerCase()){
    case 'conferencia': return 'badge--conference'
    case 'registro':    return 'badge--register'
    case 'pausa':       return 'badge--break'
    case 'taller':      return 'badge--workshop'
    default:            return 'badge--default'
  }
}
function iconClass(type){
  switch ((type||'').toLowerCase()){
    case 'conferencia': return 'icon--conference'
    case 'registro':    return 'icon--register'
    case 'pausa':       return 'icon--break'
    case 'taller':      return 'icon--workshop'
    default:            return 'icon--default'
  }
}
function typeLabel(type){
  switch ((type||'').toLowerCase()){
    case 'conferencia': return 'Conferencia'
    case 'registro':    return 'Registro'
    case 'pausa':       return 'Pausa'
    case 'taller':      return 'Taller'
    default:            return 'Actividad'
  }
}
function onEdit(item){ console.log('Editar', item) }
function exportSchedule () { console.log('Exportar cronograma de', selectedDay.value) }

/* ===== Al crear desde el modal, agregamos al día actual ===== */
function handleCreated(payload) {
  const iconByType = {
    taller: 'mdi-laptop',
    conferencia: 'mdi-presentation',
    registro: 'mdi-magnify-scan',
    pausa: 'mdi-coffee-outline',
    actividad: 'mdi-calendar-blank'
  }
  data[selectedDay.value].push({
    id: uid(),
    type: payload.type,
    title: payload.title,
    time: payload.time,
    place: payload.place,
    speaker: payload.speaker || '',
    description: payload.description || '',
    icon: iconByType[payload.type?.toLowerCase()] || 'mdi-calendar-blank'
  })
  closeNew()
}
</script>
