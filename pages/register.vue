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

      <button type="button" class="btn-back" @click="goLogin" aria-label="Regresar">
        <SvgIcon :path="mdiArrowLeft" type="mdi" />
      </button>

      <section class="cardRegister" aria-label="Registration form">
        <h2 class="card-title card-title--center">
          <span class="arrow" aria-hidden="true">
            <SvgIcon :path="mdiAccountPlusOutline" type="mdi" />
          </span>
          <span class="card-title__text">Crear cuenta</span>
        </h2>

        <ol class="stepper stepper--timeline" aria-label="Registration progress">
          <li v-for="(s, i) in steps" :key="s.key" class="step" :class="{ active: i === step, done: i < step }">
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
                <input id="email" v-model.trim="form.email" type="email" required
                       autocomplete="email" placeholder="tu@email.com" class="input" />
              </div>
            </div>

            <div class="grid resp">
              <div class="stack">
                <label class="label" for="password_user">Contraseña</label>
                <div class="input-wrap">
                  <span class="input-icon"><SvgIcon :path="mdiLockOutline" type="mdi" /></span>
                  <input id="password_user" :type="showPass ? 'text' : 'password'"
                         v-model.trim="form.password_user" required minlength="8"
                         autocomplete="new-password" placeholder="••••••••"
                         class="input input--pass" @input="touchPwd()" />
                  <button type="button" class="eye"
                          :aria-pressed="showPass ? 'true' : 'false'"
                          :title="showPass ? 'Ocultar' : 'Mostrar'"
                          @click="showPass = !showPass">
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
                  <input id="password2" :type="showPass2 ? 'text' : 'password'"
                         v-model.trim="password2" required minlength="8"
                         autocomplete="new-password" placeholder="••••••••"
                         class="input input--pass" />
                  <button type="button" class="eye"
                          :aria-pressed="showPass2 ? 'true' : 'false'"
                          :title="showPass2 ? 'Ocultar' : 'Mostrar'"
                          @click="showPass2 = !showPass2">
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
                <input id="name_user" v-model.trim="form.name_user" type="text" required
                       autocomplete="given-name" class="input" placeholder="Tu nombre" />
              </div>
              <div class="stack">
                <label class="label" for="paternal_surname">Apellido paterno</label>
                <input id="paternal_surname" v-model.trim="form.paternal_surname" type="text" required
                       autocomplete="family-name" class="input" placeholder="Paterno" />
              </div>
              <div class="stack">
                <label class="label" for="maternal_surname">Apellido materno</label>
                <input id="maternal_surname" v-model.trim="form.maternal_surname" type="text" required
                       class="input" placeholder="Materno" />
              </div>
            </div>

            <div class="stack">
              <label class="label" for="phone">Teléfono</label>
              <div class="input-wrap input-wrap--phone">
                <div class="custom-select" @click="toggleDropdown('main')">
                  <div class="selected-option">
                    <div class="flag-wrap">
                      <flag-icon :country="selectedCountryCode"></flag-icon>
                    </div>
                    <span class="country-code">
                      {{ getPhoneCode(selectedCountryCode) }}
                    </span>
                  </div>
                  <ul v-if="isOpen.main" class="options-list">
                    <li v-for="country in countries" :key="country.code" @click.stop="selectCountry(country, 'main')">
                      <div class="flag-wrap">
                        <flag-icon :country="country.code"></flag-icon>
                      </div>
                      <span class="country-name">{{ country.name }}</span>
                      <span class="country-code">{{ country.phoneCode }}</span>
                    </li>
                  </ul>
                </div>
                <input id="phone" v-model.trim="form.phone" type="tel" required
                       autocomplete="tel-national" class="input" placeholder="55 1234 5678" />
              </div>
            </div>

            <div class="stack">
              <label class="label" for="emergency_phone">Teléfono de emergencia</label>
              <div class="input-wrap input-wrap--phone">
                <div class="custom-select" @click="toggleDropdown('emergency')">
                  <div class="selected-option">
                    <div class="flag-wrap">
                      <flag-icon :country="emergencyCountryCode"></flag-icon>
                    </div>
                    <span class="country-code">
                      {{ getPhoneCode(emergencyCountryCode) }}
                    </span>
                  </div>
                  <ul v-if="isOpen.emergency" class="options-list">
                    <li v-for="country in countries" :key="country.code" @click.stop="selectCountry(country, 'emergency')">
                      <div class="flag-wrap">
                        <flag-icon :country="country.code"></flag-icon>
                      </div>
                      <span class="country-name">{{ country.name }}</span>
                      <span class="country-code">{{ country.phoneCode }}</span>
                    </li>
                  </ul>
                </div>
                <input id="emergency_phone" v-model.trim="form.emergency_phone" type="tel" class="input"
                       placeholder="Teléfono de contacto (opcional)" />
              </div>
            </div>
          </template>

          <template v-else-if="step === 2">
            <div class="stack">
              <label class="label" for="type_user_id">Tipo de usuario</label>
              <select id="type_user_id" v-model.number="form.type_user_id" class="input" required>
                <option disabled value="">Selecciona una opción</option>
                <option :value="1">Estudiante</option>
                <option :value="2">Maestro</option>
                <option :value="3">Externo</option>
                <option :value="4">Ponente/Tallerista</option>
              </select>
            </div>

            <template v-if="form.type_user_id === 4">
              <div class="stack">
                <label class="label" for="secret_password">Contraseña Secreta</label>
                <input id="secret_password" v-model.trim="form.secret_password" type="password" required
                       class="input" placeholder="Ingresa la contraseña para continuar" />
                <small class="help">Esta contraseña es proporcionada por los organizadores del evento.</small>
              </div>
            </template>
            
            <template v-if="[1, 2].includes(form.type_user_id)">
              <div class="stack">
                <label class="label" for="provenance">Procedencia</label>
                <select id="provenance" v-model="form.provenance" class="input" required>
                  <option disabled value="">Selecciona tu procedencia</option>
                  <option value="uttecam">UTTECAM</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <template v-if="form.provenance === 'uttecam'">
                <div class="grid resp">
                  <div class="stack">
                    <label class="label" for="matricula">Matrícula</label>
                    <input id="matricula" v-model.trim="form.matricula" type="text" required
                           class="input" placeholder="Tu matrícula" />
                  </div>
                  <div class="stack">
                    <label class="label" for="programa_educativo">Programa Educativo</label>
                    <select id="programa_educativo" v-model.trim="form.programa_educativo" class="input" required>
                      <option disabled value="">Selecciona tu programa</option>
                      <option value="TI">Tecnologías de la Información</option>
                      <option value="MCC">Mecatrónica</option>
                      <option value="AAK">Administración</option>
                    </select>
                  </div>
                </div>

                <div class="grid resp" v-if="form.type_user_id === 1">
                  <div class="stack">
                    <label class="label" for="grado">Grado</label>
                    <input id="grado" v-model.trim="form.grado" type="text" required
                           class="input" placeholder="Ej. 7" />
                  </div>
                  <div class="stack">
                    <label class="label" for="grupo">Grupo</label>
                    <input id="grupo" v-model.trim="form.grupo" type="text" required
                           class="input" placeholder="Ej. C" />
                  </div>
                </div>
              </template>

              <template v-if="form.provenance === 'otra'">
                <div class="stack">
                  <label class="label" for="universidad_procedencia">Universidad de procedencia</label>
                  <input id="universidad_procedencia" v-model.trim="form.universidad_procedencia" type="text" required
                         class="input" placeholder="Nombre de tu universidad" />
                </div>
              </template>
            </template>
          </template>

          <template v-else-if="step === 3">
            <template v-if="isSpeaker">
              <div class="grid resp">
                <div class="stack">
                  <label class="label" for="empresa_procedencia">Empresa/Institución de procedencia</label>
                  <input id="empresa_procedencia" v-model.trim="form.empresa_procedencia" type="text" required
                         class="input" placeholder="Nombre de tu empresa u organización" />
                </div>
                <div class="stack">
                  <label class="label" for="rol_dentro_empresa">Rol/Cargo</label>
                  <input id="rol_dentro_empresa" v-model.trim="form.rol_dentro_empresa" type="text" required
                         class="input" placeholder="Tu cargo o rol actual" />
                </div>
              </div>

              <div class="stack">
                <label class="label" for="descripcion_biografia">Biografía profesional</label>
                <textarea id="descripcion_biografia" v-model.trim="form.descripcion_biografia" rows="4"
                          maxlength="180" required class="input"
                          placeholder="Describe tu experiencia profesional y perfil (máx. 180 caracteres)"></textarea>
                <small class="help">{{ form.descripcion_biografia.length }} / 180 caracteres</small>
              </div>

              <div class="stack">
                <label class="label" for="tipo_presentacion">Tipo de participación</label>
                <select id="tipo_presentacion" v-model="form.tipo_presentacion" class="input" required>
                  <option disabled value="">Selecciona el tipo de presentación</option>
                  <option value="conferencia">Conferencia</option>
                  <option value="taller">Taller</option>
                  <option value="ambas">Ambas</option>
                </select>
              </div>

              <template v-if="form.tipo_presentacion === 'conferencia' || form.tipo_presentacion === 'ambas'">
                <div class="stack">
                  <label class="label" for="titulo_conferencia">Título de la Conferencia</label>
                  <input id="titulo_conferencia" v-model.trim="form.titulo_conferencia" type="text" required
                         class="input" placeholder="Título de tu conferencia" />
                </div>
                <div class="stack">
                  <label class="label" for="descripcion_conferencia">Descripción de la Conferencia</label>
                  <textarea id="descripcion_conferencia" v-model.trim="form.descripcion_conferencia" rows="4"
                            maxlength="180" required class="input"
                            placeholder="Describe el contenido y objetivos de tu conferencia (máx. 180 caracteres)"></textarea>
                  <small class="help">{{ form.descripcion_conferencia.length }} / 180 caracteres</small>
                </div>
              </template>

              <template v-if="form.tipo_presentacion === 'taller' || form.tipo_presentacion === 'ambas'">
                <div class="stack">
                  <label class="label" for="titulo_taller">Título del Taller</label>
                  <input id="titulo_taller" v-model.trim="form.titulo_taller" type="text" required
                         class="input" placeholder="Título de tu taller" />
                </div>
                <div class="stack">
                  <label class="label" for="descripcion_taller">Descripción del Taller</label>
                  <textarea id="descripcion_taller" v-model.trim="form.descripcion_taller" rows="4"
                            maxlength="180" required class="input"
                            placeholder="Describe el contenido y objetivos de tu taller (máx. 180 caracteres)"></textarea>
                  <small class="help">{{ form.descripcion_taller.length }} / 180 caracteres</small>
                </div>
              </template>
            </template>
            <template v-else>
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

              <div class="checkline">
                <input id="terms" v-model="accepted" type="checkbox" required />
                <label for="terms">Acepto los <a href="#" @click.prevent="showTermsModal = true">términos y aviso de privacidad</a></label>
              </div>
            </template>
          </template>

          <template v-else-if="step === 4 && isSpeaker">
            <div class="stack">
              <label class="label" for="facebook_link">Facebook</label>
              <div class="input-wrap">
                <span class="input-icon"><SvgIcon :path="mdiFacebook" type="mdi" /></span>
                <input id="facebook_link" v-model.trim="form.facebook_link" type="url" class="input" placeholder="Link a tu perfil de Facebook (opcional)" />
              </div>
            </div>
            <div class="stack">
              <label class="label" for="instagram_link">Instagram</label>
              <div class="input-wrap">
                <span class="input-icon"><SvgIcon :path="mdiInstagram" type="mdi" /></span>
                <input id="instagram_link" v-model.trim="form.instagram_link" type="url" class="input" placeholder="Link a tu perfil de Instagram (opcional)" />
              </div>
            </div>
            <div class="stack">
              <label class="label" for="x_link">X (Twitter)</label>
              <div class="input-wrap">
                <span class="input-icon"><SvgIcon :path="mdiTwitter" type="mdi" /></span>
                <input id="x_link" v-model.trim="form.x_link" type="url" class="input" placeholder="Link a tu perfil de X (opcional)" />
              </div>
            </div>
            <div class="stack">
              <label class="label" for="linkedin_link">LinkedIn</label>
              <div class="input-wrap">
                <span class="input-icon"><SvgIcon :path="mdiLinkedin" type="mdi" /></span>
                <input id="linkedin_link" v-model.trim="form.linkedin_link" type="url" class="input" placeholder="Link a tu perfil de LinkedIn (opcional)" />
              </div>
            </div>
          </template>

          <template v-else-if="step === 5 && isSpeaker">
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

            <div class="checkline">
              <input id="terms" v-model="accepted" type="checkbox" required />
              <label for="terms">Acepto los <a href="#" @click.prevent="showTermsModal = true">términos y aviso de privacidad</a></label>
            </div>
          </template>

          <div class="nav">
            <button v-if="step > 0" type="button" class="btn ghost" @click="prevStep">
              Atrás
            </button>
            <button v-if="isLastStep" type="submit" class="btn" :disabled="loading || !canSubmit">
              {{ loading ? "Creando cuenta…" : "Crear cuenta" }}
            </button>
            <button v-else type="submit" class="btn" :disabled="!canProceed">
              Continuar
            </button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="showTermsModal" class="modal-overlay" @click.self="showTermsModal = false">
      <div class="modal-content">
        <button class="modal-close" @click="showTermsModal = false">
          <SvgIcon :path="mdiClose" type="mdi" />
        </button>
        <h3 class="modal-title">Términos y Aviso de Privacidad</h3>
        <div class="modal-body">
          <p>
            Al registrarte en el 3er Congreso Internacional, aceptas los siguientes términos y condiciones,
            así como nuestro aviso de privacidad. Tu información personal será utilizada exclusivamente
            para la organización y gestión del evento. Nos comprometemos a proteger tus datos y a no
            compartirlos con terceros sin tu consentimiento explícito. Tienes derecho a acceder, rectificar
            y cancelar tus datos personales, así como a oponerte al tratamiento de los mismos.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import SvgIcon from "@jamescoyle/vue-icon";
