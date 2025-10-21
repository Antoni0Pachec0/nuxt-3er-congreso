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

        <!-- Stepper -->
        <ol
          class="stepper stepper--timeline"
          :style="{ '--step-count': isSpeaker ? 6 : 4 }"
          aria-label="Registration progress"
          ref="stepperRef"
        >
          <li
            v-for="(s, i) in steps"
            :key="s.key"
            class="step"
            :class="{ active: i === step, done: i < step }"
          >
            <span class="step__label">{{ s.label }}</span>
            <span class="step__dot" aria-hidden="true"></span>
            <span class="step__index" aria-hidden="true">{{ i + 1 }}</span>
          </li>
        </ol>

        <!-- Form -->
        <form class="form" @submit.prevent="nextOrSubmit" novalidate>
          <!-- Paso 0: Cuenta -->
          <template v-if="step === 0">
            <div class="stack">
              <label class="label" for="email">Email</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <SvgIcon :path="mdiEmailOutline" type="mdi" />
                </span>
                <input
                  id="email"
                  v-model.trim="form.email"
                  maxlength="100"
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
                  <span class="input-icon">
                    <SvgIcon :path="mdiLockOutline" type="mdi" />
                  </span>
                  <input
                    id="password_user"
                    :type="showPass ? 'text' : 'password'"
                    v-model.trim="form.password_user"
                    required
                    minlength="8"
                    autocomplete="new-password"
                    maxlength="50"
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

                <!-- Medidor de contraseña inline -->
                <div class="pw-meter" aria-live="polite" v-if="form.password_user">
                  <div class="help" style="margin-bottom:.25rem">
                    La contraseña debe cumplir con <strong>todos</strong> los parámetros.
                  </div>
                  <div class="pw-meter__bar">
                    <span class="pw-meter__fill" :style="{ width: strengthPercent }"></span>
                  </div>
                  <div class="pw-meter__legend">
                    Fortaleza:
                    <strong :class="'pw-' + strengthLabel.toLowerCase()">{{ strengthLabel }}</strong>
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
                  <span class="input-icon">
                    <SvgIcon :path="mdiLockCheckOutline" type="mdi" />
                  </span>
                  <input
                    id="password2"
                    :type="showPass2 ? 'text' : 'password'"
                    v-model.trim="password2"
                    required
                    minlength="8"
                    autocomplete="new-password"
                    maxlength="50"
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
                  maxlength="50"
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
                  maxlength="50"
                  class="input"
                  placeholder="Paterno"
                />
              </div>
              <div class="stack">
                <label class="label" for="maternal_surname">Apellido materno</label>
                <input
                  id="maternal_surname"
                  maxlength="50"
                  v-model.trim="form.maternal_surname"
                  type="text"
                  required
                  class="input"
                  placeholder="Materno"
                />
              </div>
            </div>

            <div class="stack">
              <label class="label" for="phone">Teléfono</label>
              <div class="input-wrap input-wrap--phone" :class="{ open: isOpen.main }" ref="mainPhoneRef">
                <div class="custom-select" @click="toggleDropdown('main')" :aria-expanded="isOpen.main">
                  <div class="selected-option">
                    <div class="flag-wrap">
                      <FlagIcon :country="selectedCountryCode" />
                    </div>
                    <span class="country-code">{{ getPhoneCode(selectedCountryCode) }}</span>
                  </div>
                  <ul v-if="isOpen.main" class="options-list" role="listbox">
                    <li v-for="country in countries" :key="country.code" @click.stop="selectCountry(country, 'main')">
                      <div class="flag-wrap">
                        <FlagIcon :country="country.code" />
                      </div>
                      <span class="country-name">{{ country.name }}</span>
                      <span class="country-code">{{ country.phoneCode }}</span>
                    </li>
                  </ul>
                </div>
                <input
                  id="phone"
                  v-model.trim="form.phone"
                  type="tel"
                  required
                  maxlength="10"
                  autocomplete="tel-national"
                  class="input"
                  placeholder="55 1234 5678"
                />
              </div>
            </div>

            <div class="stack">
              <label class="label" for="emergency_phone">Teléfono de emergencia</label>
              <div class="input-wrap input-wrap--phone" :class="{ open: isOpen.emergency }" ref="emergencyPhoneRef">
                <div class="custom-select" @click="toggleDropdown('emergency')" :aria-expanded="isOpen.emergency">
                  <div class="selected-option">
                    <div class="flag-wrap">
                      <FlagIcon :country="emergencyCountryCode" />
                    </div>
                    <span class="country-code">{{ getPhoneCode(emergencyCountryCode) }}</span>
                  </div>
                  <ul v-if="isOpen.emergency" class="options-list" role="listbox">
                    <li
                      v-for="country in countries"
                      :key="country.code"
                      @click.stop="selectCountry(country, 'emergency')"
                    >
                      <div class="flag-wrap">
                        <FlagIcon :country="country.code" />
                      </div>
                      <span class="country-name">{{ country.name }}</span>
                      <span class="country-code">{{ country.phoneCode }}</span>
                    </li>
                  </ul>
                </div>
                <input
                  id="emergency_phone"
                  v-model.trim="form.emergency_phone"
                  type="tel"
                  maxlength="10"
                  class="input"
                  placeholder="Teléfono de contacto (opcional)"
                />
              </div>
            </div>
          </template>

          <!-- Paso 2: Tipo de usuario -->
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

            <!-- Ponente -->
            <template v-if="form.type_user_id === 4">
              <div class="stack">
                <label class="label" for="secret_password">Contraseña Secreta</label>
                <div class="input-wrap">
                  <input
                    id="secret_password"
                    v-model.trim="form.secret_password"
                    :type="showSecretPass ? 'text' : 'password'"
                    :required="isSpeaker"
                    minlength="8"
                    maxlength="30"
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

            <!-- Estudiante/Maestro -->
            <template v-if="isStudentOrTeacher">
              <div class="stack">
                <label class="label" for="provenance">Procedencia</label>
                <select
                  id="provenance"
                  v-model="form.provenance"
                  class="input"
                  :required="isStudentOrTeacher"
                >
                  <option disabled value="">Selecciona tu procedencia</option>
                  <option value="uttecam">UTTECAM</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <!-- UTTECAM -->
              <template v-if="form.provenance === 'uttecam'">
                <div class="grid resp">
                  <div class="stack">
                    <label class="label" for="matricula">Matrícula</label>
                    <input
                      id="matricula"
                      v-model.trim="form.matricula"
                      type="text"
                      class="input"
                      maxlength="20"
                      placeholder="Tu matrícula"
                      :required="isStudentOrTeacher && (form.provenance||'').toLowerCase()==='uttecam'"
                    />
                  </div>
                  <div class="stack">
                    <label class="label" for="programa_educativo">Programa Educativo</label>
                    <select
                      id="programa_educativo"
                      v-model.trim="form.educational_program"
                      class="input"
                      :required="isStudentOrTeacher && (form.provenance||'').toLowerCase()==='uttecam'"
                    >
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
                    <input
                      id="grado"
                      v-model.trim="form.grade"
                      maxlength="5"
                      type="text"
                      class="input"
                      placeholder="Ej. 7"
                      :required="Number(form.type_user_id)===1 && (form.provenance||'').toLowerCase()==='uttecam'"
                    />
                  </div>
                  <div class="stack">
                    <label class="label" for="grupo">Grupo</label>
                    <input
                      id="grupo"
                      v-model.trim="form.group_user"
                      maxlength="5"
                      type="text"
                      class="input"
                      placeholder="Ej. C"
                      :required="Number(form.type_user_id)===1 && (form.provenance||'').toLowerCase()==='uttecam'"
                    />
                  </div>
                </div>
              </template>

              <!-- Otra universidad -->
              <template v-if="form.provenance === 'otra'">
                <div class="stack">
                  <label class="label" for="universidad_procedencia">Universidad de procedencia</label>
                  <input
                    id="universidad_procedencia"
                    maxlength="100"
                    v-model.trim="form.universidad_procedencia"
                    type="text"
                    class="input"
                    placeholder="Nombre de tu universidad"
                    :required="isStudentOrTeacher && (form.provenance||'').toLowerCase()==='otra'"
                  />
                </div>
              </template>
            </template>
          </template>

          <!-- Paso 3: Datos ponente o Finalizar (no ponente) -->
          <template v-else-if="step === 3">
            <!-- Ponente -->
            <template v-if="isSpeaker">
              <div class="grid resp">
                <div class="stack">
                  <label class="label" for="empresa_procedencia">Empresa/Institución de procedencia</label>
                  <input
                    id="empresa_procedencia"
                    v-model.trim="form.empresa_procedencia"
                    type="text"
                    class="input"
                    maxlength="100"
                    placeholder="Nombre de tu empresa u organización"
                    :required="isSpeaker"
                  />
                </div>
                <div class="stack">
                  <label class="label" for="rol_dentro_empresa">Rol/Cargo</label>
                  <input
                    id="rol_dentro_empresa"
                    maxlength="100"
                    v-model.trim="form.rol_dentro_empresa"
                    type="text"
                    class="input"
                    placeholder="Tu cargo o rol actual"
                    :required="isSpeaker"
                  />
                </div>
              </div>

              <div class="stack">
                <label class="label" for="descripcion_biografia">Biografía profesional</label>
                <textarea
                  id="descripcion_biografia"
                  v-model.trim="form.descripcion_biografia"
                  rows="4"
                  maxlength="180"
                  class="input"
                  placeholder="Describe tu experiencia profesional y perfil (máx. 180 caracteres)"
                  :required="isSpeaker"
                ></textarea>
                <small class="help">{{ form.descripcion_biografia.length }} / 180 caracteres</small>
              </div>

              <div class="stack">
                <label class="label" for="tipo_presentacion">Tipo de participación</label>
                <select
                  id="tipo_presentacion"
                  v-model="form.tipo_presentacion"
                  class="input"
                  :required="isSpeaker"
                >
                  <option disabled value="">Selecciona el tipo de presentación</option>
                  <option value="conferencia">Conferencia</option>
                  <option value="taller">Taller</option>
                  <option value="ambas">Ambas</option>
                </select>
              </div>

              <template v-if="form.tipo_presentacion === 'conferencia' || form.tipo_presentacion === 'ambas'">
                <div class="stack">
                  <label class="label" for="titulo_conferencia">Título de la Conferencia o Charla Empresarial</label>
                  <input
                    id="titulo_conferencia"
                    maxlength="100"
                    v-model.trim="form.titulo_conferencia"
                    type="text"
                    class="input"
                    placeholder="Título de tu conferencia"
                    :required="isSpeaker && ['conferencia','ambas'].includes(form.tipo_presentacion)"
                  />
                </div>
                <div class="stack">
                  <label class="label" for="descripcion_conferencia">Descripción de la Conferencia o Charla Empresarial</label>
                  <textarea
                    id="descripcion_conferencia"
                    v-model.trim="form.descripcion_conferencia"
                    rows="4"
                    maxlength="180"
                    class="input"
                    placeholder="Describe el contenido y objetivos de tu conferencia (máx. 180 caracteres)"
                    :required="isSpeaker && ['conferencia','ambas'].includes(form.tipo_presentacion)"
                  ></textarea>
                  <small class="help">{{ form.descripcion_conferencia.length }} / 180 caracteres</small>
                </div>
              </template>

              <template v-if="form.tipo_presentacion === 'taller' || form.tipo_presentacion === 'ambas'">
                <div class="stack">
                  <label class="label" for="titulo_taller">Título del Taller</label>
                  <input
                    id="titulo_taller"
                    maxlength="50"
                    v-model.trim="form.titulo_taller"
                    type="text"
                    class="input"
                    placeholder="Título de tu taller"
                    :required="isSpeaker && ['taller','ambas'].includes(form.tipo_presentacion)"
                  />
                </div>
                <div class="stack">
                  <label class="label" for="descripcion_taller">Descripción del Taller</label>
                  <textarea
                    id="descripcion_taller"
                    v-model.trim="form.descripcion_taller"
                    rows="4"
                    maxlength="180"
                    class="input"
                    placeholder="Describe el contenido y objetivos de tu taller (máx. 180 caracteres)"
                    :required="isSpeaker && ['taller','ambas'].includes(form.tipo_presentacion)"
                  ></textarea>
                  <small class="help">{{ form.descripcion_taller.length }} / 180 caracteres</small>
                </div>
              </template>
            </template>

            <!-- No ponente -->
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
                <label for="terms">
                  Acepto los
                  <a href="#" @click.prevent="showTermsModal = true">términos y aviso de privacidad</a>
                </label>
              </div>
            </template>
          </template>

          <!-- Paso 4: Redes (ponente) -->
          <template v-else-if="step === 4 && isSpeaker">
            <div class="stack">
              <label class="label" for="facebook_link">Facebook</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <SvgIcon :path="mdiFacebook" type="mdi" />
                </span>
                <input
                  id="facebook_link"
                  maxlength="200"
                  v-model.trim="form.facebook_link"
                  type="url"
                  class="input"
                  placeholder="Link a tu perfil de Facebook (opcional)"
                />
              </div>
            </div>
            <div class="stack">
              <label class="label" for="instagram_link">Instagram</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <SvgIcon :path="mdiInstagram" type="mdi" />
                </span>
                <input
                  id="instagram_link"
                  maxlength="200"
                  v-model.trim="form.instagram_link"
                  type="url"
                  class="input"
                  placeholder="Link a tu perfil de Instagram (opcional)"
                />
              </div>
            </div>
            <div class="stack">
              <label class="label" for="x_link">X (Twitter)</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <SvgIcon :path="mdiTwitter" type="mdi" />
                </span>
                <input
                  id="x_link"
                  maxlength="200"
                  v-model.trim="form.x_link"
                  type="url"
                  class="input"
                  placeholder="Link a tu perfil de X (opcional)"
                />
              </div>
            </div>
            <div class="stack">
              <label class="label" for="linkedin_link">LinkedIn</label>
              <div class="input-wrap">
                <span class="input-icon">
                  <SvgIcon :path="mdiLinkedin" type="mdi" />
                </span>
                <input
                  id="linkedin_link"
                  maxlength="200"
                  v-model.trim="form.linkedin_link"
                  type="url"
                  class="input"
                  placeholder="Link a tu perfil de LinkedIn (opcional)"
                />
              </div>
            </div>
          </template>

          <!-- Paso 5: Final (ponente) -->
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
              <label for="terms">
                Acepto los
                <a href="#" @click.prevent="showTermsModal = true">términos y aviso de privacidad</a>
              </label>
            </div>
          </template>

          <!-- Navegación -->
          <div class="nav">
            <button v-if="step > 0" type="button" class="btn ghost" @click="prevStep">
              Atrás
            </button>
            <button v-if="isLastStep" type="submit" class="btn" :disabled="loading || !canSubmit">
              {{ loading ? "Creando cuenta…" : "Crear cuenta" }}
            </button>
            <button v-else type="submit" class="btn" :disabled="!canProceed || secretValidating">
              {{ secretValidating ? 'Validando…' : 'Continuar' }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <!-- Modal -->
    <div v-if="showTermsModal" class="modal-overlay" @click.self="showTermsModal = false">
      <div class="modal-content">
        <button class="modal-close" @click="showTermsModal = false">
          <SvgIcon :path="mdiClose" type="mdi" />
        </button>
        <h3 class="modal-title">Términos y Aviso de Privacidad</h3>
        <div class="modal-body">
          <p>
            Al registrarte en el 3er Congreso Internacional, aceptas los siguientes términos y condiciones, así como nuestro aviso de privacidad.
            Tu información personal será utilizada exclusivamente para la organización y gestión de este evento.
            A continuación, se detallan los términos que aceptas:
            Uso de Información Personal: Tu información personal será utilizada únicamente para fines de organización y gestión del 3er Congreso Internacional.
            Exclusión de Responsabilidad por Enlaces Externos: Al aceptar estos términos y condiciones, el equipo Elite y la Universidad Tecnológica de Tecamachalco (UTT) no se hacen responsables por daños a dispositivos móviles y/o laptops personales generados por el uso o acceso a enlaces externos.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
definePageMeta({ name: 'register', path: '/register', guestOnly: true })

// @ts-expect-error
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiAccountPlusOutline, mdiEmailOutline, mdiLockOutline, mdiLockCheckOutline,
  mdiEyeOutline, mdiEyeOffOutline, mdiArrowLeft, mdiClose,
  mdiFacebook, mdiInstagram, mdiTwitter, mdiLinkedin
} from '@mdi/js'

import FlagIcon from '@/components/atoms/flag-icon.vue'

// 👉 Consumir **únicamente** el composable
import { useRegister } from '@/composables/auth/use-register'

const {
  // paso / stepper
  step, steps, stepperRef, isLastStep, canProceed, canSubmit,
  prevStep, nextOrSubmit, goLogin,

  // cuenta
  form, showPass, showPass2, showSecretPass, password2,
  reqs, strengthPercent, strengthLabel, pwdMatch, touchPwd,

  // ponente
  isSpeaker, secretValidating, isStudentOrTeacher,

  // final
  accepted, showTermsModal,

  // teléfonos
  isOpen, selectedCountryCode, emergencyCountryCode, countries,
  getPhoneCode, toggleDropdown, selectCountry,

  // otros
  loading
} = useRegister()
</script>

<style scoped>
@import '@/assets/css/styles/auth/register.css';
</style>
