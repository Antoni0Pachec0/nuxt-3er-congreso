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

        <ol
          class="stepper stepper--timeline"
          :style="{ '--step-count': steps.length }"
          aria-label="Registration progress"
        >
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

            <!-- Teléfono principal -->
            <div class="stack">
              <label class="label" for="phone">Teléfono</label>
              <div class="input-wrap input-wrap--phone" :class="{ open: isOpen.main }">
                <div class="custom-select" @click="toggleDropdown('main')" :aria-expanded="isOpen.main">
                  <div class="selected-option">
                    <div class="flag-wrap"><FlagIcon :country="selectedCountryCode" /></div>
                    <span class="country-code">{{ getPhoneCode(selectedCountryCode) }}</span>
                  </div>
                  <ul v-if="isOpen.main" class="options-list" role="listbox">
                    <li v-for="country in countries" :key="country.code" @click.stop="selectCountry(country, 'main')">
                      <div class="flag-wrap"><FlagIcon :country="country.code" /></div>
                      <span class="country-name">{{ country.name }}</span>
                      <span class="country-code">{{ country.phoneCode }}</span>
                    </li>
                  </ul>
                </div>
                <input id="phone" v-model.trim="form.phone" type="tel" required autocomplete="tel-national" class="input" placeholder="55 1234 5678" />
              </div>
            </div>

            <!-- Teléfono de emergencia -->
            <div class="stack">
              <label class="label" for="emergency_phone">Teléfono de emergencia</label>
              <div class="input-wrap input-wrap--phone" :class="{ open: isOpen.emergency }">
                <div class="custom-select" @click="toggleDropdown('emergency')" :aria-expanded="isOpen.emergency">
                  <div class="selected-option">
                    <div class="flag-wrap"><FlagIcon :country="emergencyCountryCode" /></div>
                    <span class="country-code">{{ getPhoneCode(emergencyCountryCode) }}</span>
                  </div>
                  <ul v-if="isOpen.emergency" class="options-list" role="listbox">
                    <li v-for="country in countries" :key="country.code" @click.stop="selectCountry(country, 'emergency')">
                      <div class="flag-wrap"><FlagIcon :country="country.code" /></div>
                      <span class="country-name">{{ country.name }}</span>
                      <span class="country-code">{{ country.phoneCode }}</span>
                    </li>
                  </ul>
                </div>
                <input id="emergency_phone" v-model.trim="form.emergency_phone" type="tel" class="input" placeholder="Teléfono de contacto (opcional)" />
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
              <div class="input-wrap">
                <input
                  id="secret_password"
                  v-model.trim="form.secret_password"
                  :type="showSecretPass ? 'text' : 'password'"
                  required
                  class="input input--pass"
                  placeholder="Ingresa la contraseña para continuar"
                />
                <button
                  type="button"
                  class="eye"
                  :aria-pressed="showSecretPass ? 'true' : 'false'"
                  :title="showSecretPass ? 'Ocultar' : 'Mostrar'"
                  @click="showSecretPass = !showSecretPass"
                >
                  <SvgIcon v-if="showSecretPass" :path="mdiEyeOffOutline" type="mdi" />
                  <SvgIcon v-else :path="mdiEyeOutline" type="mdi" />
                </button>
              </div>
              <small class="help">Esta contraseña es proporcionada por los organizadores del evento.</small>
            </div>
          </template>
            
            <template v-if="[1, 2].includes(form.type_user_id as number)">
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
                    <select id="programa_educativo" v-model.trim="form.educational_program" class="input" required>
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
                    <input id="grado"  v-model.trim="form.grade"  type="text" required class="input" placeholder="Ej. 7" />
                  </div>
                  <div class="stack">
                    <label class="label" for="grupo">Grupo</label>
                    <input id="grupo"  v-model.trim="form.group_user" type="text" required class="input" placeholder="Ej. C" />
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

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue"; 
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
import FlagIcon from "@/components/atoms/FlagIcon.vue";
import api from '~/plugins/http/api';
import { ROUTES } from '~/plugins/http/routes';
import { parseAxiosError } from '~/plugins/http/error';
import { notifyError, notifyWarning, notifyLoading } from '~/utils/notifications';
import '@/assets/css/styles/Register.css';
// Importa las rutas desde tu archivo app-routes.js
import { APP_ROUTES, R } from '~/utils/app-routes';

