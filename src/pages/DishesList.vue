<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="title text-primary q-my-none">Pratos do Menu</h4>
        <p class="text-grey-7">Gerencie os pratos do seu restaurante</p>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Novo Prato"
        unelevated
        @click="$router.push('/dishes/new')"
      />
    </div>

    <!-- Filtros -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="filters.search" label="Buscar por nome" filled dense clearable>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.category"
              :options="categoryOptions"
              label="Categoria"
              filled
              dense
              clearable
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.available"
              :options="availabilityOptions"
              label="Disponibilidade"
              filled
              dense
              clearable
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- View Toggle -->
    <div class="row justify-end q-mb-sm">
      <q-btn-toggle
        v-model="viewMode"
        spread
        no-caps
        unelevated
        toggle-color="primary"
        :options="[
          { label: 'Cards', value: 'cards', icon: 'view_module' },
          { label: 'Tabela', value: 'table', icon: 'view_list' },
        ]"
      />
    </div>

    <!-- Card View -->
    <div v-if="viewMode === 'cards'" class="row q-col-gutter-md">
      <div v-for="dish in filteredDishes" :key="dish.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <DishCard :dish="dish" @edit="handleEdit" @delete="handleDelete" @view="handleView" />
      </div>
    </div>

    <!-- Table View -->
    <q-table
      v-else
      :rows="filteredDishes"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10, 20, 50]"
      flat
      bordered
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-avatar rounded size="50px">
            <img :src="props.row.image || 'https://via.placeholder.com/50'" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-price="props">
        <q-td :props="props">
          <span class="text-primary text-bold"> R$ {{ formatPrice(props.row.price) }} </span>
        </q-td>
      </template>

      <template v-slot:body-cell-available="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.available ? 'positive' : 'negative'"
            :label="props.row.available ? 'Disponível' : 'Indisponível'"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
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
          Tem certeza que deseja excluir o prato <strong>{{ dishToDelete?.name }}</strong
          >?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn flat label="Excluir" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getDishes, deleteDish } from 'stores/mock'
import DishCard from 'components/DishCard.vue'

const router = useRouter()
const $q = useQuasar()

const dishes = ref([])
const viewMode = ref('cards')
const deleteDialog = ref(false)
const dishToDelete = ref(null)

const filters = ref({
  search: '',
  category: null,
  available: null,
})

const categoryOptions = ['Entrada', 'Principal', 'Sobremesa']
const availabilityOptions = [
  { label: 'Disponível', value: true },
  { label: 'Indisponível', value: false },
]

const columns = [
  { name: 'image', label: '', field: 'image', align: 'center' },
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left', sortable: true },
  { name: 'price', label: 'Preço', field: 'price', align: 'right', sortable: true },
  {
    name: 'available',
    label: 'Disponibilidade',
    field: 'available',
    align: 'center',
    sortable: true,
  },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const filteredDishes = computed(() => {
  let result = dishes.value

  if (filters.value.search) {
    result = result.filter((d) => d.name.toLowerCase().includes(filters.value.search.toLowerCase()))
  }

  if (filters.value.category) {
    result = result.filter((d) => d.category === filters.value.category)
  }

  if (filters.value.available !== null) {
    result = result.filter((d) => d.available === filters.value.available.value)
  }

  return result
})

onMounted(async () => {
  await loadDishes()
})

async function loadDishes() {
  dishes.value = await getDishes()
}

function handleEdit(dish) {
  router.push(`/dishes/${dish.id}`)
}

function handleView(dish) {
  router.push(`/dishes/${dish.id}`)
}

function handleDelete(dish) {
  dishToDelete.value = dish
  deleteDialog.value = true
}

async function confirmDelete() {
  try {
    await deleteDish(dishToDelete.value.id)
    $q.notify({
      type: 'positive',
      message: 'Prato excluído com sucesso',
      icon: 'check_circle',
      position: 'top',
    })
    await loadDishes()
    deleteDialog.value = false
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao excluir prato',
      icon: 'error',
      position: 'top',
    })
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
</style>