import { 
  mdiAccountPlusOutline, 
  mdiEmailOutline, 
  mdiLockOutline, 
  mdiLockCheckOutline, 
  mdiEyeOutline, 
  mdiEyeOffOutline, 
  mdiArrowLeft, 
  mdiClose,
  mdiFacebook,
  mdiInstagram,
  mdiTwitter,
  mdiLinkedin
} from '@mdi/js';
import api from '~/plugins/http/api';
import { ROUTES } from '~/plugins/http/routes';
import { parseAxiosError } from '~/plugins/http/error';
import { notifySuccess, notifyError, notifyWarning, notifyLoading } from '~/utils/notifications';
import '@/assets/css/styles/Register.css'; 

const router = useRouter();
const STORAGE_KEY = "register_form_v7";

// Estados reactivos
const step = ref(0);
const showPass = ref(false);
const showPass2 = ref(false);
const password2 = ref('');
const loading = ref(false);
const accepted = ref(false);
const showTermsModal = ref(false);

// Definición de pasos para cada flujo
const steps = ref([]);
const baseSteps = [
  { key: 'account', label: 'Cuenta' },
  { key: 'personal', label: 'Datos personales' },
  { key: 'user_type', label: 'Tipo de usuario' },
  { key: 'final', label: 'Finalizar' }
];

