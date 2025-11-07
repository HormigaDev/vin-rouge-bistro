<template>
  <q-page class="q-pa-md">
    <div v-if="order" class="q-gutter-md">
      <!-- Cabeçalho -->
      <div class="row items-center justify-between">
        <div>
          <h4 class="title text-primary q-my-none">Comanda #{{ order.id }}</h4>
          <p class="text-grey-7">Detalhes da comanda</p>
        </div>
        <q-btn flat icon="arrow_back" label="Voltar" @click="$router.push('/orders')" />
      </div>

      <!-- Informações da comanda (Mestre) -->
      <q-card>
        <q-card-section>
          <div class="text-h6 title q-mb-md">Informações da Comanda</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-7">Cliente</div>
              <div class="text-body1 text-bold">{{ order.client }}</div>
            </div>

            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-7">Mesa</div>
              <div class="text-body1 text-bold">Mesa {{ order.table }}</div>
            </div>

            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-7">Status</div>
              <q-badge
                :color="getStatusColor(order.status)"
                :label="order.status"
                class="q-mt-xs"
              />
            </div>

            <div class="col-12 col-md-3">
              <div class="text-caption text-grey-7">Horário</div>
              <div class="text-body1">{{ formatDateTime(order.createdAt) }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-gutter-sm">
            <q-btn
              v-if="order.status === 'Em preparação'"
              unelevated
              color="positive"
              icon="check"
              label="Marcar como Servido"
              @click="updateStatus('Servido')"
            />
            <q-btn
              v-if="order.status !== 'Cancelado'"
              unelevated
              color="negative"
              icon="close"
              label="Cancelar Comanda"
              @click="updateStatus('Cancelado')"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Itens da comanda (Detalhe) -->
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 title">Itens da Comanda</div>
            <q-btn
              v-if="order.status === 'Em preparação'"
              color="secondary"
              icon="add"
              label="Adicionar Item"
              unelevated
              @click="showItemModal = true"
            />
          </div>

          <q-table
            :rows="order.items"
            :columns="itemColumns"
            row-key="dishId"
            flat
            :hide-pagination="order.items.length <= 10"
          >
            <template v-slot:body-cell-dishName="props">
              <q-td :props="props">
                <div class="text-bold">{{ props.row.dishName }}</div>
              </q-td>
            </template>

            <template v-slot:body-cell-unitPrice="props">
              <q-td :props="props"> R$ {{ formatPrice(props.row.unitPrice) }} </q-td>
            </template>

            <template v-slot:body-cell-subtotal="props">
              <q-td :props="props">
                <span class="text-bold text-primary">
                  R$ {{ formatPrice(props.row.subtotal) }}
                </span>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  v-if="order.status === 'Em preparação'"
                  flat
                  dense
                  round
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click="removeItem(props.rowIndex)"
                >
                  <q-tooltip>Remover item</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <q-separator class="q-my-md" />

          <div class="row justify-end">
            <div class="q-pa-md bg-grey-2 rounded-borders" style="min-width: 250px">
              <div class="row justify-between items-center q-mb-sm">
                <span class="text-body1">Subtotal:</span>
                <span class="text-h6">R$ {{ formatPrice(order.total) }}</span>
              </div>
              <q-separator class="q-my-sm" />
              <div class="row justify-between items-center">
                <span class="text-h6"><strong>Total:</strong></span>
                <span class="text-h5 text-secondary">R$ {{ formatPrice(order.total) }}</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Loading state -->
    <div v-else class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="50px" />
    </div>

    <!-- Modal para adicionar item -->
    <OrderModal v-model="showItemModal" :dishes="dishes" @save="addItem" />

    <!-- Dialog de confirmação de remoção -->
    <q-dialog v-model="removeDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="48px" class="q-mr-md" />
          <span class="text-h6">Confirmar Remoção</span>
        </q-card-section>

        <q-card-section> Tem certeza que deseja remover este item da comanda? </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn flat label="Remover" color="negative" @click="confirmRemove" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import {
  getOrderById,
  updateOrderStatus,
  addOrderItem,
  removeOrderItem,
  getDishes,
} from 'stores/mock'
import OrderModal from 'components/OrderModal.vue'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const orderId = route.params.id
const order = ref(null)
const dishes = ref([])
const showItemModal = ref(false)
const removeDialog = ref(false)
const itemToRemoveIndex = ref(null)

const itemColumns = [
  { name: 'dishName', label: 'Prato', field: 'dishName', align: 'left' },
  { name: 'qty', label: 'Quantidade', field: 'qty', align: 'center' },
  { name: 'unitPrice', label: 'Preço Unit.', field: 'unitPrice', align: 'right' },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

onMounted(async () => {
  await loadOrder()
  await loadDishes()
})

async function loadOrder() {
  try {
    const data = await getOrderById(orderId)
    if (data) {
      order.value = data
    } else {
      $q.notify({
        type: 'negative',
        message: 'Comanda não encontrada',
        icon: 'error',
        position: 'top',
      })
      router.push('/orders')
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar comanda',
      icon: 'error',
      position: 'top',
    })
  }
}

async function loadDishes() {
  dishes.value = await getDishes()
}

async function updateStatus(newStatus) {
  try {
    await updateOrderStatus(orderId, newStatus)
    $q.notify({
      type: 'positive',
      message: `Status atualizado para: ${newStatus}`,
      icon: 'check_circle',
      position: 'top',
    })
    await loadOrder()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar status',
      icon: 'error',
      position: 'top',
    })
  }
}

async function addItem(item) {
  try {
    await addOrderItem(orderId, item)
    $q.notify({
      type: 'positive',
      message: 'Item adicionado com sucesso',
      icon: 'check_circle',
      position: 'top',
    })
    await loadOrder()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao adicionar item',
      icon: 'error',
      position: 'top',
    })
  }
}

function removeItem(index) {
  itemToRemoveIndex.value = index
  removeDialog.value = true
}

async function confirmRemove() {
  try {
    await removeOrderItem(orderId, itemToRemoveIndex.value)
    $q.notify({
      type: 'positive',
      message: 'Item removido com sucesso',
      icon: 'check_circle',
      position: 'top',
    })
    await loadOrder()
    removeDialog.value = false
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao remover item',
      icon: 'error',
      position: 'top',
    })
  }
}

function getStatusColor(status) {
  const colors = {
    'Em preparação': 'warning',
    Servido: 'positive',
    Cancelado: 'negative',
  }
  return colors[status] || 'grey'
}

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',')
}

function formatDateTime(dateTime) {
  if (!dateTime) return '-'
  const date = new Date(dateTime)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