const router = useRouter();
const STORAGE_KEY = "register_form_v7";

/* ===================
 * Estados
 * =================== */
const step = ref(0);
const showPass = ref(false);
const showPass2 = ref(false);
const showSecretPass = ref(false)
const password2 = ref('');
const loading = ref(false);
const accepted = ref(false);
const showTermsModal = ref(false);

// Password meter: mostrar sólo tras tocar
const passwordTouched = ref(false);
function touchPwd() { passwordTouched.value = true; }

// Verificación remota de contraseña de ponente
const speakerSecretOk = ref(false);

/* ===================
 * Stepper
 * =================== */
const steps = ref<{key:string;label:string}[]>([]);
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

/* ===================
 * Form
 * =================== */
const form = ref({
  email: '',
  password_user: '',
  name_user: '',
  paternal_surname: '',
  maternal_surname: '',
  phone: '',
  phone_country: '+52',
  emergency_phone: '',
  emergency_phone_country: '+52',
  type_user_id: null as number | null,
  provenance: '',
  matricula: '',
  educational_program: '',
  grade: '',
  group_user: '',
  universidad_procedencia: '',
  // Ponente
  secret_password: '',
  empresa_procedencia: '',
  rol_dentro_empresa: '',
  descripcion_biografia: '',
  tipo_presentacion: '',
  titulo_conferencia: '',
  descripcion_conferencia: '',
  titulo_taller: '',
  descripcion_taller: '',
  // Redes
  facebook_link: '',
  instagram_link: '',
  x_link: '',
  linkedin_link: '',
  // Final
  size_user: ''
});

/* ===================
 * Computed
 * =================== */
const isSpeaker = computed(() => form.value.type_user_id === 4);
const isStudentOrTeacher = computed(() => [1, 2].includes(Number(form.value.type_user_id)));
const isSecretPasswordValid = computed(() => (form.value.secret_password || '').trim().length > 0);

// Password meter
const reqs = ref({ len: false, upper: false, lower: false, num: false, sym: false });
const pwdMatch = computed(() => password2.value === form.value.password_user && password2.value.length > 0);
const strengthScore = computed(() => {
  const validCount = Object.values(reqs.value).filter(Boolean).length;
  // Solo considerar la contraseña como válida si tiene al menos 3 criterios
  return validCount;
});
const strengthPercent = computed(() => `${(strengthScore.value / 5) * 100}%`);
const strengthLabel = computed(() => {
  const score = strengthScore.value;
  // Etiquetas más realistas
  if (score <= 2) return 'Muy débil';
  if (score === 3) return 'Media';
  if (score === 4) return 'Fuerte';
  return 'Excelente';
});

const isLastStep = computed(() => step.value === steps.value.length - 1);
const canSubmit = computed(() => isLastStep.value && !!form.value.size_user && accepted.value);

// --- NUEVO: estado para secret remoto
const secretValidated = ref(false);
const secretValidating = ref(false);

const stepperRef = ref<HTMLOListElement | null>(null);

