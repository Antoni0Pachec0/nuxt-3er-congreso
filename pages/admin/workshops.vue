<template>
  <div class="table-container">
    <!-- Encabezado -->
    <div class="header">
      <h1 class="title">Gestión de Talleres</h1>
      <p class="subtitle">Administra los talleres del congreso</p>
    </div>

    <!-- Línea divisora -->
    <div class="hr-line"></div>

    <!-- ===== Barra de búsqueda + filtro + botón ===== -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre, instructor o salón..."
        class="search-input"
      />

      <div class="mini-select" ref="msRef">
        <button class="mini-trigger" type="button" @click="msToggle()">
          <span>{{ selectedFilter }}</span>
          <svg class="chev" viewBox="0 0 24 24" width="18" height="18">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>

        <transition name="ms">
          <ul v-if="msOpen" class="mini-options">
            <li
              v-for="(opt, i) in filterOptions"
              :key="opt"
              class="mini-option"
              :class="{ active: i === msActive, selected: opt === selectedFilter }"
              @mouseenter="msActive = i"                  
              @mousedown.prevent.stop="pickMs(opt)"
            >
              {{ opt }}
            </li>
          </ul>
        </transition>
      </div>

      <!-- Botón nuevo taller -->
      <button class="btn-add" @click="onClickNewWorkshop">
        <i class="mdi mdi-plus"></i>
        Nuevo Taller
      </button>
    </div>

    <div class="hr-line"></div>

    <!-- ====== Grid de cards ====== -->
    <transition-group name="cards" tag="section" class="cards-grid" appear>
      <article
        v-for="w in filteredWorkshops"
        :key="w.id"
        class="workshop-card"
      >
      <!-- Encabezado con icono, título/subtítulo a la derecha y badge arriba -->
        <div class="wk-head">
          <div class="wk-left">
            <div class="wk-icon">
              <i :class="['mdi', w.icon || 'mdi-briefcase-outline']"></i>
            </div>
            <div class="wk-titlebox">
              <h3 class="wk-title">{{ w.title }}</h3>
              <p v-if="w.category" class="wk-subtitle">{{ w.category }}</p>
            </div>
          </div>

          <span class="wk-badge" :class="badgeClass(w.level)">{{ w.level }}</span>
        </div>

        <!-- Descripción -->
        <p class="wk-desc">
          {{ w.description || 'Sin descripción proporcionada.' }}
        </p>

        <!-- Herramientas -->
        <div v-if="w.tools?.length" class="wk-tools">
          <span v-for="(t, i) in w.tools" :key="i" class="wk-chip">{{ t }}</span>
        </div>

        <!-- Meta -->
        <ul class="wk-meta">
          <li><i class="mdi mdi-account-tie-outline"></i> {{ w.speaker }}</li>
          <li><i class="mdi mdi-office-building-marker-outline"></i> {{ w.room }}</li>
          <li><i class="mdi mdi-clock-outline"></i> {{ w.time }}</li>
          <li><i class="mdi mdi-account-group-outline"></i> {{ w.enrolled }} / {{ w.capacity }} participantes</li>
        </ul>

        <!-- Progreso -->
        <div class="wk-progress">
          <div class="wk-progress__bar">
            <span class="wk-progress__fill" :style="{ width: occupancy(w) + '%' }"></span>
          </div>
          <div class="wk-progress__row">
            <span class="wk-progress__caption">{{ occupancy(w) }}% ocupado</span>
            <span v-if="isClosed(w)" class="wk-status wk-status--full">Cerrado</span>
          </div>
        </div>

        <!-- Botón editar -->
        <div class="wk-divider"></div>
        <div class="wk-actions">
          <button type="button" class="btn-edit" @click="onClickEdit(w)">
            <i class="mdi mdi-pencil"></i> Editar
          </button>
        </div>
      </article>
    </transition-group>

    <!-- Modal nuevo taller -->
    <NewWorkshop
      v-if="newOpen"
      :levels="levels"
      :rooms="rooms"
      :speakers="speakers"
      @close="newOpen = false"
      @save="onCreateWorkshop"
    />

    <!-- Modal editar taller -->
    <EditWorkshop
      v-if="editOpen"
      :workshop="editData"
      :levels="levels"
      :rooms="rooms"
      :speakers="speakers"
      @close="editOpen = false"
      @save="onUpdateWorkshop"
      @delete="onDeleteWorkshop"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import '@mdi/font/css/materialdesignicons.min.css'
