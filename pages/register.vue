<template>
  <main id="register" class="auth-screen" role="main">
    <!-- Fondo decorativo -->
    <div class="auth-bg" aria-hidden="true">
      <span class="blob blob--tl"></span>
      <span class="blob blob--br"></span>
      <span class="ring ring--1"></span>
      <span class="ring ring--2"></span>
      <span class="shape shape--sq"></span>
      <span class="shape shape--dot"></span>
    </div>

    <div class="auth-container">
      <!-- Columna izquierda -->
      <header class="auth-hero" aria-label="Identidad del evento">
        <h1 class="hero-title">
          <span class="kicker">3er</span>
          <span class="line1">Congreso</span>
          <span class="line2">Internacional</span>
        </h1>
      </header>

      <!-- Card registro -->
      <section class="card" aria-label="Formulario de registro">
        <h2 class="card-title card-title--center">
          <span class="arrow" aria-hidden="true">
            <SvgIcon :path="mdiAccountPlusOutline" type="mdi" />
          </span>
          <span class="card-title__text">Crear cuenta</span>
        </h2>

        <!-- Mensaje de error global -->
        <p v-if="apiError" class="alert alert--error" role="alert">
          {{ apiError }}
        </p>

        <!-- Stepper (línea del tiempo) -->
        <ol class="stepper stepper--timeline" aria-label="Progreso de registro">
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

        <!-- Formulario -->
        <form class="form" @submit.prevent="nextOrSubmit" novalidate>
          <!-- PASO 0: Cuenta -->
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
                <label class="label" for="password">Contraseña</label>
                <div class="input-wrap">
                  <span class="input-icon"><SvgIcon :path="mdiLockOutline" type="mdi" /></span>
                  <input
                    id="password"
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

                <!-- Medidor de seguridad -->
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

          <!-- PASO 1: Datos personales -->
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

          <!-- PASO 2: Tipo y procedencia -->
          <template v-else-if="step === 2">
            <div class="grid resp">
              <div class="stack">
                <label class="label" for="type_user_id">Tipo de usuario</label>
                <!-- 👇 ahora es número -->
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

            <!-- Código de invitación -->
            <div v-if="isSpeakerLike" class="stack">
              <label class="label" for="invite_code">Código de invitación</label>
              <input
                id="invite_code"
                v-model.trim="form.invite_code"
                type="text"
                required
                class="input"
                placeholder="Ej. TG-2025-ABC123"
              />
              <small class="help">Solicítalo al comité organizador.</small>
            </div>

            <!-- Docente UTTECAM -->
            <div v-if="form.provenance==='uttecam' && form.type_user_id === 2" class="grid resp">
              <div class="stack">
                <label class="label" for="educational_program_doc">Programa educativo</label>
                <select
                  id="educational_program_doc"
                  v-model="form.educational_program"
                  class="input"
                  required
                >
                  <option disabled value="">Selecciona programa (1–9)</option>
                  <option v-for="n in 9" :key="'pd'+n" :value="`Programa ${n}`">Programa {{ n }}</option>
                </select>
              </div>
              <div class="stack">
                <label class="label" for="matricula_doc">Matrícula</label>
                <input
                  id="matricula_doc"
                  v-model.trim="form.matricula"
                  type="text"
                  class="input"
                  required
                  placeholder="Tu matrícula"
                />
              </div>
            </div>

            <!-- Estudiante UTTECAM -->
            <div v-if="form.provenance==='uttecam' && form.type_user_id === 1" class="grid resp">
              <div class="stack">
                <label class="label" for="matricula_est">Matrícula</label>
                <input
                  id="matricula_est"
                  v-model.trim="form.matricula"
                  type="text"
                  class="input"
                  required
                  placeholder="Tu matrícula"
                />
              </div>
              <div class="stack">
                <label class="label" for="educational_program_est">Programa educativo</label>
                <select
                  id="educational_program_est"
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

            <!-- Externo / Otro -->
            <div
              v-if="form.provenance==='otro' && (form.type_user_id===1 || form.type_user_id===2 || form.type_user_id===3)"
              class="grid resp"
            >
              <div class="stack col-span-2">
                <label class="label" for="company_university">Empresa o Universidad</label>
                <input
                  id="company_university"
                  v-model.trim="form.company_university"
                  type="text"
                  class="input"
                  placeholder="Nombre de la institución"
                />
              </div>
            </div>
          </template>

          <!-- PASO 3: Talla + Términos -->
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

          <!-- Navegación -->
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

