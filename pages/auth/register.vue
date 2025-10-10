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
                  :disabled="loading"
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
                    :disabled="loading"
                    @input="touchPwd()"
                  />
                  <button
                    type="button"
                    class="eye"
                    :aria-pressed="showPass ? 'true' : 'false'"
                    :title="showPass ? 'Ocultar' : 'Mostrar'"
                    @click="showPass = !showPass"
                    :disabled="loading"
                  >
                    <SvgIcon v-if="showPass" :path="mdiEyeOffOutline" type="mdi" />
                    <SvgIcon v-else :path="mdiEyeOutline" type="mdi" />
                  </button>
                </div>
                <div class="pw-meter" aria-live="polite" v-if="passwordTouched">
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
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    class="eye"
                    :aria-pressed="showPass2 ? 'true' : 'false'"
                    :title="showPass2 ? 'Ocultar' : 'Mostrar'"
                    @click="showPass2 = !showPass2"
                    :disabled="loading"
                  >
                    <SvgIcon v-if="showPass2" :path="mdiEyeOffOutline" type="mdi" />
                    <SvgIcon v-else :path="mdiEyeOutline" type="mdi" />
                  </button>
                </div>
                <small class="help error" v-if="password2 && !pwdMatch">
                  Las contraseñas no coinciden.
                </small>
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
                  :disabled="loading"
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
                  :disabled="loading"
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
                  :disabled="loading"
                />
              </div>
            </div>

            <div class="stack">
              <label class="label" for="phone">Teléfono</label>
              <div class="input-wrap input-wrap--phone" :class="{ open: isOpen.main }">
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
                  :disabled="loading"
                />
              </div>
            </div>

            <div class="stack">
              <label class="label" for="emergency_phone">Teléfono de emergencia</label>
              <div class="input-wrap input-wrap--phone" :class="{ open: isOpen.emergency }">
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
                  :disabled="loading"
                />
              </div>
            </div>
          </template>

          <!-- Paso 2: Tipo de usuario -->
          <template v-else-if="step === 2">
            <div class="stack">
              <label class="label" for="type_user_id">Tipo de usuario</label>
              <select id="type_user_id" v-model.number="form.type_user_id" class="input" required :disabled="loading">
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
                    :disabled="loading || secretValidating"
                  />
                  <button
                    type="button"
                    class="eye"
                    :aria-pressed="showSecretPass ? 'true' : 'false'"
                    :title="showSecretPass ? 'Ocultar' : 'Mostrar'"
                    @click="showSecretPass = !showSecretPass"
                    :disabled="loading || secretValidating"
                  >
                    <SvgIcon v-if="showSecretPass" :path="mdiEyeOffOutline" type="mdi" />
                    <SvgIcon v-else :path="mdiEyeOutline" type="mdi" />
                  </button>
                </div>
                <small class="help">Esta contraseña es proporcionada por los organizadores del evento.</small>
                <div v-if="secretValidating" class="help info">
                  Validando contraseña...
                </div>
                <div v-if="secretValidated" class="help success">
                  ✓ Contraseña validada correctamente
                </div>
              </div>
            </template>

            <!-- Estudiante/Maestro -->
            <template v-if="[1, 2].includes(form.type_user_id)">
              <div class="stack">
                <label class="label" for="provenance">Procedencia</label>
                <select
                  id="provenance"
                  v-model="form.provenance"
                  class="input"
                  :required="[1, 2].includes(Number(form.type_user_id))"
                  :disabled="loading"
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
                      :required="[1, 2].includes(Number(form.type_user_id)) && form.provenance === 'uttecam'"
                      :disabled="loading"
                    />
                  </div>
                  <div class="stack">
                    <label class="label" for="programa_educativo">Programa Educativo</label>
                    <select
                      id="programa_educativo"
                      v-model.trim="form.educational_program"
                      class="input"
                      :required="[1, 2].includes(Number(form.type_user_id)) && form.provenance === 'uttecam'"
                      :disabled="loading"
                    >
                      <option disabled value="">Selecciona tu programa</option>
                      <option value="ingenieria-industrial">Ingeniería Industrial</option>
                      <option value="mantenimiento-industrial">Mantenimiento Industrial</option>
                      <option value="mecatronica">Mecatrónica</option>
                      <option value="tecnologias-de-la-informacion">Tecnologías de la información</option>
                      <option value="agricultura-sustentable-y-protegida">Agricultura sustentable y protegida</option>
                      <option value="negocios">Negocios</option>
                      <option value="alimentos">Alimentos</option>
                      <option value="administracion">Administración</option>
                      <option value="contaduria">Contaduría</option>
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
                      :required="Number(form.type_user_id)===1 && form.provenance === 'uttecam'"
                      :disabled="loading"
                    />
                  </div>
                  <div class="stack">
                    <label class="label" for="grupo">Grupo</label>
                    <input
                      id="grupo"
                      v.model.trim="form.group_user"
                      maxlength="5"
                      type="text"
                      class="input"
                      placeholder="Ej. C"
                      :required="Number(form.type_user_id)===1 && form.provenance === 'uttecam'"
                      :disabled="loading"
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
                    :required="[1, 2].includes(Number(form.type_user_id)) && form.provenance === 'otra'"
                    :disabled="loading"
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
                    :disabled="loading"
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
                    :disabled="loading"
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
                  :disabled="loading"
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
                  :disabled="loading"
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
                    :disabled="loading"
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
                    :disabled="loading"
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
                    :disabled="loading"
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
                    :disabled="loading"
                  ></textarea>
                  <small class="help">{{ form.descripcion_taller.length }} / 180 caracteres</small>
                </div>
              </template>
            </template>

            <!-- No ponente -->
            <template v-else>
              <div class="stack">
                <label class="label" for="size_user">Talla de playera</label>
                <select id="size_user" v-model="form.size_user" class="input" required :disabled="loading">
                  <option value="" disabled>Selecciona tu talla</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                  <option>XXL</option>
                </select>
              </div>

              <div class="checkline">
                <input id="terms" v-model="accepted" type="checkbox" required :disabled="loading" />
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
                  :disabled="loading"
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
                  :disabled="loading"
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
                  v.model.trim="form.x_link"
                  type="url"
                  class="input"
                  placeholder="Link a tu perfil de X (opcional)"
                  :disabled="loading"
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
                  :disabled="loading"
                />
              </div>
            </div>
          </template>

          <!-- Paso 5: Final (ponente) -->
          <template v-else-if="step === 5 && isSpeaker">
            <div class="stack">
              <label class="label" for="size_user">Talla de playera</label>
              <select id="size_user" v-model="form.size_user" class="input" required :disabled="loading">
                <option value="" disabled>Selecciona tu talla</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
                <option>XXL</option>
              </select>
            </div>

            <div class="checkline">
              <input id="terms" v-model="accepted" type="checkbox" required :disabled="loading" />
              <label for="terms">
                Acepto los
                <a href="#" @click.prevent="showTermsModal = true">términos y aviso de privacidad</a>
              </label>
            </div>
          </template>

          <!-- Navegación -->
          <div class="nav">
            <button 
              v-if="step > 0" 
              type="button" 
              class="btn ghost" 
              @click="prevStep"
              :disabled="loading"
            >
              Atrás
            </button>
            <button 
              v-if="isLastStep" 
              type="submit" 
              class="btn" 
              :disabled="loading || !canSubmit"
              :aria-busy="loading"
            >
              <span v-if="loading">Creando cuenta…</span>
              <span v-else>Crear cuenta</span>
            </button>
            <button 
              v-else 
              type="submit" 
              class="btn" 
              :disabled="loading || !canProceed"
            >
              Continuar
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

<script setup>
import { definePageMeta } from '#imports'
import { useRegister } from '@/composables/auth/use-register'
import SvgIcon from '@jamescoyle/vue-icon'
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
} from '@mdi/js'
import FlagIcon from "@/components/atoms/flag-icon.vue"
import '@/assets/css/styles/auth/register.css'

definePageMeta({
  name: 'register',
  path: '/register',
  alias: ['/register'],
  guestOnly: true,
})

const {
  // Estados
  step,
  showPass,
  showPass2,
  showSecretPass,
  password2,
  loading,
  accepted,
  showTermsModal,
  passwordTouched,
  secretValidated,
  secretValidating,
  stepperRef,
  form,
  steps,
  isOpen,
  selectedCountryCode,
  emergencyCountryCode,
  countries,
  
  // Computed
  isSpeaker,
  isStudentOrTeacher,
  isSecretPasswordValid,
  reqs,
  pwdMatch,
  strengthScore,
  strengthPercent,
  strengthLabel,
  isLastStep,
  canSubmit,
  canProceed,
  
  // Métodos
  touchPwd,
  centerActiveStep,
  prevStep,
  goLogin,
  toggleDropdown,
  selectCountry,
  getPhoneCode,
  nextOrSubmit
} = useRegister()
</script>