import '~/assets/css/style_admin/Workshops.css'
import NewWorkshop from '@/components/admin/NewWorkshop.vue'
import EditWorkshop from '@/components/admin/EditWorkshop.vue'

/* ==== Estado del filtro ==== */
const searchQuery = ref('')
const filterOptions = ['Todos', 'Avanzado', 'Intermedio', 'Principiante', 'Cerrado']
const selectedFilter = ref('Todos')
const msOpen = ref(false)
const msActive = ref(filterOptions.indexOf(selectedFilter.value)) // activo inicial correcto
const msRef = ref(null)

function msToggle () {
  msOpen.value = !msOpen.value
  // Al abrir, posiciona el "gris" (activo) en la opción actualmente seleccionada
  if (msOpen.value) {
    msActive.value = Math.max(0, filterOptions.indexOf(selectedFilter.value))
  }
}
function pickMs (opt) {
  selectedFilter.value = opt
  msActive.value = filterOptions.indexOf(opt) // mueve el activo al elegido
  msOpen.value = false
}
function onClickOutside (e) {
  if (!msRef.value?.contains(e.target)) msOpen.value = false
}
// Si el filtro cambia desde otro lado, sincroniza el activo
watch(selectedFilter, v => {
  msActive.value = Math.max(0, filterOptions.indexOf(v))
})

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

/* ==== Datos de ejemplo (1 taller por defecto) ==== */
const workshops = ref([
  {
    id: 1,
    title: 'Introducción a la Ciberseguridad',
    category: 'Ciberseguridad',
    level: 'Intermedio',
    speaker: 'Ing. Laura Ramírez',
    room: 'Aula Magna A',
    time: '10:00 - 13:00',
    enrolled: 8,
    capacity: 20,
    description: 'Aprende los fundamentos de ciberseguridad, amenazas y buenas prácticas para proteger sistemas.',
    tools: ['Kali Linux', 'Wireshark', 'Burp Suite'],
    icon: 'mdi-shield-lock-outline',
    closed: false
  },
    {
    id: 2,
    title: 'Diseño en Figma: de wireframes a prototipos',
    category: 'Diseño',
    level: 'Principiante',
    speaker: 'Ana P. López',
    room: 'Aula Magna B',
    time: '09:00 - 11:00',
    enrolled: 12,
    capacity: 20,
    description: 'Aprende a crear wireframes, componentes y prototipos navegables en Figma con buenas prácticas.',
    tools: ['Figma', 'FigJam', 'Auto Layout'],
    icon: 'mdi-palette-outline',
    closed: false
  },
  {
    id: 3,
    title: 'Introducción a IA Generativa',
    category: 'Inteligencia Artificial',
    level: 'Intermedio',
    speaker: 'Dr. Carlos Mendoza',
    room: 'Salón 101',
    time: '11:30 - 13:30',
    enrolled: 20,
    capacity: 20,
    description: 'Conceptos clave de modelos generativos, prompts efectivos y casos de uso prácticos.',
    tools: ['Python', 'Jupyter', 'OpenAI API'],
    icon: 'mdi-brain',
    closed: true // lleno (enrolled >= capacity)
  },
  {
    id: 4,
    title: 'Desarrollo Web con Vue 3 + Vite',
    category: 'Desarrollo Web',
    level: 'Intermedio',
    speaker: 'Luis F. Castro',
    room: 'Laboratorio 1',
    time: '14:00 - 17:00',
    enrolled: 15,
    capacity: 20,
    description: 'Crea SPA modernas con composición, Pinia y rutas; configura Vite para DX superior.',
    tools: ['Vue 3', 'Vite', 'Pinia'],
    icon: 'mdi-vuejs',
    closed: false
  },
  {
    id: 5,
    title: 'DevOps con Docker y Kubernetes',
    category: 'DevOps',
    level: 'Avanzado',
    speaker: 'Roberto Jiménez',
    room: 'Laboratorio 2',
    time: '10:00 - 13:00',
    enrolled: 9,
    capacity: 20,
    description: 'Empaqueta servicios con Docker, orquéstralos en Kubernetes y automatiza despliegues.',
    tools: ['Docker', 'Kubernetes', 'kubectl'],
    icon: 'mdi-kubernetes',
    closed: false
  },
  {
    id: 6,
    title: 'Análisis de Datos con Python',
    category: 'Data Science',
    level: 'Principiante',
    speaker: 'María Elena Ruíz',
    room: 'Aula Magna A',
    time: '16:00 - 18:00',
    enrolled: 7,
    capacity: 20,
    description: 'Manipula, limpia y visualiza datos con Pandas y Matplotlib; buenas prácticas de EDA.',
    tools: ['Pandas', 'NumPy', 'Matplotlib'],
    icon: 'mdi-chart-line',
    closed: false
  }
])