// 👇 Axios + rutas + parser de errores (simple y centralizado)
import api from '~/utils/http/api'
import { ROUTES } from '~/utils/http/routes'
import { parseAxiosError } from '~/utils/http/error'

const STORAGE_KEY = 'register_form_v5'

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
const apiError = ref('') // mensajes legibles para el usuario

const form = ref({
  // cuenta
  email: '',
  password_user: '',
  // personales
  name_user: '',
  paternal_surname: '',
  maternal_surname: '',
  phone: '',
  emergency_phone: '',
  // tipo + procedencia
  type_user_id: '',          // 👈 se volverá number con v-model.number
  invite_code: '',
  provenance: '',            // 'uttecam' | 'otro'
  educational_program: '',
  grade: '',
  group_user: '',
  matricula: '',
  company_university: '',
  // talla
  size_user: '',
  // backend-only (no visibles)
  kit_id: null,
  workshop_id: null
})

/* ======= Password strength ======= */
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

const isSpeakerLike = computed(() => form.value.type_user_id === 4 || form.value.type_user_id === 5)

function prevStep(){ if(step.value>0) step.value-- }

const canProceed = computed(() => {
  if(step.value === 0){
    const allReqs = Object.values(reqs.value).every(Boolean)
    return !!form.value.email && !!form.value.password_user && allReqs && pwdMatch.value
  }
  if(step.value === 1){
    return !!form.value.name_user && !!form.value.paternal_surname &&
           !!form.value.maternal_surname && !!form.value.phone
  }
  if(step.value === 2){
    if(!form.value.type_user_id) return false
    if(isSpeakerLike.value && !form.value.invite_code) return false
    if(!form.value.provenance) return false

    if(form.value.provenance === 'uttecam'){
      if(form.value.type_user_id === 2){
        return !!form.value.educational_program && !!form.value.matricula
      }
      if(form.value.type_user_id === 1){
        return !!form.value.matricula && !!form.value.educational_program &&
               !!form.value.grade && !!form.value.group_user
      }
    }
    return true
  }
  return true
})

const canSubmit = computed(() => !!form.value.size_user && accepted.value)

function nextOrSubmit(){
  apiError.value = ''
  if(step.value < steps.length-1){
    if(!canProceed.value) { touchAlert(); return }
    step.value++
    return
  }
  submitRegister()
}

function touchAlert(){
  alert('Revisa los campos requeridos del paso actual.')
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw){
      const saved = JSON.parse(raw)
      Object.assign(form.value, saved.form || {})
      step.value = saved.step ?? 0
      accepted.value = !!saved.accepted
      password2.value = saved.password2 || ''
      touchPwd()
    }
  } catch (e) {}
})

// Persistencia
watch([form, step, accepted, password2], () => {
  const data = {
    form: form.value,
    step: step.value,
    accepted: accepted.value,
    password2: password2.value
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}, { deep: true })

// Normalización de teléfonos a +52XXXXXXXXXX
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

async function submitRegister(){
  if(!canSubmit.value){ touchAlert(); return }
  loading.value = true
  apiError.value = ''
  try {
    // payload final (ya tenemos type_user_id como number por v-model.number)
    const payload = {
      email: form.value.email,
      password_user: form.value.password_user,
      name_user: form.value.name_user || null,
      paternal_surname: form.value.paternal_surname,
      maternal_surname: form.value.maternal_surname,
      phone: form.value.phone,
      emergency_phone: form.value.emergency_phone || null,
      provenance: form.value.provenance || null,
      educational_program: form.value.educational_program || null,
      grade: form.value.grade || null,
      group_user: form.value.group_user || null,
      size_user: form.value.size_user,
      kit_id: null,
      workshop_id: null,
      type_user_id: form.value.type_user_id || null,
      status: 'inactive',
      matricula: form.value.matricula || null,
      company_university: form.value.company_university || null,
      invite_code: form.value.invite_code || null,
    }

    normalizePhones(payload)

    // 👇 usar ruta centralizada
    const { data } = await api.post(ROUTES.AUTH.REGISTER, payload)

    if (data?.verification_token) {
      localStorage.setItem('verification_token', data.verification_token)
    }
    localStorage.removeItem(STORAGE_KEY)

    alert('Cuenta creada. Revisa tu correo para verificar.')
  } catch (e){
    console.error(e)
    apiError.value = parseAxiosError(e)
  } finally {
    loading.value = false
  }
}
</script>