const speakerSteps = [
  { key: 'account', label: 'Cuenta' },
  { key: 'personal', label: 'Datos personales' },
  { key: 'user_type', label: 'Tipo de usuario' },
  { key: 'speaker_data', label: 'Datos Ponente' },
  { key: 'social_media', label: 'Redes Sociales' },
  { key: 'final', label: 'Finalizar' }
];

// Formulario completo
const form = ref({
  // Datos de cuenta
  email: '',
  password_user: '',
  
  // Datos personales
  name_user: '',
  paternal_surname: '',
  maternal_surname: '',
  phone: '',
  phone_country: '+52',
  emergency_phone: '',
  emergency_phone_country: '+52',
  
  // Tipo de usuario y campos asociados
  type_user_id: null,
  provenance: '',                  // 'uttecam' | 'otra'
  matricula: '',
  educational_program: '', 
  grade: '',   
  group_user: '',
  universidad_procedencia: '',
  
  // Campos para Ponente/Tallerista
  secret_password: '', // He cambiado el nombre de la variable para que coincida con el template
  empresa_procedencia: '',
  rol_dentro_empresa: '',
  descripcion_biografia: '',
  tipo_presentacion: '',
  titulo_conferencia: '',
  descripcion_conferencia: '',
  titulo_taller: '',
  descripcion_taller: '',

  // Redes sociales (nuevo)
  facebook_link: '',
  instagram_link: '',
  x_link: '',
  linkedin_link: '',
  
  // Final
  size_user: ''
});

