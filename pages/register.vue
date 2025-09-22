<!-- filepath: c:\xampp\htdocs\nuxt-3er-congreso\pages\register.vue -->
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

      <section class="cardRegister" aria-label="Registration form">
        <h2 class="card-title card-title--center">
          <span class="arrow" aria-hidden="true">
            <SvgIcon :path="mdiAccountPlusOutline" type="mdi" />
          </span>
          <span class="card-title__text">Crear cuenta</span>
        </h2>

        <!-- Se eliminó el antiguo apiError porque se usan notificaciones -->

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
          <!-- Paso 0: Cuenta -->
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

          <!-- Paso 1: Datos personales -->
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

          <!-- Paso 2: Tipo y procedencia -->
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

          <!-- Paso 3: Talla y términos -->
          <template v-else-if="step === 3">
            <div class="grid resp">
              <div class="stack">
                <label class="label" for="size_user">Talla de playera</label>
                <select id="size_user" v-model="form.size_user" class="input" required>
                  <option value="" disabled>Selecciona tu talla</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>XXL</option>
                </select>
              </div>
            </div>

            <div class="checkline">
              <input id="terms" v-model="accepted" type="checkbox" required />
              <label for="terms">Acepto los términos y aviso de privacidad</label>
            </div>
          </template>

          <div class="nav">
            <button v-if="step > 0" type="button" class="btn ghost" @click="prevStep">Atrás</button>
            <button v-if="step < steps.length - 1" type="submit" class="btn" :disabled="!canProceed">
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
  mdiAccountPlusOutline, mdiEmailOutline, mdiLockOutline,
  mdiEyeOutline, mdiEyeOffOutline, mdiLockCheckOutline
} from '@mdi/js'

import api from '~/plugins/http/api'
import { ROUTES } from '~/plugins/http/routes'
import { parseAxiosError } from '~/plugins/http/error'

// 🚀 Importamos helpers de notificaciones
import {
  notifySuccess,
  notifyError,
  notifyWarning,
  notifyLoading
} from '~/utils/notifications'

import '@/assets/css/styles/Register.css'

const STORAGE_KEY = 'register_form_v6'

// Paso actual del registro
const steps = [
  { key: 'account', label: 'Cuenta' },
  { key: 'person', label: 'Datos personales' },
  { key: 'kind', label: 'Tipo y procedencia' },
  { key: 'terms', label: 'Talla y términos' }
]
const step = ref(0)

// Estados
const showPass = ref(false)
const showPass2 = ref(false)
const password2 = ref('')
const loading = ref(false)
const accepted = ref(false)
const form = ref({
  email: '',
  password_user: '',
  name_user: '',
  paternal_surname: '',
  maternal_surname: '',
  phone: '',
  emergency_phone: '',
  provenance: '',
  educational_program: '',
  grade: '',
  group_user: '',
  size_user: '',
  kit_id: null,
  workshop_id: null,
  type_user_id: '',
  status: 'inactive',
  matricula: ''
})

// Validación de contraseña
const reqs = ref({ len: false, upper: false, lower: false, num: false, sym: false })
const pwdMatch = computed(() => password2.value === form.value.password_user && password2.value.length > 0)
const strengthScore = computed(() => Object.values(reqs.value).filter(Boolean).length)
const strengthPercent = computed(() => `${(strengthScore.value / 5) * 100}%`)
const strengthLabel = computed(() => ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Excelente'][strengthScore.value - 1] || 'Muy débil')
watch(() => form.value.password_user, () => {
  const p = form.value.password_user || ''
  reqs.value = {
    len: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    num: /\d/.test(p),
    sym: /[^\w\s]/.test(p),
  }
})

// Validaciones por paso
const canProceed = computed(() => {
  if (step.value === 0) {
    return !!form.value.email && !!form.value.password_user &&
           Object.values(reqs.value).every(Boolean) && pwdMatch.value
  }
  if (step.value === 1) {
    return !!form.value.name_user && !!form.value.paternal_surname && !!form.value.maternal_surname && !!form.value.phone
  }
  if (step.value === 2) {
    if (!form.value.type_user_id || !form.value.provenance) return false
    if (form.value.provenance === 'uttecam') {
      if (form.value.type_user_id === 2) return !!form.value.educational_program && !!form.value.matricula
      if (form.value.type_user_id === 1) {
        return !!form.value.educational_program && !!form.value.matricula && !!form.value.grade && !!form.value.group_user
      }
    }
    if (form.value.provenance === 'otro') {
      return !!form.value.provenance && !['uttecam', 'otro'].includes(form.value.provenance)
    }
  }
  return true
})

const canSubmit = computed(() => !!form.value.size_user && accepted.value)

// Navegación
function prevStep() {
  if (step.value > 0) step.value--
}
function nextOrSubmit() {
  if (step.value < steps.length - 1) {
    if (!canProceed.value) {
      notifyWarning('Campos incompletos', 'Revisa los campos requeridos antes de continuar')
      return
    }
    step.value++
  } else {
    submitRegister()
  }
}

// Guardado en localStorage
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    Object.assign(form.value, saved.form || {})
    step.value = saved.step ?? 0
    accepted.value = !!saved.accepted
    password2.value = saved.password2 || ''
  } catch {}
})
watch([form, step, accepted, password2], () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    form: form.value,
    step: step.value,
    accepted: accepted.value,
    password2: password2.value,
  }))
}, { deep: true })

// Normalización de teléfonos
function normalizePhones(payload) {
  const clean = (v) => {
    const val = v?.replace(/\D/g, '')
    return val?.length === 10 ? `+52${val}` : v
  }
  payload.phone = clean(payload.phone)
  payload.emergency_phone = clean(payload.emergency_phone)
}

// Envío del formulario con manejo de notificaciones
async function submitRegister() {
  if (!canSubmit.value) {
    notifyWarning('Formulario incompleto', 'Debes aceptar los términos y elegir tu talla')
    return
  }

  loading.value = true

  // Notificación de carga
  const loadingToast = notifyLoading('Procesando', 'Creando tu cuenta...')

  try {
    const payload = {
      ...form.value,
      provenance: form.value.provenance === 'otro' ? 'Otro' : form.value.provenance,
      kit_id: form.value.kit_id ? Number(form.value.kit_id) : null,
      workshop_id: form.value.workshop_id ? Number(form.value.workshop_id) : null,
      type_user_id: form.value.type_user_id ? Number(form.value.type_user_id) : null,
      grade: form.value.grade?.toString().slice(0, 2),
      group_user: form.value.group_user?.toString().slice(0, 1),
      matricula: form.value.matricula?.toString().slice(0, 8),
    }

    normalizePhones(payload)

    const { data } = await api.post(ROUTES.AUTH.REGISTER, payload, { withCredentials: true })

    if (data?.verification_token) {
      localStorage.setItem('verification_token', data.verification_token)
    }
    localStorage.setItem('verify_email', payload.email)
    localStorage.removeItem(STORAGE_KEY)

    loadingToast.resolve('Cuenta creada con éxito 🎉')
    notifySuccess('Registro exitoso', 'Revisa tu correo para verificar tu cuenta')

    window.location.href = '/verify'

  } catch (err) {
    console.error(err)
    const msg = err.response?.data?.message
    if (Array.isArray(msg)) {
      msg.forEach((m) => notifyError('Error de validación', m))
    } else {
      notifyError('Error en registro', parseAxiosError(err) || 'Error desconocido')
    }
    loadingToast.reject('Error en la creación de cuenta')
  } finally {
    loading.value = false
  }
}
</script>
