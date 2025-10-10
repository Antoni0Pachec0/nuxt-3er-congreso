<!-- components/admin/NewActivity.vue -->
<template>
  <div class="modal-card">
    <header class="modal-header">
      <h2>Nueva actividad</h2>
      <button class="icon-btn" @click="$emit('cancel')" aria-label="Cerrar">
        <i class="mdi mdi-close"></i>
      </button>
    </header>

    <div class="info-banner">
      <i class="mdi mdi-calendar-blank-outline"></i>
      <span>Agregando actividad para: <b>{{ label }}</b></span>
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <!-- Título -->
      <div class="field">
        <label class="label">Título de la actividad <span class="req">*</span></label>
        <input v-model.trim="form.title" type="text" class="input" placeholder="ej: Taller de Inteligencia Artificial" :class="{ invalid: errors.title }" />
        <p v-if="errors.title" class="error">{{ errors.title }}</p>
      </div>

      <!-- Tipo de actividad -->
      <div class="field">
        <label class="label">Tipo de actividad</label>
        <div class="select-wrap">
          <select v-model="form.type">
            <option value="taller">Taller</option>
            <option value="conferencia">Conferencia</option>
            <option value="registro">Registro</option>
            <option value="pausa">Pausa</option>
            <option value="actividad">Actividad</option>
          </select>
          <i class="mdi mdi-menu-down"></i>
        </div>
        <small class="help">Esto ayudará a establecer el título y el ícono automáticamente</small>
      </div>

      <!-- Horario + Salón -->
      <div class="grid-2">
        <div class="field">
          <label class="label">Horario <span class="req">*</span></label>
          <input v-model.trim="form.time" type="text" class="input" placeholder="ej: 09:00 - 10:30" :class="{ invalid: errors.time }" />
          <p v-if="errors.time" class="error">{{ errors.time }}</p>
        </div>

        <div class="field">
          <label class="label">Lugar (Salón) <span class="req">*</span></label>
          <div class="select-wrap" :class="{ invalid: errors.place }">
            <select v-model="form.place">
              <option value="" disabled>Seleccionar salón</option>
              <option>Aula Magna A</option>
              <option>Aula Magna B</option>
              <option>Auditorio Central</option>
              <option>Laboratorio de Computación A</option>
              <option>Sala Beta</option>
              <option>Área de Networking</option>
            </select>
            <i class="mdi mdi-menu-down"></i>
          </div>
          <p v-if="errors.place" class="error">{{ errors.place }}</p>
        </div>
      </div>

      <!-- Ponente/Instructor -->
      <div class="field">
        <label class="label">Ponente/Instructor</label>
        <input v-model.trim="form.speaker" type="text" class="input" placeholder="Nombre del ponente o instructor" />
      </div>

      <!-- Descripción -->
      <div class="field">
        <label class="label">Descripción <span class="req">*</span></label>
        <textarea
          v-model.trim="form.description"
          class="textarea"
          rows="5"
          maxlength="500"
          placeholder="Descripción detallada de la actividad..."
          :class="{ invalid: errors.description }"
        ></textarea>
        <div class="counter">{{ (form.description ?? '').length }} / 500 caracteres</div>
        <p v-if="errors.description" class="error">{{ errors.description }}</p>
      </div>

      <!-- Vista previa -->
      <section class="preview">
        <header class="preview-header">Vista previa</header>
        <div class="preview-item">
          <div class="avatar">
            <i :class="['mdi', previewIcon]"></i>
          </div>
          <div class="p-content">
            <h4 class="p-title">{{ form.title || defaultTitle }}</h4>
            <div class="p-meta">
              {{ previewTime }} · <span v-if="form.speaker && form.speaker.trim().length">{{ form.speaker }}</span>
              <span v-else>—</span>
              <span v-if="form.place"> · {{ form.place }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Acciones -->
      <footer class="actions">
        <button type="button" class="btn ghost" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="btn primary">
          <i class="mdi mdi-plus"></i>
          Crear actividad
        </button>
      </footer>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import '@mdi/font/css/materialdesignicons.min.css'

const props = defineProps({
  day:   { type: String, default: 'day1' },
  label: { type: String, default: 'Día 1 - Miércoles 12 Noviembre' },
  date:  { type: String, default: '2025-11-12' }
})

const emit = defineEmits(['cancel','created'])

const form = reactive({
  title: '',
  type: 'taller',
  time: '',
  place: '',
  speaker: '',
  description: ''
})

const errors = reactive({
  title: '',
  time: '',
  place: '',
  description: ''
})

const defaultTitle = 'Registro y Bienvenida'
const previewIcon = computed(() => {
  const t = (form.type || '').toLowerCase()
  if (t === 'taller') return 'mdi-laptop'
  if (t === 'conferencia') return 'mdi-presentation'
  if (t === 'registro') return 'mdi-magnify-scan'
  if (t === 'pausa') return 'mdi-coffee-outline'
  return 'mdi-calendar-blank'
})
const previewTime = computed(() => form.time || '08:00 - 09:00')

function validate () {
  errors.title = form.title ? '' : 'El título es obligatorio.'
  errors.time = form.time ? '' : 'El horario es obligatorio.'
  errors.place = form.place ? '' : 'El salón es obligatorio.'
  errors.description = form.description ? '' : 'La descripción es obligatoria.'
  return !(errors.title || errors.time || errors.place || errors.description)
}

async function onSubmit () {
  if (!validate()) return
  // Aquí harías tu POST al backend; por ahora emitimos el evento
  emit('created', {
    day: props.day,
    date: props.date,
    ...form
  })
}
</script>

<style scoped>
.modal-card{
  background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.08);
  max-width:900px;margin:0 auto;padding:16px 16px 20px;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:8px 8px 12px}
