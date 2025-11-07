<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="title text-primary q-my-none">
          {{ isEdit ? 'Editar Ingrediente' : 'Novo Ingrediente' }}
        </h4>
        <p class="text-grey-7">Preencha as informações do ingrediente</p>
      </div>
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.push('/ingredients')" />
    </div>

    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Nome -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.name"
                label="Nome do Ingrediente *"
                filled
                :rules="[(val) => !!val || 'Nome é obrigatório']"
              />
            </div>

            <!-- Unidade -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="formData.unit"
                :options="['kg', 'litro', 'unidade', 'dúzia', 'grama', 'ml']"
                label="Unidade *"
                filled
                :rules="[(val) => !!val || 'Unidade é obrigatória']"
              />
            </div>

            <!-- Estoque -->
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="formData.stock"
                type="number"
                label="Quantidade em Estoque *"
                filled
                step="0.01"
                min="0"
                :rules="[
                  (val) => (val !== null && val !== '') || 'Estoque é obrigatório',
                  (val) => val >= 0 || 'Estoque não pode ser negativo',
                ]"
              >
                <template v-slot:hint>
                  <span v-if="formData.stock < formData.minStock" class="text-negative">
                    <q-icon name="warning" /> Alerta: Estoque abaixo do mínimo!
                  </span>
                  <span v-else-if="formData.stock < formData.minStock * 2" class="text-warning">
                    <q-icon name="info" /> Estoque baixo
                  </span>
                </template>
              </q-input>
            </div>

            <!-- Estoque Mínimo -->
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="formData.minStock"
                type="number"
                label="Estoque Mínimo *"
                filled
                step="0.01"
                min="0"
                :rules="[
                  (val) => (val !== null && val !== '') || 'Estoque mínimo é obrigatório',
                  (val) => val >= 0 || 'Estoque mínimo não pode ser negativo',
                ]"
              />
            </div>

            <!-- Custo -->
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="formData.cost"
                type="number"
                label="Preço de Custo (R$) *"
                filled
                step="0.01"
                min="0"
                :rules="[
                  (val) => (val !== null && val !== '') || 'Custo é obrigatório',
                  (val) => val >= 0 || 'Custo não pode ser negativo',
                ]"
              />
            </div>

            <!-- Informações calculadas -->
            <div class="col-12">
              <q-banner class="bg-grey-2 rounded-borders">
                <template v-slot:avatar>
                  <q-icon name="info" color="info" />
                </template>
                <div class="text-body2">
                  <strong>Valor total em estoque:</strong>
                  R$ {{ formatPrice((formData.stock || 0) * (formData.cost || 0)) }}
                </div>
              </q-banner>
            </div>
          </div>

          <!-- Botões de ação -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Cancelar" flat color="grey-7" @click="$router.push('/ingredients')" />
            <q-btn label="Salvar" type="submit" color="primary" unelevated :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { getIngredientById, createIngredient, updateIngredient } from 'stores/mock'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const ingredientId = computed(() => route.params.id)
const isEdit = computed(() => !!ingredientId.value)

const loading = ref(false)

const formData = ref({
  name: '',
  unit: 'kg',
  stock: 0,
  minStock: 0,
  cost: 0,
})

onMounted(async () => {
  if (isEdit.value) {
    await loadIngredient()
  }
})

async function loadIngredient() {
  try {
    const ingredient = await getIngredientById(ingredientId.value)
    if (ingredient) {
      formData.value = { ...ingredient }
    } else {
      $q.notify({
        type: 'negative',
        message: 'Ingrediente não encontrado',
        icon: 'error',
        position: 'top',
      })
      router.push('/ingredients')
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar ingrediente',
      icon: 'error',
      position: 'top',
    })
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    if (isEdit.value) {
      await updateIngredient(ingredientId.value, formData.value)
      $q.notify({
        type: 'positive',
        message: 'Ingrediente atualizado com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
    } else {
      await createIngredient(formData.value)
      $q.notify({
        type: 'positive',
        message: 'Ingrediente criado com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
    }
    router.push('/ingredients')
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar ingrediente',
      icon: 'error',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
h4 {
  font-size: 1.75rem;
}

.rounded-borders {
  border-radius: 8px;
}
</style>