function centerActiveStep() {
  nextTick(() => {
    const el = stepperRef.value?.querySelectorAll<HTMLElement>('.step')[step.value];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
}

onMounted(centerActiveStep);
watch(step, centerActiveStep);

// Cuando cambie tipo o el texto de la clave, reinicia validación
watch([() => form.value.type_user_id, () => form.value.secret_password], () => {
  secretValidated.value = false;
});

/* ===================
 * Validación remota de contraseña de ponente
 * =================== */
// --- NUEVO: valida contra tu endpoint
async function validateSpeakerSecret() {
  if (!isSpeaker.value) return true;
  const secret = (form.value.secret_password || '').trim();
  if (!secret) {
    notifyWarning('Contraseña requerida', 'Ingresa la contraseña de ponente.');
    return false;
  }

  try {
    secretValidating.value = true;
    await api.post(ROUTES.AUTH.CHECK_SPEAKER_SECRET, { secret_password: secret });
    secretValidated.value = true;
    return true;
  } catch (err: any) {
    secretValidated.value = false;
    const msg = err?.response?.data?.message || 'Contraseña de ponente inválida';
    notifyError('Contraseña inválida', msg);
    return false;
  } finally {
    secretValidating.value = false;
  }
}

/* ===================
 * Watchers
 * =================== */
watch(() => form.value.password_user, (p = '') => {
  reqs.value = {
    len: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    num: /\d/.test(p),
    sym: /[^\w\s]/.test(p),
  };
});

watch(isSpeaker, (now) => {
  steps.value = now ? [...speakerSteps] : [...baseSteps];
  // al cambiar tipo → invalidar verificación y limpiar campos de ponente
  speakerSecretOk.value = false;
  if (!now) {
    const fields = [
      'secret_password','empresa_procedencia','rol_dentro_empresa','descripcion_biografia',
      'tipo_presentacion','titulo_conferencia','descripcion_conferencia','titulo_taller',
      'descripcion_taller','facebook_link','instagram_link','x_link','linkedin_link'
    ];
    fields.forEach(k => (form.value as any)[k] = '');
  }
});

// si cambia la clave secreta, hay que revalidar
watch(() => form.value.secret_password, () => { speakerSecretOk.value = false; });

/* ===================
 * Persistencia (sin password)
 * =================== */
const PERSIST_KEYS = [
  'email',
  'password_user', // 👈 AGREGAR
  'secret_password', // 👈 AGREGAR
  'name_user','paternal_surname','maternal_surname',
  // ... (el resto de tus campos)
  'phone_country','emergency_phone','emergency_phone_country',
  'type_user_id','provenance','matricula','educational_program','grade','group_user',
  'universidad_procedencia',
  'empresa_procedencia','rol_dentro_empresa','descripcion_biografia','tipo_presentacion',
  'titulo_conferencia','descripcion_conferencia','titulo_taller','descripcion_taller',
  'facebook_link','instagram_link','x_link','linkedin_link','size_user'
];
const persistable = computed(() => {
  const out:any = {};
  for (const k of PERSIST_KEYS) out[k] = (form.value as any)[k] ?? '';
  return out;
});

/* ===================
 * Países / ladas
 * =================== */
const isOpen = ref({ main: false, emergency: false });
const selectedCountryCode = ref('mx');
const emergencyCountryCode = ref('mx');
const countries = ref([
  { code: 'mx', name: 'México',         phoneCode: '+52' },
  { code: 'us', name: 'Estados Unidos', phoneCode: '+1'  },
  { code: 'ca', name: 'Canadá',         phoneCode: '+1'  },
  { code: 'es', name: 'España',         phoneCode: '+34' },
  { code: 'ar', name: 'Argentina',      phoneCode: '+54' },
  { code: 'co', name: 'Colombia',       phoneCode: '+57' },
  { code: 'cl', name: 'Chile',          phoneCode: '+56' },
]);
const getPhoneCode = (code:string) => countries.value.find(c => c.code === code)?.phoneCode || '+52';

const toggleDropdown = (type:'main'|'emergency') => {
  const other = type === 'main' ? 'emergency' : 'main';
  if (isOpen.value[other]) isOpen.value[other] = false;
  isOpen.value[type] = !isOpen.value[type];
};
const selectCountry = (country:{code:string; phoneCode:string}, type:'main'|'emergency') => {
  if (type === 'main') {
    selectedCountryCode.value = country.code;
    form.value.phone_country = country.phoneCode;
    isOpen.value.main = false;
  } else {
    emergencyCountryCode.value = country.code;
    form.value.emergency_phone_country = country.phoneCode;
    isOpen.value.emergency = false;
  }
};

/* ===================
 * Carga inicial
 * =================== */
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (saved?.form) {
      Object.assign(form.value, saved.form);
      step.value = saved.step ?? 0;
      accepted.value = !!saved.accepted;
      
      // RESTAURAR PASSWORD DE CONFIRMACIÓN
      // Como password2 no está en el form, lo buscamos en localStorage
      password2.value = saved.form.password_user || '';
      
      // Si la contraseña de ponente fue guardada, asumimos que fue validada
      if (form.value.secret_password && isSpeaker.value) {
        secretValidated.value = true;
      }

      const mainCountry = countries.value.find(c => c.phoneCode === saved.form?.phone_country);
      if (mainCountry) selectedCountryCode.value = mainCountry.code;

      const emerCountry = countries.value.find(c => c.phoneCode === saved.form?.emergency_phone_country);
      if (emerCountry) emergencyCountryCode.value = emerCountry.code;
    }
  } catch {}
  
  if (!form.value.phone_country) form.value.phone_country = getPhoneCode(selectedCountryCode.value);
  if (!form.value.emergency_phone_country) form.value.emergency_phone_country = getPhoneCode(emergencyCountryCode.value);
  steps.value = isSpeaker.value ? [...speakerSteps] : [...baseSteps];
});

