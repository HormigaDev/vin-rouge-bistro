<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    persistent
  >
    <q-card style="min-width: 500px; max-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 title">{{ isEdit ? 'Editar Item' : 'Adicionar Item' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('update:model-value', false)" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-select
            v-model="formData.dishId"
            :options="dishOptions"
            option-value="value"
            option-label="label"
            label="Prato *"
            filled
            emit-value
            map-options
            :rules="[(val) => !!val || 'Selecione um prato']"
            class="q-mb-md"
          />

          <q-input
            v-model.number="formData.qty"
            type="number"
            label="Quantidade *"
            filled
            min="1"
            :rules="[
              (val) => !!val || 'Quantidade é obrigatória',
              (val) => val > 0 || 'Quantidade deve ser maior que zero',
            ]"
            class="q-mb-md"
          />

          <div v-if="selectedDish" class="q-pa-md bg-grey-2 rounded-borders">
            <div class="row justify-between items-center">
              <div class="text-body2 text-grey-7">Preço unitário:</div>
              <div class="text-h6 text-primary">R$ {{ formatPrice(selectedDish.price) }}</div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row justify-between items-center">
              <div class="text-body1"><strong>Subtotal:</strong></div>
              <div class="text-h6 text-secondary">R$ {{ formatPrice(subtotal) }}</div>
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn
              label="Cancelar"
              flat
              color="grey-7"
              @click="$emit('update:model-value', false)"
            />
            <q-btn label="Salvar" type="submit" color="primary" unelevated />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  dishes: {
    type: Array,
    required: true,
  },
  item: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:model-value', 'save'])

const isEdit = computed(() => !!props.item)

const formData = ref({
  dishId: null,
  qty: 1,
})

const dishOptions = computed(() => {
  return props.dishes
    .filter((d) => d.available)
    .map((d) => ({
      label: `${d.name} - R$ ${formatPrice(d.price)}`,
      value: d.id,
    }))
})

const selectedDish = computed(() => {
  return props.dishes.find((d) => d.id === formData.value.dishId)
})

const subtotal = computed(() => {
  if (!selectedDish.value) return 0
  return selectedDish.value.price * formData.value.qty
})

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formData.value = {
        dishId: newItem.dishId,
        qty: newItem.qty,
      }
    } else {
      formData.value = {
        dishId: null,
        qty: 1,
      }
    }
  },
  { immediate: true },
)

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',')
}

function handleSubmit() {
  if (!selectedDish.value) return

  const item = {
    dishId: formData.value.dishId,
    dishName: selectedDish.value.name,
    qty: formData.value.qty,
    unitPrice: selectedDish.value.price,
    subtotal: subtotal.value,
  }

  emit('save', item)
  emit('update:model-value', false)
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