// Computed properties
const isSpeaker = computed(() => form.value.type_user_id === 4);
const isStudentOrTeacher = computed(() => [1, 2].includes(form.value.type_user_id));
// La contraseña secreta debe ser validada en el backend en un entorno real,
// pero para el ejemplo, la validación se hace en el frontend.
const isSecretPasswordValid = computed(() => form.value.secret_password === 'ponente2024');

// Validación de contraseña
const reqs = ref({ len: false, upper: false, lower: false, num: false, sym: false });
const pwdMatch = computed(() => password2.value === form.value.password_user && password2.value.length > 0);
const strengthScore = computed(() => Object.values(reqs.value).filter(Boolean).length);
const strengthPercent = computed(() => `${(strengthScore.value / 5) * 100}%`);
const strengthLabel = computed(() => 
  ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Excelente'][strengthScore.value] || 'Muy débil'
);

// Watchers
watch(() => form.value.password_user, (newPwd) => {
  const p = newPwd || '';
  reqs.value = {
    len: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    num: /\d/.test(p),
    sym: /[^\w\s]/.test(p),
  };
});

// Watcher para cambiar los pasos al cambiar el tipo de usuario
watch(isSpeaker, (isNowSpeaker) => {
  steps.value = isNowSpeaker ? [...speakerSteps] : [...baseSteps];
  // Resetear campos de ponente si se cambia a otro tipo de usuario
  if (!isNowSpeaker) {
    // Lista de campos específicos de ponente para limpiar
    const ponenteFields = ['secret_password', 'empresa_procedencia', 'rol_dentro_empresa', 'descripcion_biografia', 'tipo_presentacion', 'titulo_conferencia', 'descripcion_conferencia', 'titulo_taller', 'descripcion_taller', 'facebook_link', 'instagram_link', 'x_link', 'linkedin_link'];
    ponenteFields.forEach(field => form.value[field] = '');
  }
});

