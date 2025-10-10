<template>
  <!-- Backdrop -->
  <transition name="backdrop" appear>
    <div class="modal-backdrop" @click.self="$emit('close')">
      <!-- Card -->
      <transition name="modal-pop" appear>
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="dlgTitle">

          <!-- Header -->
          <header class="modal-header">
            <h3 id="dlgTitle" class="modal-title">Editar Taller</h3>
            <button class="icon-btn" @click="$emit('close')" aria-label="Cerrar">
              <i class="mdi mdi-close"></i>
            </button>
          </header>

          <!-- Formulario -->
          <form class="form" ref="formRef" @submit.prevent="onSubmit">
            <div class="grid-2">

              <!-- Nombre -->
              <div class="field col-2">
                <label>Nombre del taller</label>
                <textarea
                  v-model.trim="form.title"
                  class="input-like"
                  rows="1"
                  @input="autoResize($event.target)"
                  required
                ></textarea>
              </div>

              <!-- Clasificación -->
              <div class="field">
                <label>Clasificación</label>
                <input v-model.trim="form.category" type="text" placeholder="Ej. Diseño, IA, DevOps…" />
              </div>

              <!-- Dificultad -->
              <div class="field">
                <label>Dificultad</label>
                <div class="select-wrapper">
                  <div class="mini-trigger" @click="toggleOpen('level')">
                    {{ form.level || 'Selecciona dificultad' }}
                    <svg class="chev" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <transition name="fade-slide">
                    <ul v-if="openId==='level'" class="dropdown-menu">
                      <li v-for="opt in levels" :key="opt"
                          :class="{active: form.level===opt}"
                          @click="form.level=opt; openId=null">
                        {{ opt }}
                      </li>
                    </ul>
                  </transition>
                </div>
              </div>

              <!-- Herramientas -->
              <div class="field col-2">
                <label>Herramientas</label>
                <div class="chips-input" @click="focusTools()">
                  <span v-for="(t, i) in tools" :key="t+i" class="chip">
                    {{ t }}
                    <button type="button" class="chip-x" @click.stop="removeTool(i)">
                      <i class="mdi mdi-close"></i>
                    </button>
                  </span>
                  <input
                    ref="toolsRef"
                    v-model="toolsInput"
                    type="text"
                    class="chips-editor"
                    :placeholder="tools.length ? '' : 'Ej. Figma, VS Code... (Enter o ,)'"
                    @keydown.enter.prevent="commitTool()"
                    @keydown="onToolsKeydown"
                  />
                </div>
              </div>

              <!-- Tallerista -->
              <div class="field">
                <label>Tallerista</label>
                <div class="select-wrapper">
                  <div class="mini-trigger" @click="toggleOpen('speaker')">
                    {{ form.speaker || 'Selecciona tallerista' }}
                    <svg class="chev" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <transition name="fade-slide">
                    <ul v-if="openId==='speaker'" class="dropdown-menu">
                      <li v-for="sp in speakers" :key="sp"
                          :class="{active: form.speaker===sp}"
                          @click="form.speaker=sp; openId=null">
                        {{ sp }}
                      </li>
                    </ul>
                  </transition>
                </div>
              </div>

              <!-- Fecha (solo lectura, igual que Nuevo Taller) -->
              <div class="field">
                <label>Fecha</label>
                <input type="text" value="12–14 noviembre 2025" readonly class="readonly-date" />
              </div>

              <!-- Horario (mismo formato que Nuevo Taller) -->
              <div class="field col-2">
                <label>Horario</label>
                <div class="time-grid">
                  <!-- Inicio -->
                  <div class="time-block">
                    <small class="time-subtitle">Inicio</small>
                    <div class="time-row">
                      <!-- Hora -->
                      <div class="select-wrapper">
                        <div class="mini-trigger" @click="toggleOpen('startHour')">
                          {{ form.startHour || 'HH' }}
                          <svg class="chev" viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                        </div>
                        <transition name="fade-slide">
                          <ul v-if="openId==='startHour'" class="dropdown-menu drop-up">
                            <li v-for="h in hours" :key="'sh'+h"
                                :class="{active: form.startHour===h}"
                                @click="form.startHour=h; openId=null; validateSplit()">
                              {{ h }}
                            </li>
                          </ul>
                        </transition>
                      </div>
                      <!-- Minutos -->
                      <div class="select-wrapper">
                        <div class="mini-trigger" @click="toggleOpen('startMin')">
                          {{ form.startMin || 'MM' }}
                          <svg class="chev" viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                        </div>
                        <transition name="fade-slide">
                          <ul v-if="openId==='startMin'" class="dropdown-menu drop-up">
                            <li v-for="m in minutes" :key="'sm'+m"
                                :class="{active: form.startMin===m}"
                                @click="form.startMin=m; openId=null; validateSplit()">
                              {{ m }}
                            </li>
                          </ul>
                        </transition>
                      </div>
                      <!-- Periodo -->
                      <div class="select-wrapper">
                        <div class="mini-trigger" @click="toggleOpen('startPeriod')">
                          {{ form.startPeriod || 'AM/PM' }}
                          <svg class="chev" viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                        </div>
                        <transition name="fade-slide">
                          <ul v-if="openId==='startPeriod'" class="dropdown-menu drop-up">
                            <li v-for="p in periods" :key="'sp'+p"
                                :class="{active: form.startPeriod===p}"
                                @click="form.startPeriod=p; openId=null; validateSplit()">
                              {{ p }}
                            </li>
                          </ul>
                        </transition>
                      </div>
                    </div>
                  </div>

                  <!-- Fin -->
                  <div class="time-block">
                    <small class="time-subtitle">Fin</small>
                    <div class="time-row">
                      <!-- Hora -->
                      <div class="select-wrapper">
                        <div class="mini-trigger" @click="toggleOpen('endHour')">
                          {{ form.endHour || 'HH' }}
                          <svg class="chev" viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                        </div>
                        <transition name="fade-slide">
                          <ul v-if="openId==='endHour'" class="dropdown-menu drop-up">
                            <li v-for="h in hours" :key="'eh'+h"
                                :class="{active: form.endHour===h}"
                                @click="form.endHour=h; openId=null; validateSplit()">
                              {{ h }}
                            </li>
                          </ul>
                        </transition>
                      </div>
                      <!-- Minutos -->
                      <div class="select-wrapper">
                        <div class="mini-trigger" @click="toggleOpen('endMin')">
                          {{ form.endMin || 'MM' }}
                          <svg class="chev" viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                        </div>
                        <transition name="fade-slide">
                          <ul v-if="openId==='endMin'" class="dropdown-menu drop-up">
                            <li v-for="m in minutes" :key="'em'+m"
                                :class="{active: form.endMin===m}"
                                @click="form.endMin=m; openId=null; validateSplit()">
                              {{ m }}
                            </li>
                          </ul>
                        </transition>
                      </div>
                      <!-- Periodo -->
                      <div class="select-wrapper">
                        <div class="mini-trigger" @click="toggleOpen('endPeriod')">
                          {{ form.endPeriod || 'AM/PM' }}
                          <svg class="chev" viewBox="0 0 24 24" width="18" height="18"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                        </div>
                        <transition name="fade-slide">
                          <ul v-if="openId==='endPeriod'" class="dropdown-menu drop-up">
                            <li v-for="p in periods" :key="'ep'+p"
                                :class="{active: form.endPeriod===p}"
                                @click="form.endPeriod=p; openId=null; validateSplit()">
                              {{ p }}
                            </li>
                          </ul>
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
                <small v-if="timeError" class="hint error">{{ timeError }}</small>
              </div>

              <!-- Salón -->
              <div class="field">
                <label>Salón</label>
                <div class="select-wrapper">
                  <div class="mini-trigger" @click="toggleOpen('room')">
                    {{ form.room || 'Selecciona salón' }}
                    <svg class="chev" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <transition name="fade-slide">
                    <ul v-if="openId==='room'" class="dropdown-menu">
                      <li v-for="r in rooms" :key="r"
                          :class="{active: form.room===r}"
                          @click="form.room=r; openId=null">
                        {{ r }}
                      </li>
                    </ul>
                  </transition>
                </div>
              </div>

              <!-- Capacidad -->
              <div class="field">
                <label>Capacidad</label>
                <input
                  v-model.number="form.capacity"
                  type="number"
                  min="1"
                  max="20"
                  @input="clampCapacity()"
                  :class="{ 'is-error': capacityError }"
                  required
                />
                <small v-if="capacityError" class="hint error">La capacidad máxima es 20.</small>
                <small v-else class="hint">Máximo: 20 asistentes.</small>
              </div>

              <!-- Icono (MDI) -->
              <div class="field col-2">
                <label>Icono (MDI)</label>
                <div class="icon-input-row" ref="iconWrap">
                  <div class="icon-preview">
                    <i :class="['mdi', form.icon]" aria-hidden="true"></i>
                  </div>
                  <div class="icon-autocomplete">
                    <!-- Input con prefijo fijo mdi- -->
                    <input
                      v-model="iconQuery"
                      type="text"
                      @input="enforcePrefix"
                      @focus="openSuggestions"
                      @keydown.down.prevent="move(1)"
                      @keydown.up.prevent="move(-1)"
                      @keydown.enter.prevent="confirmActive"
                      placeholder="Ej. mdi-language-python"
                    />
                    <!-- Sugerencias -->
                    <transition name="fade-slide">
                      <ul v-if="showDropdown && filteredIcons.length" class="dropdown-menu">
                        <li v-for="(ico,i) in filteredIcons" :key="ico"
                            :class="{active:i===activeIndex}"
                            @mousedown.prevent="selectIcon(ico)">
                          <i :class="['mdi', ico]"></i> {{ ico }}
                        </li>
                      </ul>
                    </transition>
                    <!-- Grid de íconos comunes -->
                    <div class="icon-grid">
                      <button
                        v-for="ico in commonIcons"
                        :key="ico"
                        type="button"
                        class="icon-grid-item"
                        @click="selectIcon(ico)"
                        :class="{ active: form.icon === ico }"
                      >
                        <i :class="['mdi', ico]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div class="field col-2">
                <label>Descripción</label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  maxlength="170"
                  placeholder="Descripción del taller..."
                ></textarea>
                <div class="hint">{{ (form.description?.length || 0) }} / 170 caracteres</div>
              </div>

            </div>

            <!-- Footer -->
            <footer class="modal-footer">
              <button type="button" class="btn ghost" @click="$emit('close')">Cancelar</button>
              <button type="button" class="btn danger" @click="$emit('delete', form.id)">
                <i class="mdi mdi-trash-can-outline"></i>
                Eliminar
              </button>
              <button type="submit" class="btn primary">
                <i class="mdi mdi-content-save-outline"></i>
                Guardar cambios
              </button>
            </footer>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import '@mdi/font/css/materialdesignicons.min.css'
