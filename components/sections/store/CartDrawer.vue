<script setup lang="ts">
import { X } from "lucide-vue-next";

const props = defineProps<{
  modelValue: boolean;
  items: any[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:items", value: any[]): void;
}>();

function close() {
  emit("update:modelValue", false);
}

function removeItem(index: number) {
  const newItems = [...props.items];
  newItems.splice(index, 1);
  emit("update:items", newItems);
}
</script>

<template>
  <v-navigation-drawer
    v-model="props.modelValue"
    location="right"
    temporary
    width="380"
  >
    <!-- Header -->
    <div class="d-flex align-center justify-space-between pa-4 border-b">
      <h3 class="text-h6 font-weight-bold">Mi carrito</h3>
      <v-btn icon variant="text" @click="close">
        <X :size="20" stroke-width="2" />
      </v-btn>
    </div>

    <!-- Contenido -->
    <div class="pa-4">
      <div v-if="props.items.length === 0" class="text-medium-emphasis">
        Tu carrito está vacío
      </div>

      <v-list v-else>
        <v-list-item
          v-for="(item, i) in props.items"
          :key="i"
          class="d-flex align-center"
        >
          <v-img
            :src="item.image"
            height="56"
            width="56"
            class="rounded-lg mr-3"
            cover
          />
          <div class="flex-grow-1">
            <div class="font-weight-medium">{{ item.title }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ item.qty }} × ${{ item.unitPrice }}
            </div>
          </div>
          <v-btn icon variant="text" color="red" @click="removeItem(i)">
            <X :size="16" />
          </v-btn>
        </v-list-item>
      </v-list>
    </div>

    <!-- Footer -->
    <div class="pa-4 border-t">
      <v-btn block color="primary" :disabled="props.items.length === 0">
        Proceder al pago
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