.modal-header h2{font-size:22px;font-weight:800;color:#0f172a;margin:0}
.icon-btn{border:0;background:transparent;cursor:pointer;color:#64748b;font-size:22px}
.icon-btn:hover{color:#0f172a}

.info-banner{
  display:flex;align-items:center;gap:10px;background:#eaf2ff;color:#1e3a8a;
  border:1px solid #cfe0ff;border-radius:10px;padding:12px 14px;margin:8px 0 18px;
}
.info-banner i{font-size:20px}

.form{display:block}
.field{margin-bottom:16px}
.label{display:block;font-weight:700;color:#334155;margin-bottom:6px}
.req{color:#ef4444}
.input,.textarea, .select-wrap select{
  width:100%;font-size:14px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:10px;
  outline:none;transition:border-color .2s, box-shadow .2s, background .2s;
  background:#fff;color:#0f172a;
}
.input::placeholder,.textarea::placeholder{color:#cbd5e1}
.input:focus,.textarea:focus,.select-wrap:focus-within{
  border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.15)
}
.textarea{resize:vertical}
.counter{font-size:12px;color:#64748b;margin-top:6px;text-align:right}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width: 720px){ .grid-2{grid-template-columns:1fr} }

.select-wrap{position:relative}
.select-wrap select{appearance:none;-webkit-appearance:none;-moz-appearance:none}
.select-wrap i{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:18px;color:#64748b;pointer-events:none}

.invalid{border-color:#ef4444 !important; box-shadow:0 0 0 3px rgba(239,68,68,.12)}
.error{color:#dc2626;font-size:12px;margin-top:6px}

.preview{background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;margin-top:8px}
.preview-header{padding:12px 14px;border-bottom:1px solid #e5e7eb;font-weight:700;color:#334155}
.preview-item{display:flex;gap:12px;padding:14px}
.avatar{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#e1eaff;color:#1e40af}
.avatar .mdi{font-size:18px}
.p-title{font-weight:800;color:#0f172a;margin:0 0 2px}
.p-meta{color:#64748b;font-size:14px}

.actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;font-weight:800;border:1px solid transparent;cursor:pointer;transition:box-shadow .2s, transform .1s}
.btn.ghost{background:#fff;border-color:#e5e7eb;color:#0f172a}
.btn.ghost:hover{box-shadow:0 2px 10px rgba(0,0,0,.06)}
.btn.primary{background:#1d4ed8;color:#fff}
.btn.primary:hover{box-shadow:0 2px 12px rgba(29,78,216,.35)}
.btn:active{transform:translateY(1px)}
</style>