import { mdiIcons } from '@/utils/mdiIcons'
import '@/assets/css/style_admin/NewWorkshop.css' // reutiliza estilos del modal "Nuevo"

/* ========= Props / Emits ========= */
const props = defineProps({
  workshop: { type: Object, default: () => ({}) },
  levels:   { type: Array,  default: () => ['Principiante','Intermedio','Avanzado'] },
  rooms:    { type: Array,  default: () => ['Aula Magna A','Aula Magna B','Laboratorio 1','Laboratorio 2','Salón 101'] },
  speakers: { type: Array,  default: () => ['Dr. Carlos Mendoza','María Elena Ruíz','Luis F. Castro','Ana P. López','Roberto Jiménez'] }
})
const emit = defineEmits(['close','save','delete'])

/* ========= Estado del formulario ========= */
const form = reactive({
  id: null,
  title: '',
  category: '',
  level: '',
  speaker: '',
  room: '',
  capacity: 1,
  description: '',
  icon: 'mdi-magnify',
  // formato dividido (12h)
  startHour: '', startMin: '', startPeriod: '',
  endHour:   '', endMin:   '', endPeriod:   '',
  // tools como string (los chips usan `tools` abajo)
  tools: '',
  ...props.workshop
})

/* ========= Dropdown genérico ========= */
const openId = ref(null)
function toggleOpen(id){ openId.value = openId.value === id ? null : id }