/* ==== Computed ==== */
const filteredWorkshops = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return workshops.value.filter(w => {
    const matchText = !q ||
      w.title.toLowerCase().includes(q) ||
      w.speaker.toLowerCase().includes(q) ||
      w.room.toLowerCase().includes(q)
    const f = selectedFilter.value
    const matchFilter = f === 'Todos' || w.level === f || (f === 'Cerrado' && w.closed)
    return matchText && matchFilter
  })
})

/* ==== Helpers ==== */
const occupancy = w => Math.round((w.enrolled / w.capacity) * 100)
const isClosed = w => w.enrolled >= w.capacity
const badgeClass = lvl => {
  const l = lvl?.toLowerCase()
  if (l.includes('avanz')) return 'badge--advanced'
  if (l.includes('inter')) return 'badge--intermediate'
  if (l.includes('princi')) return 'badge--beginner'
  return ''
}

/* ==== Nuevo taller ==== */
const newOpen = ref(false)
const levels = ['Principiante', 'Intermedio', 'Avanzado']
const rooms = ['Aula Magna A', 'Aula Magna B', 'Laboratorio 1', 'Laboratorio 2', 'Salón 101']
const speakers = ['Dr. Carlos Mendoza', 'María Elena Ruíz', 'Luis F. Castro', 'Ana P. López', 'Roberto Jiménez']

function onClickNewWorkshop () { newOpen.value = true }
function onCreateWorkshop (newData) {
  const id = Math.max(...workshops.value.map(w => w.id)) + 1
  workshops.value.push({ id, ...newData, enrolled: 0, closed: false })
  newOpen.value = false
}

/* ==== Editar taller ==== */
const editOpen = ref(false)
const editData = ref(null)

function parseRange (timeStr = '') {
  // Formato esperado: "HH:MM - HH:MM" (con espacios)
  const [a, b] = timeStr.split('-').map(s => (s || '').trim())
  return { start: a || '', end: b || '' }
}

function onClickEdit (w) {
  const { start, end } = parseRange(w.time)
  editData.value = {
    ...w,
    // Para el editor usamos campos separados
    startTime: start,
    endTime: end,
    // El editor usa string en tools (igual que NewWorkshop antes de emitir)
    tools: Array.isArray(w.tools) ? w.tools.join(', ') : (w.tools || '')
  }
  editOpen.value = true
}

function onUpdateWorkshop (payload) {
  // payload viene del modal con { ...form, time: 'HH:MM - HH:MM', tools: 'a, b, c' }
  const idx = workshops.value.findIndex(x => x.id === payload.id)
  if (idx === -1) return

  const toolsArray = (payload.tools || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  workshops.value[idx] = {
    ...workshops.value[idx],
    ...payload,
    tools: toolsArray,
    time: payload.time, // ya viene formateado 'HH:MM - HH:MM'
    level: payload.level,
    room: payload.room,
    title: payload.title,
    description: payload.description,
    capacity: payload.capacity,
    icon: payload.icon,
    category: payload.category ?? workshops.value[idx].category
  }

  editOpen.value = false
}

function onDeleteWorkshop (id) {
  const i = workshops.value.findIndex(w => w.id === id)
  if (i !== -1) workshops.value.splice(i, 1)
  editOpen.value = false
}
</script>