// Persistencia en localStorage
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (Object.keys(saved).length > 0) {
      Object.assign(form.value, saved.form || {});
      step.value = saved.step ?? 0;
      accepted.value = !!saved.accepted;
      password2.value = saved.password2 || '';

      // MODIFICACIÓN 3: Asegurarse de que los estados reactivos de la bandera se inicialicen
      // a partir del código de país almacenado en `form.phone_country`.
      const mainCountry = countries.value.find(c => c.phoneCode === saved.form?.phone_country);
      if (mainCountry) {
        selectedCountryCode.value = mainCountry.code;
      }
      const emergencyCountry = countries.value.find(c => c.phoneCode === saved.form?.emergency_phone_country);
      if (emergencyCountry) {
        emergencyCountryCode.value = emergencyCountry.code;
      }

      // Asegurarse de que los pasos sean correctos al cargar
      steps.value = isSpeaker.value ? [...speakerSteps] : [...baseSteps];
    }

  } catch (e) {
    console.error("Error al cargar datos del localStorage:", e);
  }

  // Si no hay datos cargados, establecer los valores predeterminados (MODIFICACIÓN 3)
  if (!form.value.phone_country) {
    form.value.phone_country = getPhoneCode(selectedCountryCode.value); // +52
  }
  if (!form.value.emergency_phone_country) {
    form.value.emergency_phone_country = getPhoneCode(emergencyCountryCode.value); // +52
  }
});

watch([form, step, accepted, password2], () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    form: form.value,
    step: step.value,
    accepted: accepted.value,
    password2: password2.value
  }));
}, { deep: true });