/* ========= Chips (herramientas) ========= */
const tools = ref((form.tools || '').split(',').map(s => s.trim()).filter(Boolean))
const toolsInput = ref('')
const toolsRef = ref(null)
function focusTools(){ toolsRef.value?.focus() }
function commitTool(){
  const raw = (toolsInput.value || '').trim().replace(/,+$/,'')
  if (!raw) return
  raw.split(',').map(s => s.trim()).filter(Boolean).forEach(addTool)
  toolsInput.value = ''
}
function addTool(t){ if (t && !tools.value.includes(t)) tools.value.push(t) }
function removeTool(i){ tools.value.splice(i,1) }
function onToolsKeydown(e){ if (e.key === ','){ e.preventDefault(); commitTool() } }

/* ========= Auto-resize para títulos/textarea ========= */
function autoResize(el){
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 240) + 'px'
}

/* ========= Listas de tiempo (12h) ========= */
const hours   = ['01','02','03','04','05','06','07','08','09','10','11','12']
const minutes = ['00','15','30','45']
const periods = ['AM','PM']

/* ======== Helpers 24h <-> 12h ======== */
function to24(hh, mm, p){ // 12h -> 24h "HH:MM"
  if (!hh || !mm || !p) return ''
  let h = Number(hh)
  if (p === 'AM') h = (h === 12) ? 0 : h
  else h = (h === 12) ? 12 : h + 12
  return `${String(h).padStart(2,'0')}:${mm}`
}
function from24(hhmm = ''){ // "HH:MM" -> {hour:'hh', min:'mm', period:'AM|PM'}
  const [hStr = '', mStr = '00'] = hhmm.split(':')
  let h = Number(hStr)
  const period = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  return {
    hour: String(h).padStart(2,'0'),
    min: String(Number(mStr) || 0).padStart(2,'0'),
    period
  }
}

