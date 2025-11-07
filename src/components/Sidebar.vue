<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    show-if-above
    bordered
    :width="280"
    class="bg-dark text-white"
  >
    <q-scroll-area class="fit">
      <div class="q-pa-md text-center">
        <img src="/assets/logo.svg" alt="Vin Rouge" style="width: 80px; margin-bottom: 8px" />
        <div class="title text-h6 text-secondary">Vin Rouge Bistrô</div>
        <div class="text-caption text-grey-5">Gestão Gourmet</div>
      </div>

      <q-separator class="q-my-md" color="grey-8" />

      <q-list>
        <q-item
          v-for="item in menuItems"
          :key="item.label"
          clickable
          :to="item.link"
          active-class="text-secondary"
          class="text-white"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" color="secondary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator class="q-my-md" color="grey-8" />

      <div class="q-pa-md text-caption text-grey-5">
        <div>© 2025 Vin Rouge Bistrô</div>
        <div class="q-mt-xs">v1.0.0</div>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'AppSidebar',
})

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['update:model-value'])

const menuItems = ref([
  {
    label: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard',
  },
  {
    label: 'Pratos do Menu',
    icon: 'restaurant_menu',
    link: '/dishes',
  },
  {
    label: 'Ingredientes',
    icon: 'inventory_2',
    link: '/ingredients',
  },
  {
    label: 'Comandas',
    icon: 'receipt_long',
    link: '/orders',
  },
  {
    label: 'Reservas',
    icon: 'event',
    link: '/reservations',
  },
])
</script>

<style scoped>
.q-item {
  border-radius: 8px;
  margin: 4px 12px;
}

.q-item:hover {
  background-color: rgba(128, 0, 32, 0.1);
}
</style>
