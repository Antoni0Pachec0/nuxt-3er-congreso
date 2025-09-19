<template>
  <main id="register" class="auth-screen" role="main">
    <div class="auth-bg" aria-hidden="true">
      <span class="blob blob--tl"></span>
      <span class="blob blob--br"></span>
      <span class="ring ring--1"></span>
      <span class="ring ring--2"></span>
      <span class="shape shape--sq"></span>
      <span class="shape shape--dot"></span>
    </div>

    <div class="auth-container">
      <header class="auth-hero" aria-label="Event identity">
        <h1 class="hero-title">
          <span class="kicker">3er</span>
          <span class="line1">Congreso</span>
          <span class="line2">Internacional</span>
        </h1>
      </header>

      <section class="card" aria-label="Registration form">
        <h2 class="card-title card-title--center">
          <span class="arrow" aria-hidden="true">
            <SvgIcon :path="mdiAccountPlusOutline" type="mdi" />
          </span>
          <span class="card-title__text">Crear cuenta</span>
        </h2>

        <p v-if="apiError" class="alert alert--error" role="alert">
          {{ apiError }}
        </p>

        <ol class="stepper stepper--timeline" aria-label="Registration progress">
          <li
            v-for="(s, i) in steps"
            :key="s.key"
            class="step"
            :class="{ active: i === step, done: i < step }"
          >
            <span class="step__dot" aria-hidden="true"></span>
            <span class="step__index" aria-hidden="true">{{ i + 1 }}</span>
            <span class="step__label">{{ s.label }}</span>
          </li>
        </ol>

        <form class="form" @submit.prevent="nextOrSubmit" novalidate>
          <template v-if="step === 0">
            <div class="stack">
              <label class="label" for="email">Email</label>
              <div class="input-wrap">
                <span class="input-icon"><SvgIcon :path="mdiEmailOutline" type="mdi" /></span>
                <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="tu@email.com"
                  class="input"
                />
              </div>
            </div>

            <div class="grid resp">
              <div class="stack">
                <label class="label" for="password_user">Contraseña</label>
                <div class="input-wrap">
                  <span class="input-icon"><SvgIcon :path="mdiLockOutline" type="mdi" /></span>
                  <input
                    id="password_user"
                    :type="showPass ? 'text' : 'password'"
                    v-model.trim="form.password_user"
                    required
                    minlength="8"
                    autocomplete="new-password"
                    placeholder="••••••••"
                    class="input input--pass"
                    @input="touchPwd()"
                  />
                  <button
                    type="button"
                    class="eye"
                    :aria-pressed="showPass ? 'true' : 'false'"
                    :title="showPass ? 'Ocultar' : 'Mostrar'"
                    @click="showPass = !showPass"
                  >
                    <SvgIcon v-if="showPass" :path="mdiEyeOffOutline" type="mdi" />
                    <SvgIcon v-else :path="mdiEyeOutline" type="mdi" />
                  </button>
                </div>

                <div class="pw-meter" aria-live="polite">
                  <div class="pw-meter__bar">
                    <span class="pw-meter__fill" :style="{ width: strengthPercent }"></span>
                  </div>
                  <div class="pw-meter__legend">
                    Fortaleza: <strong :class="'pw-' + strengthLabel.toLowerCase()">{{ strengthLabel }}</strong>
                  </div>
                  <ul class="pw-reqs">
                    <li :class="{ ok: reqs.len }">Mínimo 8 caracteres</li>
                    <li :class="{ ok: reqs.upper }">Una mayúscula (A–Z)</li>
                    <li :class="{ ok: reqs.lower }">Una minúscula (a–z)</li>
                    <li :class="{ ok: reqs.num }">Un número (0–9)</li>
                    <li :class="{ ok: reqs.sym }">Un símbolo (!@#$%…)</li>
                  </ul>
                </div>
              </div>

              <div class="stack">
                <label class="label" for="password2">Confirmar contraseña</label>
                <div class="input-wrap">
                  <span class="input-icon"><SvgIcon :path="mdiLockCheckOutline" type="mdi" /></span>
                  <input
                    id="password2"
                    :type="showPass2 ? 'text' : 'password'"
                    v-model.trim="password2"
                    required
                    minlength="8"
                    autocomplete="new-password"
                    placeholder="••••••••"
                    class="input input--pass"
                  />
                  <button
                    type="button"
                    class="eye"
                    :aria-pressed="showPass2 ? 'true' : 'false'"
                    :title="showPass2 ? 'Ocultar' : 'Mostrar'"
                    @click="showPass2 = !showPass2"
                  >
                    <SvgIcon v-if="showPass2" :path="mdiEyeOffOutline" type="mdi" />
                    <SvgIcon v-else :path="mdiEyeOutline" type="mdi" />
                  </button>
                </div>
                <small class="help" v-if="password2 && !pwdMatch">Las contraseñas no coinciden.</small>
              </div>
            </div>
          </template>

          <template v-else-if="step === 1">
            <div class="grid resp">
              <div class="stack">
                <label class="label" for="name_user">Nombre(s)</label>
                <input
                  id="name_user"
                  v-model.trim="form.name_user"
                  type="text"
                  required
                  autocomplete="given-name"
                  class="input"
                  placeholder="Tu nombre"
                />
              </div>
              <div class="stack">
                <label class="label" for="paternal_surname">Apellido paterno</label>
                <input
                  id="paternal_surname"
                  v-model.trim="form.paternal_surname"
                  type="text"
                  required
                  autocomplete="family-name"
                  class="input"
                  placeholder="Paterno"
                />
              </div>
              <div class="stack">
                <label class="label" for="maternal_surname">Apellido materno</label>
                <input
                  id="maternal_surname"
                  v-model.trim="form.maternal_surname"
                  type="text"
                  required
                  class="input"
                  placeholder="Materno"
                />
              </div>
              <div class="stack">
                <label class="label" for="phone">Teléfono</label>
                <input
                  id="phone"
                  v-model.trim="form.phone"
                  type="tel"
                  required
                  autocomplete="tel"
                  class="input"
                  placeholder="10 dígitos"
                />
              </div>
              <div class="stack col-span-2">
                <label class="label" for="emergency_phone">Teléfono de emergencia (opcional)</label>
                <input
                  id="emergency_phone"
                  v-model.trim="form.emergency_phone"
                  type="tel"
                  class="input"
                  placeholder="Opcional"
                />
              </div>
            </div>
          </template>

          <template v-else-if="step === 2">
            <div class="grid resp">
              <div class="stack">
                <label class="label" for="type_user_id">Tipo de usuario</label>
                <select id="type_user_id" v-model.number="form.type_user_id" class="input" required>
                  <option disabled value="">Selecciona una opción</option>
                  <option :value="1">Estudiante</option>
                  <option :value="2">Docente</option>
                  <option :value="3">Externo</option>
                  <option :value="4">Conferencista</option>
                  <option :value="5">Tallerista</option>
                </select>
              </div>

              <div class="stack">
                <label class="label" for="provenance">Procedencia</label>
                <select id="provenance" v-model="form.provenance" class="input" required>
                  <option disabled value="">Selecciona</option>
                  <option value="uttecam">UTTECAM</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div v-if="form.provenance==='uttecam' && form.type_user_id === 2" class="grid resp">
              <div class="stack">
                <label class="label" for="educational_program">Programa educativo</label>
                <select
                  id="educational_program"
                  v-model="form.educational_program"
                  class="input"
                  required
                >
                  <option disabled value="">Selecciona programa (1–9)</option>
                  <option v-for="n in 9" :key="'pd'+n" :value="`Programa ${n}`">Programa {{ n }}</option>
                </select>
              </div>
              <div class="stack">
                <label class="label" for="matricula">Matrícula</label>
                <input
                  id="matricula"
                  v-model.trim="form.matricula"
                  type="text"
                  class="input"
                  required
                  placeholder="Tu matrícula"
                />
              </div>
            </div>

            <div v-if="form.provenance==='uttecam' && form.type_user_id === 1" class="grid resp">
              <div class="stack">
                <label class="label" for="matricula">Matrícula</label>
                <input
                  id="matricula"
                  v-model.trim="form.matricula"
                  type="text"
                  class="input"
                  required
                  placeholder="Tu matrícula"
                />
              </div>
              <div class="stack">
                <label class="label" for="educational_program">Programa educativo</label>
                <select
                  id="educational_program"
                  v-model="form.educational_program"
                  class="input"
                  required
                >
                  <option disabled value="">Selecciona programa (1–9)</option>
                  <option v-for="n in 9" :key="'pe'+n" :value="`Programa ${n}`">Programa {{ n }}</option>
                </select>
              </div>
              <div class="stack">
                <label class="label" for="grade">Grado</label>
                <input
                  id="grade"
                  v-model.trim="form.grade"
                  maxlength="2"
                  class="input"
                  placeholder="Ej. 7"
                  required
                />
              </div>
              <div class="stack">
                <label class="label" for="group_user">Grupo</label>
                <input
                  id="group_user"
                  v-model.trim="form.group_user"
                  maxlength="1"
                  class="input"
                  placeholder="Ej. A"
                  required
                />
              </div>
            </div>

            <div
              v-if="form.provenance==='otro' && (form.type_user_id===1 || form.type_user_id===2 || form.type_user_id===3)"
              class="grid resp"
            >
              <div class="stack col-span-2">
                <label class="label" for="provenance_other">Empresa o Universidad</label>
                <input
                  id="provenance_other"
                  v-model.trim="form.provenance"
                  type="text"
                  class="input"
                  placeholder="Nombre de la institución"
                />
              </div>
            </div>
          </template>

          <template v-else-if="step === 3">
            <div class="grid resp">
              <div class="stack">
                <label class="label" for="size_user">Talla de playera</label>
                <select id="size_user" v-model="form.size_user" class="input" required>
                  <option value="" disabled>Selecciona tu talla</option>
                  <option>S</option><option>M</option><option>L</option>
                  <option>XL</option><option>XXL</option>
                </select>
              </div>
            </div>

            <div class="checkline">
              <input id="terms" v-model="accepted" type="checkbox" required />
              <label for="terms">Acepto los términos y aviso de privacidad</label>
            </div>
          </template>

          <div class="nav">
            <button v-if="step>0" type="button" class="btn ghost" @click="prevStep">Atrás</button>
            <button v-if="step<steps.length-1" type="submit" class="btn" :disabled="!canProceed">
              Continuar
            </button>
            <button v-else type="submit" class="btn" :disabled="loading || !canSubmit">
              {{ loading ? 'Creando cuenta…' : 'Crear cuenta' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiAccountPlusOutline, mdiEmailOutline, mdiLockOutline, mdiEyeOutline, mdiEyeOffOutline, mdiLockCheckOutline
} from '@mdi/js'

// Axios + rutas + parser de errores
import api from '~/plugins/http/api'
import { ROUTES } from '~/plugins/http/routes'
import { parseAxiosError } from '~/plugins/http/error'

import '@/assets/css/styles/Register.css';

const STORAGE_KEY = 'register_form_v6'

// ===== Paso / UI =====
const steps = [
  { key: 'account',  label: 'Cuenta' },
  { key: 'person',   label: 'Datos personales' },
  { key: 'kind',     label: 'Tipo y procedencia' },
  { key: 'terms',    label: 'Talla y términos' }
]
const step = ref(0)
const showPass = ref(false)
const showPass2 = ref(false)
const password2 = ref('')
const loading = ref(false)
const accepted = ref(false)
const apiError = ref('')

// ===== Form (alineado a Prisma) =====
const form = ref({
  // requeridos por DB
  email: '',
  password_user: '',
  name_user: '',
  paternal_surname: '',
  maternal_surname: '',
  phone: '',

  // opcionales DB
  emergency_phone: '',
  provenance: '',                 // 'uttecam' | 'otro'
  educational_program: '',
  grade: '',
  group_user: '',
  size_user: '',                  // enum en DB; aquí un string del select
  kit_id: null,                   // BigInt? → usar number o null
  workshop_id: null,              // BigInt? → usar number o null
  type_user_id: '',               // BigInt? → en el template usa v-model.number
  status: 'inactive',             // default en DB; puedes no enviarlo si prefieres
  matricula: '',                  // VarChar(8)
})

// ===== Password strength =====
const reqs = ref({ len:false, upper:false, lower:false, num:false, sym:false })
const pwdMatch = computed(() => password2.value === form.value.password_user && password2.value.length>0)
const strengthScore = computed(() => Object.values(reqs.value).filter(Boolean).length)
const strengthPercent = computed(() => `${(strengthScore.value/5)*100}%`)
const strengthLabel = computed(() => {
  const s = strengthScore.value
  if (s <= 1) return 'Muy débil'
  if (s === 2) return 'Débil'
  if (s === 3) return 'Media'
  if (s === 4) return 'Fuerte'
  return 'Excelente'
})
function touchPwd(){
  const p = form.value.password_user || ''
  reqs.value.len   = p.length >= 8
  reqs.value.upper = /[A-Z]/.test(p)
  reqs.value.lower = /[a-z]/.test(p)
  reqs.value.num   = /\d/.test(p)
  reqs.value.sym   = /[^\w\s]/.test(p)
}
watch(() => form.value.password_user, touchPwd)

// ===== Reglas condicionales =====
const isSpeakerLike = computed(() => form.value.type_user_id === 4 || form.value.type_user_id === 5)

// Validación por paso (alineada con campos requeridos del esquema)
const canProceed = computed(() => {
  if (step.value === 0) {
    // Requisitos fuertes en paso 0 (puedes relajar si prefieres)
    const allReqs = Object.values(reqs.value).every(Boolean)
    return !!form.value.email && !!form.value.password_user && allReqs && pwdMatch.value
  }
  if (step.value === 1) {
    // Requeridos en DB
    return !!form.value.name_user &&
           !!form.value.paternal_surname &&
           !!form.value.maternal_surname &&
           !!form.value.phone
  }
  if (step.value === 2) {
    // type_user_id es opcional en DB, pero lo pedimos para lógica del front
    if (!form.value.type_user_id) return false
    if (!form.value.provenance) return false

    // Condiciones UTTECAM
    if (form.value.provenance === 'uttecam') {
      if (form.value.type_user_id === 2) { // Docente
        return !!form.value.educational_program && !!form.value.matricula
      }
      if (form.value.type_user_id === 1) { // Estudiante
        const okGrade = !form.value.grade || String(form.value.grade).length <= 2
        const okGroup = !form.value.group_user || String(form.value.group_user).length <= 1
        const okMat   = !!form.value.matricula && String(form.value.matricula).length <= 8
        return !!form.value.educational_program && okGrade && okGroup && okMat
      }
    }
    
    // Para externos
    if (form.value.provenance === 'otro' && (form.value.type_user_id === 1 || form.value.type_user_id === 2 || form.value.type_user_id === 3)) {
      return !!form.value.provenance && form.value.provenance !== 'uttecam' && form.value.provenance !== 'otro'
    }
    
    // Otros casos
    return true
  }
  return true
})

// Envío: necesitamos talla y aceptación
const canSubmit = computed(() => !!form.value.size_user && accepted.value)

// ===== UX de por qué no avanza (opcional, útil para depurar) =====
const reasons = computed(() => {
  const r = []
  if (step.value === 0) {
    if (!form.value.email) r.push('Falta email')
    if (!form.value.password_user) r.push('Falta contraseña')
    if (!reqs.value.len)   r.push('La contraseña debe tener mínimo 8 caracteres')
    if (!reqs.value.upper) r.push('Falta una mayúscula (A–Z)')
    if (!reqs.value.lower) r.push('Falta una minúscula (a–z)')
    if (!reqs.value.num)   r.push('Falta un número (0–9)')
    if (!reqs.value.sym)   r.push('Falta un símbolo (!@#$%...)')
    if (!pwdMatch.value)   r.push('La confirmación no coincide')
  }
  if (step.value === 1) {
    if (!form.value.name_user) r.push('Falta nombre')
    if (!form.value.paternal_surname) r.push('Falta apellido paterno')
    if (!form.value.maternal_surname) r.push('Falta apellido materno')
    if (!form.value.phone) r.push('Falta teléfono')
  }
  if (step.value === 2) {
    if (!form.value.type_user_id) r.push('Selecciona tipo de usuario')
    if (!form.value.provenance) r.push('Selecciona procedencia')
    
    if (form.value.provenance === 'uttecam') {
      if (form.value.type_user_id === 2) {
        if (!form.value.educational_program) r.push('Falta programa educativo (Docente)')
        if (!form.value.matricula) r.push('Falta matrícula (Docente)')
      }
      if (form.value.type_user_id === 1) {
        if (!form.value.educational_program) r.push('Falta programa educativo (Estudiante)')
        if (!form.value.matricula) r.push('Falta matrícula (Estudiante, máx 8)')
        if (!form.value.grade) r.push('Falta grado (Estudiante, máx 2)')
        if (!form.value.group_user) r.push('Falta grupo (Estudiante, máx 1)')
      }
    }
    
    if (form.value.provenance === 'otro' && (form.value.type_user_id === 1 || form.value.type_user_id === 2 || form.value.type_user_id === 3)) {
      if (!form.value.provenance || form.value.provenance === 'uttecam' || form.value.provenance === 'otro') {
        r.push('Falta nombre de la institución')
      }
    }
  }
  if (step.value === 3) {
    if (!form.value.size_user) r.push('Selecciona tu talla')
    if (!accepted.value) r.push('Debes aceptar los términos')
  }
  return r
})

// ===== Navegación =====
function prevStep(){ if (step.value > 0) step.value-- }

function nextOrSubmit(){
  apiError.value = ''
  if (step.value < steps.length - 1) {
    if (!canProceed.value) { 
      alert('Revisa los campos requeridos del paso actual: ' + reasons.value.join(', '))
      return 
    }
    step.value++
    return
  }
  submitRegister()
}

// ===== Persistencia local =====
onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      Object.assign(form.value, saved.form || {})
      step.value = saved.step ?? 0
      accepted.value = !!saved.accepted
      password2.value = saved.password2 || ''
    }
  } catch {}
  touchPwd()
})