watch([persistable, step, accepted], () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    form: persistable.value,
    step: step.value,
    accepted: accepted.value
  }));
}, { deep: true });

/* ===================
 * Validación por paso (FE)
 * =================== */
const canProceed = computed(() => {
  switch (step.value) {
    case 0:
      return !!form.value.email && form.value.password_user.length >= 8 && strengthScore.value >= 3 && pwdMatch.value;
    case 1:
      return !!form.value.name_user && !!form.value.paternal_surname && !!form.value.maternal_surname && !!form.value.phone;
    case 2: {
      if (!form.value.type_user_id) return false;

      // Para ponente: que haya escrito la contraseña
      if (isSpeaker.value) return secretValidated.value || isSecretPasswordValid.value;

      // UTTECAM / Otra (alumno o docente)
      const t = Number(form.value.type_user_id);
      const prov = (form.value.provenance || '').toLowerCase();
      const isStudent = t === 1, isTeacher = t === 2;

      if ((isStudent || isTeacher) && prov === 'uttecam') {
        const hasMat = !!form.value.matricula;
        const hasProg = !!form.value.educational_program;
        if (isStudent) {
          const validGrade = typeof form.value.grade === 'string' && form.value.grade.length >= 1 && form.value.grade.length <= 2;
          const validGroup = typeof form.value.group_user === 'string' && form.value.group_user.length === 1;
          return hasMat && hasProg && validGrade && validGroup;
        }
        return hasMat && hasProg;
      }
      if ((isStudent || isTeacher) && prov === 'otra') {
        return !!form.value.universidad_procedencia;
      }
      return true;
    }

    case 3:
      if (isSpeaker.value) {
        const hasBio = !!form.value.empresa_procedencia && !!form.value.rol_dentro_empresa && !!form.value.descripcion_biografia;
        const tp = form.value.tipo_presentacion;
        const confOk = tp === 'conferencia' && !!form.value.titulo_conferencia && !!form.value.descripcion_conferencia;
        const tallOk = tp === 'taller' && !!form.value.titulo_taller && !!form.value.descripcion_taller;
        const ambasOk = tp === 'ambas' && !!form.value.titulo_conferencia && !!form.value.descripcion_conferencia && !!form.value.titulo_taller && !!form.value.descripcion_taller;
        return hasBio && (confOk || tallOk || ambasOk);
      }
      return true;
    case 4:
      return true; // Redes opcionales
    case 5:
      return isSpeaker.value && !!form.value.size_user && accepted.value;
    default:
      return true;
  }
});



/* ===================
 * Navegación
 * =================== */
function prevStep() { if (step.value > 0) step.value--; }

// focus helper
function focusField(field?: string) {
  if (!field) return;
  const fieldStepMap: Record<string, number> = {
    email:0, password_user:0,
    name_user:1, paternal_surname:1, maternal_surname:1, phone:1,
    type_user_id:2, provenance:2, educational_program:2, matricula:2, grade:2, group_user:2, universidad_procedencia:2, secret_password:2,
    empresa_procedencia:3, rol_dentro_empresa:3, descripcion_biografia:3, tipo_presentacion:3,
    titulo_conferencia:3, descripcion_conferencia:3, titulo_taller:3, descripcion_taller:3,
    size_user: isSpeaker.value ? 5 : 3
  };
  const to = fieldStepMap[field];
  if (typeof to === 'number') step.value = to;
  requestAnimationFrame(() => {
    const el = document.getElementById(field);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLInputElement).focus?.();
    }
  });
}

