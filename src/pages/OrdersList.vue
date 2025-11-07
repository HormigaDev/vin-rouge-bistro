<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="title text-primary q-my-none">Comandas</h4>
        <p class="text-grey-7">Gerencie as comandas do restaurante</p>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Nova Comanda"
        unelevated
        @click="$router.push('/orders/new')"
      />
    </div>

    <!-- Filtros -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="filters.search"
              label="Buscar por cliente ou mesa"
              filled
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="Status"
              filled
              dense
              clearable
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Lista de comandas -->
    <div class="row q-col-gutter-md">
      <div v-for="order in filteredOrders" :key="order.id" class="col-12 col-md-6 col-lg-4">
        <q-card class="order-card">
          <q-card-section @click="viewOrderDetails(order)" style="cursor: pointer">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 title">#{{ order.id }}</div>
              <q-badge :color="getStatusColor(order.status)" :label="order.status" />
            </div>

            <div class="q-mb-sm">
              <div class="text-grey-7 text-caption">Cliente</div>
              <div class="text-body1">{{ order.client }}</div>
            </div>

            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-6">
                <div class="text-grey-7 text-caption">Mesa</div>
                <div class="text-body1">Mesa {{ order.table }}</div>
              </div>
              <div class="col-6">
                <div class="text-grey-7 text-caption">Itens</div>
                <div class="text-body1">{{ order.items.length }} item(s)</div>
              </div>
            </div>

            <q-separator class="q-my-sm" />

            <div class="row items-center justify-between">
              <div class="text-caption text-grey-7">Total</div>
              <div class="text-h6 text-secondary">R$ {{ formatPrice(order.total) }}</div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat dense icon="edit" color="primary" @click.stop="editOrder(order)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="visibility"
              color="primary"
              @click.stop="viewOrderDetails(order)"
            >
              <q-tooltip>Ver Detalhes</q-tooltip>
            </q-btn>
            <q-btn flat dense icon="delete" color="negative" @click.stop="confirmDelete(order)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Mensagem se não houver comandas -->
    <div v-if="filteredOrders.length === 0" class="text-center q-pa-xl">
      <q-icon name="receipt_long" size="64px" color="grey-5" />
      <p class="text-h6 text-grey-6 q-mt-md">Nenhuma comanda encontrada</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getOrders, deleteOrder } from 'stores/mock'

defineOptions({
  name: 'OrdersListPage',
})

const router = useRouter()
const $q = useQuasar()

const orders = ref([])

const filters = ref({
  search: '',
  status: null,
})

const statusOptions = ['Em preparação', 'Servido', 'Cancelado']

const filteredOrders = computed(() => {
  let result = orders.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      (o) => o.client.toLowerCase().includes(search) || o.table.toString().includes(search),
    )
  }

  if (filters.value.status) {
    result = result.filter((o) => o.status === filters.value.status)
  }

  return result
})

onMounted(async () => {
  await loadOrders()
})

async function loadOrders() {
  orders.value = await getOrders()
}

function getStatusColor(status) {
  const colors = {
    'Em preparação': 'warning',
    Servido: 'positive',
    Cancelado: 'negative',
  }
  return colors[status] || 'grey'
}

function viewOrderDetails(order) {
  router.push(`/orders/${order.id}`)
}

function editOrder(order) {
  router.push(`/orders/${order.id}/edit`)
}

function confirmDelete(order) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir a comanda #${order.id} de ${order.client}?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-7',
    },
    ok: {
      label: 'Excluir',
      color: 'negative',
      unelevated: true,
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await deleteOrder(order.id)
      $q.notify({
        type: 'positive',
        message: 'Comanda excluída com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
      await loadOrders()
    } catch {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir comanda',
        icon: 'error',
        position: 'top',
      })
    }
  })
}

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
h4 {
  font-size: 1.75rem;
}

.order-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
</style>