watch([form, step, accepted, password2], () => {
  const data = {
    form: form.value,
    step: step.value,
    accepted: accepted.value,
    password2: password2.value
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}, { deep: true })

// ===== Helpers =====
function normalizePhones(payload){
  const norm = (v) => {
    if (!v) return v
    if (v.startsWith('+52')) return v
    const clean = v.replace(/\D/g, '')
    return clean.length === 10 ? `+52${clean}` : v
  }
  payload.phone = norm(payload.phone)
  payload.emergency_phone = norm(payload.emergency_phone)
}

// ===== Submit (payload = exactamente campos del modelo) =====
async function submitRegister(){
  if (!canSubmit.value) { 
    alert('Revisa los campos requeridos: ' + reasons.value.join(', '))
    return 
  }
  loading.value = true
  apiError.value = ''
  try {
    const payload = {
      // requeridos
      email: form.value.email,
      password_user: form.value.password_user,
      name_user: form.value.name_user,
      paternal_surname: form.value.paternal_surname,
      maternal_surname: form.value.maternal_surname,
      phone: form.value.phone,

      // opcionales
      emergency_phone: form.value.emergency_phone || null,
      provenance: form.value.provenance === 'otro' ? 'Otro' : form.value.provenance,
      educational_program: form.value.educational_program || null,
      grade: form.value.grade || null,                 // Char(2)
      group_user: form.value.group_user || null,       // Char(1)
      size_user: form.value.size_user || null,         // enum
      kit_id: form.value.kit_id ? Number(form.value.kit_id) : null,
      workshop_id: form.value.workshop_id ? Number(form.value.workshop_id) : null,
      type_user_id: form.value.type_user_id ? Number(form.value.type_user_id) : null, // BigInt?
      status: form.value.status || 'inactive',
      matricula: form.value.matricula || null          // VarChar(8)
    }

    // Normaliza teléfonos a +52
    normalizePhones(payload)

    // Límites por longitud (defensivo, por si el usuario se pasa)
    if (payload.matricula && String(payload.matricula).length > 8) {
      payload.matricula = String(payload.matricula).slice(0, 8)
    }
    if (payload.grade && String(payload.grade).length > 2) {
      payload.grade = String(payload.grade).slice(0, 2)
    }
    if (payload.group_user && String(payload.group_user).length > 1) {
      payload.group_user = String(payload.group_user)[0]
    }

    // POST
    const { data } = await api.post(ROUTES.AUTH.REGISTER, payload)

    if (data?.verification_token) {
      localStorage.setItem('verification_token', data.verification_token)
    }
    // 👇 Guardar email en localStorage para la verificación
    localStorage.setItem('verify_email', payload.email)

    // Limpiar form
    localStorage.removeItem(STORAGE_KEY)

    alert('Cuenta creada. Revisa tu correo para verificar.')
    // 👇 Redirigir a la página de verificación
    window.location.href = '/verify'

    // Redirigir a la página de verificación o login
  } catch (e) {
    console.error(e)
    apiError.value = parseAxiosError(e)
  } finally {
    loading.value = false
  }
}
</script>