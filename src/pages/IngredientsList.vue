<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="title text-primary q-my-none">Ingredientes</h4>
        <p class="text-grey-7">Gerencie o estoque de ingredientes</p>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Novo Ingrediente"
        unelevated
        @click="$router.push('/ingredients/new')"
      />
    </div>

    <!-- Filtro -->
    <q-card class="q-mb-md">
      <q-card-section>
        <q-input v-model="searchFilter" label="Buscar por nome" filled dense clearable>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-table
      :rows="filteredIngredients"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10, 20, 50]"
      flat
      bordered
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div class="row items-center">
            <q-icon
              v-if="props.row.stock < props.row.minStock"
              name="warning"
              color="negative"
              size="20px"
              class="q-mr-sm"
            >
              <q-tooltip>Estoque abaixo do mínimo!</q-tooltip>
            </q-icon>
            <q-icon
              v-else-if="props.row.stock < props.row.minStock * 2"
              name="info"
              color="warning"
              size="20px"
              class="q-mr-sm"
            >
              <q-tooltip>Estoque baixo!</q-tooltip>
            </q-icon>
            <span
              :class="{
                'text-negative text-bold': props.row.stock < props.row.minStock,
                'text-warning':
                  props.row.stock < props.row.minStock * 2 && props.row.stock >= props.row.minStock,
              }"
            >
              {{ props.row.name }}
            </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-stock="props">
        <q-td :props="props">
          <q-badge
            :color="getStockColor(props.row.stock, props.row.minStock)"
            :label="`${props.row.stock} ${props.row.unit}`"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-minStock="props">
        <q-td :props="props">
          <span class="text-grey-7">{{ props.row.minStock }} {{ props.row.unit }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-cost="props">
        <q-td :props="props">
          <span class="text-bold text-secondary">R$ {{ formatPrice(props.row.cost) }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            icon="visibility"
            color="primary"
            size="sm"
            @click="handleView(props.row)"
          >
            <q-tooltip>Ver Detalhes</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="edit"
            color="secondary"
            size="sm"
            @click="handleEdit(props.row)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="delete"
            color="negative"
            size="sm"
            @click="handleDelete(props.row)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog de confirmação de exclusão -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="48px" class="q-mr-md" />
          <span class="text-h6">Confirmar Exclusão</span>
        </q-card-section>

        <q-card-section>
          Tem certeza que deseja excluir o ingrediente
          <strong>{{ ingredientToDelete?.name }}</strong
          >?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn flat label="Excluir" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Master Detail -->
    <MasterDetail
      v-model="showDetail"
      :title="selectedIngredient?.name || 'Detalhes do Ingrediente'"
      width="500px"
    >
      <template v-if="selectedIngredient">
        <div class="q-col-gutter-md">
          <!-- Status do estoque -->
          <div
            class="q-pa-md rounded-borders"
            :class="getStockBgClass(selectedIngredient.stock, selectedIngredient.minStock)"
          >
            <div class="row items-center">
              <q-icon
                :name="getStockIcon(selectedIngredient.stock, selectedIngredient.minStock)"
                :color="getStockColor(selectedIngredient.stock, selectedIngredient.minStock)"
                size="32px"
                class="q-mr-md"
              />
              <div>
                <div class="text-caption">Status do Estoque</div>
                <div class="text-body1 text-bold">
                  {{ getStockStatus(selectedIngredient.stock, selectedIngredient.minStock) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Informações de estoque -->
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-caption text-grey-7">Estoque Atual</div>
              <div
                class="text-h5"
                :class="`text-${getStockColor(selectedIngredient.stock, selectedIngredient.minStock)}`"
              >
                {{ selectedIngredient.stock }} {{ selectedIngredient.unit }}
              </div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-7">Estoque Mínimo</div>
              <div class="text-h5 text-grey-7">
                {{ selectedIngredient.minStock }} {{ selectedIngredient.unit }}
              </div>
            </div>
          </div>

          <q-separator />

          <!-- Unidade e custo -->
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-caption text-grey-7">Unidade de Medida</div>
              <q-chip color="info" text-color="white" dense>
                {{ selectedIngredient.unit }}
              </q-chip>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-7">Custo Unitário</div>
              <div class="text-h6 text-secondary">
                R$ {{ formatPrice(selectedIngredient.cost) }}
              </div>
            </div>
          </div>

          <q-separator />

          <!-- Valor em estoque -->
          <div class="q-pa-md bg-grey-2 rounded-borders">
            <div class="row justify-between items-center">
              <span class="text-body1">Valor Total em Estoque:</span>
              <span class="text-h5 text-primary">
                R$ {{ formatPrice(selectedIngredient.stock * selectedIngredient.cost) }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <template #actions>
        <q-btn flat label="Fechar" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          label="Editar"
          color="primary"
          icon="edit"
          @click="handleEditFromDetail"
        />
      </template>
    </MasterDetail>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getIngredients, deleteIngredient } from 'stores/mock'
import MasterDetail from 'components/MasterDetail.vue'

defineOptions({
  name: 'IngredientsListPage',
})

const router = useRouter()
const $q = useQuasar()

const ingredients = ref([])
const searchFilter = ref('')
const deleteDialog = ref(false)
const ingredientToDelete = ref(null)
const showDetail = ref(false)
const selectedIngredient = ref(null)

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'stock', label: 'Estoque Atual', field: 'stock', align: 'center', sortable: true },
  { name: 'minStock', label: 'Estoque Mínimo', field: 'minStock', align: 'center', sortable: true },
  { name: 'unit', label: 'Unidade', field: 'unit', align: 'center', sortable: true },
  { name: 'cost', label: 'Custo', field: 'cost', align: 'right', sortable: true },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const filteredIngredients = computed(() => {
  if (!searchFilter.value) {
    return ingredients.value
  }
  return ingredients.value.filter((i) =>
    i.name.toLowerCase().includes(searchFilter.value.toLowerCase()),
  )
})

onMounted(async () => {
  await loadIngredients()
})

async function loadIngredients() {
  ingredients.value = await getIngredients()
}

function getStockColor(stock, minStock) {
  if (stock < minStock) return 'negative'
  if (stock < minStock * 2) return 'warning'
  return 'positive'
}

function handleEdit(ingredient) {
  router.push(`/ingredients/${ingredient.id}`)
}

function handleView(ingredient) {
  selectedIngredient.value = ingredient
  showDetail.value = true
}

function handleEditFromDetail() {
  showDetail.value = false
  router.push(`/ingredients/${selectedIngredient.value.id}`)
}

function handleDelete(ingredient) {
  ingredientToDelete.value = ingredient
  deleteDialog.value = true
}

async function confirmDelete() {
  try {
    await deleteIngredient(ingredientToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Ingrediente excluído com sucesso',
      icon: 'check_circle',
      position: 'top',
    })
    await loadIngredients()
    deleteDialog.value = false
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao excluir ingrediente',
      icon: 'error',
      position: 'top',
    })
  }
}

function formatPrice(price) {
  if (price === undefined || price === null) return '0,00'
  return price.toFixed(2).replace('.', ',')
}

function getStockStatus(stock, minStock) {
  if (stock < minStock) return 'Estoque Crítico'
  if (stock < minStock * 2) return 'Estoque Baixo'
  return 'Estoque Normal'
}

function getStockIcon(stock, minStock) {
  if (stock < minStock) return 'error'
  if (stock < minStock * 2) return 'warning'
  return 'check_circle'
}

function getStockBgClass(stock, minStock) {
  if (stock < minStock) return 'bg-red-1'
  if (stock < minStock * 2) return 'bg-orange-1'
  return 'bg-green-1'
}
</script>

<style scoped>
h4 {
  font-size: 1.75rem;
}
</style>
