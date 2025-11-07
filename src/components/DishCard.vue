<template>
  <q-card class="dish-card" flat bordered>
    <q-img
      :src="dish.image || 'https://via.placeholder.com/400x300?text=Prato'"
      :ratio="4 / 3"
      class="dish-image"
    >
      <div class="absolute-bottom-right q-pa-xs">
        <q-badge v-if="!dish.available" color="negative" label="Indisponível" />
        <q-badge v-else color="positive" label="Disponível" />
      </div>
    </q-img>

    <q-card-section>
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-h6 title">{{ dish.name }}</div>
        <q-chip color="secondary" text-color="dark" size="sm">
          {{ dish.category }}
        </q-chip>
      </div>

      <div class="text-body2 text-grey-7 q-mb-md" style="min-height: 60px">
        {{ dish.description || 'Sem descrição' }}
      </div>

      <div class="row items-center justify-between">
        <div class="text-h5 text-primary">R$ {{ formatPrice(dish.price) }}</div>

        <div class="row q-gutter-xs">
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="visibility"
            color="primary"
            @click="$emit('view', dish)"
          >
            <q-tooltip>Ver detalhes</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="edit"
            color="secondary"
            @click="$emit('edit', dish)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            size="sm"
            icon="delete"
            color="negative"
            @click="$emit('delete', dish)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  dish: {
    type: Object,
    required: true,
  },
})

defineEmits(['view', 'edit', 'delete'])

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.dish-card {
  border-radius: 8px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.dish-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.dish-image {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