// Validación para avanzar
const canProceed = computed(() => {
  switch (step.value) {
    case 0: // Cuenta
      return !!form.value.email && Object.values(reqs.value).every(Boolean) && pwdMatch.value;

    case 1: // Datos personales
      return !!form.value.name_user && !!form.value.paternal_surname && !!form.value.maternal_surname && !!form.value.phone;

    case 2: { // Tipo de usuario y datos dependientes
      if (!form.value.type_user_id) return false;

      if (isSpeaker.value) return isSecretPasswordValid.value;

      const isStudent = Number(form.value.type_user_id) === 1;
      const isTeacher = Number(form.value.type_user_id) === 2;

      const prov = (form.value.provenance || '').toLowerCase();

      if ((isStudent || isTeacher) && prov === 'uttecam') {
        const hasMat = !!form.value.matricula;
        const hasProg = !!form.value.educational_program;

        if (isStudent) {
          const validGrade = typeof form.value.grade === 'string' && form.value.grade.length >= 1 && form.value.grade.length <= 2;
          const validGroup = typeof form.value.group_user === 'string' && form.value.group_user.length === 1;
          return hasMat && hasProg && validGrade && validGroup;
        }
        // Docente UTTECAM: matricula + programa educativo
        return hasMat && hasProg;
      }

      if ((isStudent || isTeacher) && prov === 'otra') {
        return !!form.value.universidad_procedencia;
      }

      return true;
    }

    case 3: // Datos de Ponente/Tallerista (solo para ponentes)
      // Esta validación solo aplica si el usuario es ponente
      if (isSpeaker.value) {
        const hasBiography = !!form.value.empresa_procedencia && !!form.value.rol_dentro_empresa && !!form.value.descripcion_biografia;
        const hasPresentationInfo = (form.value.tipo_presentacion === 'conferencia' && !!form.value.titulo_conferencia && !!form.value.descripcion_conferencia) ||
                                     (form.value.tipo_presentacion === 'taller' && !!form.value.titulo_taller && !!form.value.descripcion_taller) ||
                                     (form.value.tipo_presentacion === 'ambas' && !!form.value.titulo_conferencia && !!form.value.descripcion_conferencia && !!form.value.titulo_taller && !!form.value.descripcion_taller);
        return hasBiography && hasPresentationInfo;
      }
      // Si no es ponente, esta validación no aplica, pero la lógica de la plantilla debería manejarlo.
      return true;

    case 4: // Redes Sociales (solo para ponentes)
      // Este paso no tiene campos obligatorios, por lo que siempre se puede avanzar
      return true;

    case 5: // Finalizar (Ponente)
      return isSpeaker.value && !!form.value.size_user && accepted.value;
      
    default:
      return true;
  }
});

const canSubmit = computed(() => {
  // Determina si el usuario está en el último paso de su flujo y si los campos están llenos
  const isLastStep = computed(() => step.value === steps.value.length - 1);
  return isLastStep && !!form.value.size_user && accepted.value;
});

// Navegación
function prevStep() {
  if (step.value > 0) step.value--;
}

// Lógica de avance y envío de formulario
async function nextOrSubmit() {
  if (!canProceed.value) {
    notifyWarning('Campos incompletos', 'Revisa los campos requeridos antes de continuar.');
    return;
  }

  // Si estamos en el último paso, enviar el formulario
  if (step.value === steps.value.length - 1) {
    submitRegister();
    return;
  }

  // Lógica de salto de pasos
  // Si es un ponente y está en el paso de tipo de usuario
  if (isSpeaker.value && step.value === 2) {
    // La validación de la contraseña ya se hizo en `canProceed`
    step.value++; // Avanzar al siguiente paso del flujo de ponente (Datos de Ponente)
  } else {
    step.value++;
  }
}

// Normalización de teléfonos y limpieza del payload
function normalizePayload(payload) {
  const finalPayload = {
    email: payload.email,
    password_user: payload.password_user,
    name_user: payload.name_user,
    paternal_surname: payload.paternal_surname,
    maternal_surname: payload.maternal_surname,
    type_user_id: Number(payload.type_user_id),
    size_user: payload.size_user
  };

  // Teléfonos (limpios + lada)
  const clean = v => v?.replace(/\D/g, '');
  if (payload.phone) {
    finalPayload.phone = `${payload.phone_country}${clean(payload.phone)}`;
  }
  if (payload.emergency_phone) {
    finalPayload.emergency_phone = `${payload.emergency_phone_country}${clean(payload.emergency_phone)}`;
  }

  // Estudiante/Docente
  if ([1, 2].includes(Number(payload.type_user_id))) {
    finalPayload.provenance = (payload.provenance || '').toLowerCase();

    if (finalPayload.provenance === 'uttecam') {
      finalPayload.matricula = payload.matricula || '';
      finalPayload.educational_program = payload.educational_program || '';
      if (Number(payload.type_user_id) === 1) { // Estudiante
        finalPayload.grade = payload.grade || '';
        finalPayload.group_user = payload.group_user || '';
      }
    } else if (finalPayload.provenance === 'otra') {
      finalPayload.universidad_procedencia = payload.universidad_procedencia || '';
    }
  }

  // Ponente/Tallerista
  if (Number(payload.type_user_id) === 4) {
    finalPayload.secret_password = payload.secret_password || '';
    finalPayload.empresa_procedencia = payload.empresa_procedencia || '';
    finalPayload.rol_dentro_empresa = payload.rol_dentro_empresa || '';
    finalPayload.descripcion_biografia = payload.descripcion_biografia || '';
    finalPayload.tipo_presentacion = payload.tipo_presentacion || '';

    if (['conferencia', 'ambas'].includes(payload.tipo_presentacion)) {
      finalPayload.titulo_conferencia = payload.titulo_conferencia || '';
      finalPayload.descripcion_conferencia = payload.descripcion_conferencia || '';
    }
    if (['taller', 'ambas'].includes(payload.tipo_presentacion)) {
      finalPayload.titulo_taller = payload.titulo_taller || '';
      finalPayload.descripcion_taller = payload.descripcion_taller || '';
    }

    finalPayload.facebook_link = payload.facebook_link || '';
    finalPayload.instagram_link = payload.instagram_link || '';
    finalPayload.x_link = payload.x_link || '';
    finalPayload.linkedin_link = payload.linkedin_link || '';
  }

  return finalPayload;
}

