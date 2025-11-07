<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="title text-primary q-my-none">
          {{ isEdit ? 'Editar Prato' : 'Novo Prato' }}
        </h4>
        <p class="text-grey-7">Preencha as informações do prato</p>
      </div>
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.push('/dishes')" />
    </div>

    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Nome -->
            <div class="col-12 col-md-8">
              <q-input
                v-model="formData.name"
                label="Nome do Prato *"
                filled
                :rules="[(val) => !!val || 'Nome é obrigatório']"
              />
            </div>

            <!-- Categoria -->
            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.category"
                :options="['Entrada', 'Principal', 'Sobremesa']"
                label="Categoria *"
                filled
                :rules="[(val) => !!val || 'Categoria é obrigatória']"
              />
            </div>

            <!-- Preço -->
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="formData.price"
                type="number"
                label="Preço (R$) *"
                filled
                step="0.01"
                min="0"
                :rules="[
                  (val) => (val !== null && val !== '') || 'Preço é obrigatório',
                  (val) => val > 0 || 'Preço deve ser maior que zero',
                ]"
              />
            </div>

            <!-- Disponibilidade -->
            <div class="col-12 col-md-4">
              <q-toggle
                v-model="formData.available"
                label="Prato disponível"
                color="positive"
                class="q-mt-md"
              />
            </div>

            <!-- URL da Imagem -->
            <div class="col-12 col-md-4">
              <q-input
                v-model="formData.image"
                label="URL da Imagem"
                filled
                hint="URL de uma imagem do prato"
              />
            </div>

            <!-- Descrição -->
            <div class="col-12">
              <q-input
                v-model="formData.description"
                label="Descrição"
                filled
                type="textarea"
                rows="3"
                hint="Descrição detalhada do prato"
              />
            </div>

            <!-- Ingredientes -->
            <div class="col-12">
              <q-select
                v-model="formData.ingredients"
                :options="ingredientOptions"
                option-value="value"
                option-label="label"
                label="Ingredientes *"
                filled
                multiple
                emit-value
                map-options
                use-chips
                :rules="[(val) => (val && val.length > 0) || 'Selecione pelo menos um ingrediente']"
              >
                <template v-slot:hint> Selecione os principais ingredientes do prato </template>
              </q-select>
            </div>

            <!-- Preview da imagem -->
            <div v-if="formData.image" class="col-12">
              <div class="text-subtitle2 q-mb-sm">Preview da Imagem:</div>
              <q-img
                :src="formData.image"
                style="max-width: 400px; border-radius: 8px"
                @error="imageError = true"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    Erro ao carregar imagem
                  </div>
                </template>
              </q-img>
            </div>
          </div>

          <!-- Botões de ação -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Cancelar" flat color="grey-7" @click="$router.push('/dishes')" />
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
import { getDishById, createDish, updateDish, getIngredients } from 'stores/mock'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const dishId = computed(() => route.params.id)
const isEdit = computed(() => !!dishId.value)

const loading = ref(false)
const imageError = ref(false)
const ingredients = ref([])

const formData = ref({
  name: '',
  category: 'Principal',
  price: 0,
  description: '',
  ingredients: [],
  available: true,
  image: '',
})

const ingredientOptions = computed(() => {
  return ingredients.value.map((i) => ({
    label: `${i.name} (${i.stock} ${i.unit})`,
    value: i.id,
  }))
})

onMounted(async () => {
  await loadIngredients()
  if (isEdit.value) {
    await loadDish()
  }
})

async function loadIngredients() {
  ingredients.value = await getIngredients()
}

async function loadDish() {
  try {
    const dish = await getDishById(dishId.value)
    if (dish) {
      formData.value = { ...dish }
    } else {
      $q.notify({
        type: 'negative',
        message: 'Prato não encontrado',
        icon: 'error',
        position: 'top',
      })
      router.push('/dishes')
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar prato',
      icon: 'error',
      position: 'top',
    })
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    if (isEdit.value) {
      await updateDish(dishId.value, formData.value)
      $q.notify({
        type: 'positive',
        message: 'Prato atualizado com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
    } else {
      await createDish(formData.value)
      $q.notify({
        type: 'positive',
        message: 'Prato criado com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
    }
    router.push('/dishes')
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar prato',
      icon: 'error',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
h4 {
  font-size: 1.75rem;
}
</style>