/* ===================
 * Parseo de errores del back (DTO / ValidationPipe)
 * =================== */
function guessFieldFromServerError(payload: any): { field?: string; message?: string } {
  if (Array.isArray(payload)) {
    const first = payload[0];
    if (first?.property) {
      const msg = first?.constraints
        ? (Object.values(first.constraints)[0] as string)
        : undefined;
      return { field: first.property, message: msg };
    }
    if (typeof first === 'string') return guessFieldFromMessage(first);
  }
  if (typeof payload === 'string') return guessFieldFromMessage(payload);
  if (payload?.message) {
    if (Array.isArray(payload.message)) {
      const first = payload.message[0];
      if (typeof first === 'string') return guessFieldFromMessage(first);
      if (first?.property) {
        const msg = first?.constraints
          ? (Object.values(first.constraints)[0] as string)
          : undefined;
        return { field: first.property, message: msg };
      }
    } else if (typeof payload.message === 'string') {
      return guessFieldFromMessage(payload.message);
    }
  }
  return {};
}

function guessFieldFromMessage(msg: string) {
  const pairs: Array<{ re: RegExp; field: string }> = [
    { re: /email/i, field: 'email' },
    { re: /(password|contrase[ñn]a)/i, field: 'password_user' },
    { re: /(nombre|name)/i, field: 'name_user' },
    { re: /(paterno)/i, field: 'paternal_surname' },
    { re: /(materno)/i, field: 'maternal_surname' },
    { re: /(tel[eé]fono|phone)/i, field: 'phone' },
    { re: /(tipo.*usuario|type_user)/i, field: 'type_user_id' },
    { re: /(provenien|proceden)/i, field: 'provenance' },
    { re: /(matr[ií]cula)/i, field: 'matricula' },
    { re: /(programa)/i, field: 'educational_program' },
    { re: /(grado)/i, field: 'grade' },
    { re: /(grupo)/i, field: 'group_user' },
    { re: /(universidad)/i, field: 'universidad_procedencia' },
    { re: /(secreta|secret)/i, field: 'secret_password' },
    { re: /(empresa)/i, field: 'empresa_procedencia' },
    { re: /(rol)/i, field: 'rol_dentro_empresa' },
    { re: /(biograf[ií]a)/i, field: 'descripcion_biografia' },
    { re: /(presentaci[oó]n|tipo_presentaci[oó]n)/i, field: 'tipo_presentacion' },
    { re: /(conferencia)/i, field: 'titulo_conferencia' },
    { re: /(taller)/i, field: 'titulo_taller' },
    { re: /(talla)/i, field: 'size_user' },
  ];
  for (const { re, field } of pairs) {
    if (re.test(msg)) return { field, message: msg };
  }
  return { message: msg };
}

/* ===================
 * Avance / Submit
 * =================== */
async function nextOrSubmit() {
  if (!canProceed.value) {
    notifyWarning('Campos incompletos', 'Revisa los campos requeridos antes de continuar.');
    return;
  }

  // 👉 Paso 2: si es ponente y aún no validamos, validamos ahora
  if (step.value === 2 && isSpeaker.value && !secretValidated.value) {
    const ok = await validateSpeakerSecret();
    if (!ok) return; // no avances
  }

  if (isLastStep.value) {
    submitRegister();
  } else {
    step.value++;
  }
}

/* ===================
 * Payload normalizado
 * =================== */
