<template>
  <div class="filter-group">
    <label v-if="label" class="filter-label">{{ label }}</label>

    <div class="select-wrap">
      <select
        class="filter-select"
        :value="modelValue"
        @change="onChange"
      >
        <option value="">Todos</option>
        <option
          v-for="opt in normalized"
          :key="opt"
          :value="opt"
        >
          {{ opt }}
        </option>
      </select>
      <span class="chev">▾</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'

type Props = {
  label?: string
  options?: (string | number)[]
  modelValue?: string | number
}

const props = defineProps<Props>()
const emit  = defineEmits<{ (e:'update:model-value', v:string | number): void }>()

const normalized = computed(() =>
  Array.isArray(props.options) ? props.options.map(String).filter(Boolean) : []
)

function onChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  emit('update:model-value', val)
}

// para usar label/modelValue directo en el template
const { label, modelValue } = toRefs(props)
</script>

<style scoped>
.filter-group{display:flex;flex-direction:column;gap:.35rem;min-width:160px}
.filter-label{font-size:.78rem;font-weight:700;color:#0b1534;opacity:.8}
.select-wrap{position:relative;display:flex}
.filter-select{
  appearance:none;width:100%;padding:.55rem .9rem;border:1px solid #e5e7eb;
  border-radius:.65rem;background:#fff;outline:none;font-size:.9rem;color:#0b1534;
}
.filter-select:focus{border-color:#00B394;box-shadow:0 0 0 3px rgba(0,179,148,.15)}
.chev{position:absolute;right:.6rem;top:50%;transform:translateY(-50%);pointer-events:none;opacity:.6}
</style>