/* ======== Prefill desde workshop.time (normaliza a 12h) ======== */
try {
  if (typeof props.workshop?.time === 'string') {
    const [aRaw, bRaw] = props.workshop.time.split('-')
    const a = (aRaw || '').trim()
    const b = (bRaw || '').trim()
    if (a) {
      const { hour, min, period } = from24(a)
      if (!form.startHour)   form.startHour   = hour
      if (!form.startMin)    form.startMin    = min
      if (!form.startPeriod) form.startPeriod = period
    }
    if (b) {
      const { hour, min, period } = from24(b)
      if (!form.endHour)   form.endHour   = hour
      if (!form.endMin)    form.endMin    = min
      if (!form.endPeriod) form.endPeriod = period
    }
  }
  // Si por alguna razón llegaron "13..23" como hora en props, corrige a 12h
  const fix = (hh, setH, setP) => {
    const n = Number(hh)
    if (Number.isFinite(n)) {
      if (n >= 13 && n <= 23) { const { hour, period } = from24(`${String(n).padStart(2,'0')}:00`); setH(hour); setP(period) }
      else if (n === 0) { setH('12'); setP('AM') }
    }
  }
  fix(form.startHour, v => form.startHour = v, v => form.startPeriod = v)
  fix(form.endHour,   v => form.endHour   = v, v => form.endPeriod   = v)
} catch { /* noop */ }

