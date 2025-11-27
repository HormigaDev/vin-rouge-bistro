<template>
  <q-dialog
    v-model="isOpen"
    position="right"
    full-height
    :maximized="$q.screen.lt.md"
    transition-show="slide-left"
    transition-hide="slide-right"
    @hide="handleClose"
  >
    <q-card class="master-detail-card" :style="cardStyle">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none bg-primary text-white">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <!-- Content Slot -->
      <q-card-section class="master-detail-content q-pa-md">
        <slot></slot>
      </q-card-section>

      <!-- Actions Slot -->
      <template v-if="$slots.actions">
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <slot name="actions"></slot>
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Detalhes',
  },
  width: {
    type: String,
    default: '500px',
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const cardStyle = computed(() => ({
  width: $q.screen.lt.md ? '100%' : props.width,
  maxWidth: '100%',
  height: '100vh',
  borderRadius: 0,
}))

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.master-detail-card {
  display: flex;
  flex-direction: column;
}

.master-detail-content {
  flex: 1;
  overflow-y: auto;
}
</style>
