<template>
  <div class="table-container">
    <!-- ===== Header ===== -->
    <div class="header">
      <h1 class="title">Cronograma del Congreso</h1>
      <p class="subtitle">Gestiona la programación de los 3 días del evento</p>
    </div>

    <div class="hr-line"></div>

    <!-- ===== Filtros + acciones ===== -->
    <div class="actions-bar">
      <div class="mini-select" ref="dayRef">
        <button class="mini-trigger" type="button" @click="toggleDay">
          <span>{{ selectedDayLabel }}</span>
          <svg class="chev" viewBox="0 0 24 24" width="18" height="18">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        <transition name="ms">
          <ul v-if="dayOpen" class="mini-options">
            <li
              v-for="(opt, i) in dayOptions"
              :key="opt.value"
              class="mini-option"
              :class="{ active: i === dayActive, selected: opt.value === selectedDay }"
              @mouseenter="dayActive = i"
              @mousedown.prevent.stop="pickDay(opt.value)"
            >
              {{ opt.label }}
            </li>
          </ul>
        </transition>
      </div>

      <div class="actions-right">
        <button type="button" class="btn-outline" @click="exportSchedule">
          <i class="mdi mdi-download"></i>
          Exportar
        </button>

        <button type="button" class="btn-add" @click="onClickNewActivity">
          <i class="mdi mdi-plus"></i>
          Nueva Actividad
        </button>
      </div>
    </div>

    <div class="hr-line"></div>

    <!-- ===== Lista del día ===== -->
    <section class="sched">
      <header class="sched-head">
        <h2 class="sched-title">{{ selectedDayTitle }}</h2>
        <div class="sched-date">{{ selectedDayDate }}</div>
      </header>

      <ul class="sched-list">
        <li v-for="item in currentItems" :key="item.id" class="sched-item">
          <div class="sched-card">
            <span class="type-badge" :class="badgeClass(item.type)">
              {{ typeLabel(item.type) }}
            </span>

            <div class="sched-left">
              <div :class="['sched-icon', iconClass(item.type)]">
                <i :class="['mdi', item.icon || 'mdi-calendar-blank']"></i>
              </div>

              <div class="sched-content">
                <div class="sched-row">
                  <h3 class="sched-item-title">{{ item.title }}</h3>
                  <button class="edit-btn" @click="onEdit(item)">
                    <i class="mdi mdi-pencil"></i>
                  </button>
                </div>

                <div class="sched-meta">
                  <span class="meta"><i class="mdi mdi-clock-outline"></i>{{ item.time }}</span>
                  <span class="dot"></span>
                  <span class="meta"><i class="mdi mdi-map-marker-outline"></i>{{ item.place }}</span>
                  <span class="dot" v-if="item.speaker"></span>
                  <span class="meta" v-if="item.speaker"><i class="mdi mdi-account-outline"></i>{{ item.speaker }}</span>
                </div>

                <p class="sched-desc" v-if="item.description">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- ===== MODAL NUEVA ACTIVIDAD ===== -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="showNew" class="overlay" role="dialog" aria-modal="true" @keydown.esc="closeNew">
          <div class="backdrop" @click="closeNew"></div>
          <div class="modal-shell" ref="modalRef" tabindex="-1" autofocus>
            <NewActivity
              :day="selectedDay"
              :label="selectedDayLabel"
              :date="selectedDayDate"
              @cancel="closeNew"
              @created="handleCreated"
            />
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import '@mdi/font/css/materialdesignicons.min.css'
import '@/assets/css/styles/admin/schedule.css'
import NewActivity from '@/components/admin/new-activity.vue'
import { useScheduleStatic } from '@/composables/admin/use-schedule-static'

definePageMeta({
  name: 'admin-schedule',
  path: '/admin/schedule',
  alias: ['/admin-schedule'],
  requiresAuth: true
})

// Toda la lógica separada en el composable
const {
  dayOptions, dayDates,
  selectedDay, selectedDayLabel, selectedDayTitle, selectedDayDate,
  dayOpen, dayActive, dayRef, toggleDay, pickDay,

  showNew, modalRef, onClickNewActivity, closeNew,
  currentItems, badgeClass, iconClass, typeLabel,
  onEdit, exportSchedule, handleCreated
} = useScheduleStatic()
</script>