function normalizePayload(payload:any) {
  const finalPayload:any = {
    email: payload.email,
    password_user: payload.password_user,
    name_user: payload.name_user,
    paternal_surname: payload.paternal_surname,
    maternal_surname: payload.maternal_surname,
    type_user_id: Number(payload.type_user_id),
    size_user: payload.size_user
  };

  const clean = (v:string) => v?.replace(/\D/g, '');

  if (payload.phone) {
    finalPayload.phone = `${payload.phone_country}${clean(payload.phone)}`;
  }
  // emergencia OPCIONAL: solo si trae algo
  if (payload.emergency_phone?.trim()) {
    finalPayload.emergency_phone = `${payload.emergency_phone_country}${clean(payload.emergency_phone)}`;
  }

  if ([1,2].includes(Number(payload.type_user_id))) {
    finalPayload.provenance = (payload.provenance || '').toLowerCase();
    if (finalPayload.provenance === 'uttecam') {
      finalPayload.matricula = payload.matricula || '';
      finalPayload.educational_program = payload.educational_program || '';
      if (Number(payload.type_user_id) === 1) {
        finalPayload.grade = payload.grade || '';
        finalPayload.group_user = payload.group_user || '';
      }
    } else if (finalPayload.provenance === 'otra') {
      finalPayload.universidad_procedencia = payload.universidad_procedencia || '';
    }
  }

  if (Number(payload.type_user_id) === 4) {
    finalPayload.secret_password = payload.secret_password || '';
    finalPayload.empresa_procedencia = payload.empresa_procedencia || '';
    finalPayload.rol_dentro_empresa = payload.rol_dentro_empresa || '';
    finalPayload.descripcion_biografia = payload.descripcion_biografia || '';
    finalPayload.tipo_presentacion = payload.tipo_presentacion || '';

    if (['conferencia','ambas'].includes(payload.tipo_presentacion)) {
      finalPayload.titulo_conferencia = payload.titulo_conferencia || '';
      finalPayload.descripcion_conferencia = payload.descripcion_conferencia || '';
    }
    if (['taller','ambas'].includes(payload.tipo_presentacion)) {
      finalPayload.titulo_taller = payload.titulo_taller || '';
      finalPayload.descripcion_taller = payload.descripcion_taller || '';
    }

    // 👉 redes SOLO si traen contenido real
    if (payload.facebook_link?.trim())   finalPayload.facebook_link   = payload.facebook_link.trim();
    if (payload.instagram_link?.trim()) finalPayload.instagram_link = payload.instagram_link.trim();
    if (payload.x_link?.trim())          finalPayload.x_link         = payload.x_link.trim();
    if (payload.linkedin_link?.trim())   finalPayload.linkedin_link   = payload.linkedin_link.trim();
  }

  return finalPayload;
}

/* ===================
 * Submit
 * =================== */
async function submitRegister() {
  if (loading.value) return;
  if (!canSubmit.value) {
    notifyWarning('Formulario incompleto', 'Debes aceptar los términos y elegir tu talla.');
    return;
  }

  loading.value = true;
  const loadingToast = notifyLoading('Procesando', 'Creando tu cuenta...');

  try {
    const payload = normalizePayload(form.value);
    const { data } = await api.post(ROUTES.AUTH.REGISTER, payload, { withCredentials: true });

    // Caso: el back responde 200 con registro pendiente (correo inactivo)
    if (data?.already_exists) {
      localStorage.setItem('verify_email', payload.email);
      loadingToast.resolve({ title: 'Registro pendiente', message: data.message || 'Te reenviamos el código de verificación.' });
      router.push(R.to('verify'));
      return;
    }

    if (data?.verification_token) {
      // localStorage.setItem('verification_token', data.verification_token);
    }
    localStorage.setItem('verify_email', payload.email);
    localStorage.removeItem(STORAGE_KEY);

    loadingToast.resolve({ title: 'Éxito 🎉', message: 'Cuenta creada con éxito' });
    router.push(R.to('verify'));
  } catch (err: any) {
    const status = err?.response?.status;
    const server = err?.response?.data;

    if (status === 409) {
      const msg = Array.isArray(server?.message) ? server.message.join('\n') : (server?.message || 'Conflicto');
      loadingToast.reject({ title: 'Registro pendiente', message: msg });
    } else {
      const picked = guessFieldFromServerError(server?.errors || server?.message || server);
      if (picked?.field) {
        focusField(picked.field);
        notifyError('Corrige este campo', picked.message || 'Dato inválido');
        loadingToast.reject({ title: 'Validación', message: picked.message || 'Corrige el campo indicado' });
      } else {
        const msg = parseAxiosError(err) || 'Ocurrió un error al registrar.';
        loadingToast.reject({ title: 'Error en registro', message: msg });
      }
    }
  } finally {
    loading.value = false;
  }
}

function goLogin() {
  router.push(R.to('login'));
}
</script>