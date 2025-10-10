// composables/admin/use-workshops-static.js
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

export function useWorkshopsStatic () {
  /* ==== Estado del filtro ==== */
  const searchQuery = ref('')
  const filterOptions = ['Todos', 'Avanzado', 'Intermedio', 'Principiante', 'Cerrado']
  const selectedFilter = ref('Todos')
  const msOpen = ref(false)
  const msActive = ref(filterOptions.indexOf(selectedFilter.value))
  const msRef = ref(null)

  function msToggle () {
    msOpen.value = !msOpen.value
    if (msOpen.value) {
      msActive.value = Math.max(0, filterOptions.indexOf(selectedFilter.value))
    }
  }
  function pickMs (opt) {
    selectedFilter.value = opt
    msActive.value = filterOptions.indexOf(opt)
    msOpen.value = false
  }
  function onClickOutside (e) {
    if (!msRef.value?.contains(e.target)) msOpen.value = false
  }
  watch(selectedFilter, v => {
    msActive.value = Math.max(0, filterOptions.indexOf(v))
  })
  onMounted(() => document.addEventListener('click', onClickOutside))
  onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

  /* ==== Datos estáticos (mock local) ==== */
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
      closed: true
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
      const matchFilter = f === 'Todos' || w.level === f || (f === 'Cerrado' && w.enrolled >= w.capacity)
      return matchText && matchFilter
    })
  })

  /* ==== Helpers ==== */
  const occupancy = w => Math.round((w.enrolled / w.capacity) * 100)
  const isClosed = w => w.enrolled >= w.capacity
  const badgeClass = lvl => {
    const l = lvl?.toLowerCase() || ''
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
    const [a, b] = timeStr.split('-').map(s => (s || '').trim())
    return { start: a || '', end: b || '' }
  }

  function onClickEdit (w) {
    const { start, end } = parseRange(w.time)
    editData.value = {
      ...w,
      startTime: start,
      endTime: end,
      tools: Array.isArray(w.tools) ? w.tools.join(', ') : (w.tools || '')
    }
    editOpen.value = true
  }

  function onUpdateWorkshop (payload) {
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
      time: payload.time,
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

  return {
    // filtro / mini-select
    searchQuery, filterOptions, selectedFilter,
    msRef, msOpen, msActive, msToggle, pickMs,

    // data derivada
    filteredWorkshops,

    // helpers
    occupancy, isClosed, badgeClass,

    // modales / catálogos
    newOpen, levels, rooms, speakers, onClickNewWorkshop,
    editOpen, editData, onClickEdit, onCreateWorkshop, onUpdateWorkshop, onDeleteWorkshop
  }
}