/* ========= Validaciones ========= */
const capacityError = ref(false)
function clampCapacity(){
  const n = Number(form.capacity || 0)
  if (n > 20) { capacityError.value = true; form.capacity = 20 }
  else if (n < 1) { capacityError.value = true; form.capacity = 1 }
  else capacityError.value = false
}

const timeError = ref('')
function validateSplit(){
  timeError.value = ''
  const s = to24(form.startHour, form.startMin, form.startPeriod)
  const e = to24(form.endHour,   form.endMin,   form.endPeriod)
  if (!s || !e) return
  if (s < '07:00' || e > '19:00') { timeError.value = 'El horario debe estar entre 07:00 y 19:00.'; return }
  if (e <= s) timeError.value = 'La hora de fin debe ser mayor que la de inicio.'
}

/* ========= Autocomplete de íconos (global mdiIcons) ========= */
const iconQuery = ref(form.icon || 'mdi-')
const showDropdown = ref(false)
const activeIndex = ref(0)
const filteredIcons = computed(()=>{
  const q = iconQuery.value.trim().toLowerCase()
  if (!q || q === 'mdi-') return mdiIcons
  return mdiIcons.filter(i => i.includes(q))
})
function enforcePrefix(){
  if (!iconQuery.value.startsWith('mdi-')) {
    iconQuery.value = 'mdi-' + iconQuery.value.replace(/^mdi-*/, '')
  }
  if (iconQuery.value === 'mdi-') openSuggestions()
}
function openSuggestions(){ showDropdown.value = true; activeIndex.value = 0 }
function closeSuggestions(){ showDropdown.value = false }
function move(step){
  if (!showDropdown.value || !filteredIcons.value.length) return
  const len = filteredIcons.value.length
  activeIndex.value = (activeIndex.value + step + len) % len
}
function confirmActive(){ if (!showDropdown.value || !filteredIcons.value.length) return; selectIcon(filteredIcons.value[activeIndex.value]) }
function selectIcon(name){ form.icon = name; iconQuery.value = name; closeSuggestions() }

/* ========= Grid de íconos comunes ========= */
const commonIcons = [
  'mdi-language-javascript','mdi-language-python','mdi-nodejs',
  'mdi-docker','mdi-kubernetes','mdi-git','mdi-github','mdi-gitlab',
  'mdi-database','mdi-server','mdi-shield-lock-outline','mdi-api',
  'mdi-cloud-outline','mdi-router-wireless','mdi-laptop','mdi-web'
]

/* ========= Cerrar con click fuera / Escape ========= */
const iconWrap = ref(null)
function onClickOutside(ev){
  const inside = ev.target.closest?.('.select-wrapper, .icon-autocomplete')
  if (!inside){ openId.value = null; closeSuggestions() }
}
function onKeyEsc(e){ if (e.key === 'Escape'){ openId.value=null; closeSuggestions() } }

/* ========= Mount / Unmount ========= */
onMounted(()=>{
  document.body.classList.add('modal-open')
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeyEsc)
})
onBeforeUnmount(()=>{
  document.body.classList.remove('modal-open')
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeyEsc)
})

/* ========= Submit / Delete ========= */
function onSubmit(){
  if (!form.title || !form.level || !form.room) return
  validateSplit(); if (timeError.value) return

  // Construye rango 24h para la card, pero el usuario siempre interactúa en 12h
  const start24 = to24(form.startHour, form.startMin, form.startPeriod)
  const end24   = to24(form.endHour,   form.endMin,   form.endPeriod)

  form.tools = tools.value.join(', ')
  const payload = {
    ...form,
    time: `${start24} - ${end24}` // tu grid muestra HH:MM - HH:MM
  }
  emit('save', payload)
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css');
/* Reutiliza las clases de NewWorkshop.css.
   Solo añadimos el estilo del botón "danger". */
.btn.danger{
  background:#fee2e2;
  color:#b91c1c;
}
.btn.danger:hover{
  background:#fecaca;
}
</style>