// Envío del formulario
async function submitRegister() {
  if (loading.value) return; // ⬅️ evita doble envío por doble click/enter
  if (!canSubmit.value) {
    notifyWarning('Formulario incompleto', 'Debes aceptar los términos y elegir tu talla.');
    return;
  }

  loading.value = true;
  const loadingToast = notifyLoading('Procesando', 'Creando tu cuenta...');

  try {
    const payload = normalizePayload(form.value);

    const { data } = await api.post(ROUTES.AUTH.REGISTER, payload, {
      withCredentials: true, // quítalo si no usas cookies aquí
    });

    // (Opcional) si algún día devuelves verification_token:
    if (data?.verification_token) {
      localStorage.setItem('verification_token', data.verification_token);
    }

    localStorage.setItem('verify_email', payload.email);
    localStorage.removeItem(STORAGE_KEY);

    loadingToast.resolve({ title: 'Éxito 🎉', message: 'Cuenta creada con éxito' });
    router.push('/verify');
  } catch (err) {
    console.error(err);

    // Si el back devolvió 409 por P2002, muéstralo claro
    const status = err?.response?.status;
    const serverMsg = err?.response?.data?.message;
    let errorMessage = parseAxiosError(err) || 'Error desconocido.';

    if (status === 409 && serverMsg) {
      errorMessage = Array.isArray(serverMsg) ? serverMsg.join('\n') : serverMsg;
    }

    loadingToast.reject({ title: 'Error en registro', message: errorMessage });
  } finally {
    loading.value = false;
  }
}

// ... importaciones y estados iniciales

// Nuevos estados para el selector de país
const isOpen = ref({ // Modificado a objeto para manejar ambos dropdowns
  main: false,
  emergency: false
});
const selectedCountryCode = ref('mx'); // Código inicial para la bandera principal
const emergencyCountryCode = ref('mx'); // Código inicial para la bandera de emergencia

const countries = ref([
  { code: 'mx', name: 'México', phoneCode: '+52' },
  { code: 'us', name: 'Estados Unidos', phoneCode: '+1' },
  { code: 'es', name: 'España', phoneCode: '+34' },
  // Agrega más países si es necesario
]);

// Inicializa el código de país en el formulario al cargar
onMounted(() => {
  // ... tu lógica de onMounted
  if (!form.value.phone_country) {
    // Asume que el código de país se almacena en `phone_country` en el formulario
    form.value.phone_country = getPhoneCode(selectedCountryCode.value);
  }
});

// Función para obtener la lada
const getPhoneCode = (code) => {
  const country = countries.value.find(c => c.code === code);
  return country ? country.phoneCode : '+52';
};

// Funciones de interacción del selector
const toggleDropdown = (type) => {
  // Cierra el otro dropdown si está abierto
  const otherType = type === 'main' ? 'emergency' : 'main';
  if (isOpen.value[otherType]) {
    isOpen.value[otherType] = false;
  }
  isOpen.value[type] = !isOpen.value[type];
};

const selectCountry = (country, type) => {
  if (type === 'main') {
    selectedCountryCode.value = country.code;
    form.value.phone_country = country.phoneCode; // Actualiza el código en el formulario
    isOpen.value.main = false;
  } else if (type === 'emergency') {
    emergencyCountryCode.value = country.code;
    form.value.emergency_phone_country = country.phoneCode; // Actualiza el código en el formulario
    isOpen.value.emergency = false;
  }
};

function goLogin() {
  router.push("/login");
}
</script>