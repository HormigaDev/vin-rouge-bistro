<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <h4 class="title text-primary q-my-none">Dashboard</h4>
        <p class="text-grey-7">Bem-vindo ao painel de controle do Vin Rouge Bistrô</p>
      </div>
    </div>

    <!-- Métricas principais -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="metric-card bg-primary text-white">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="restaurant_menu" size="48px" class="q-mr-md" />
              <div>
                <div class="text-h4">{{ metrics.menuItems }}</div>
                <div class="text-subtitle2">Pratos no Menu</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="metric-card bg-secondary text-dark">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="event" size="48px" class="q-mr-md" />
              <div>
                <div class="text-h4">{{ metrics.reservations }}</div>
                <div class="text-subtitle2">Reservas Confirmadas</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="metric-card bg-info text-white">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="receipt_long" size="48px" class="q-mr-md" />
              <div>
                <div class="text-h4">{{ metrics.pendingOrders }}</div>
                <div class="text-subtitle2">Comandas em Preparação</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="metric-card bg-warning text-dark">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="warning" size="48px" class="q-mr-md" />
              <div>
                <div class="text-h4">{{ metrics.lowStockIngredients }}</div>
                <div class="text-subtitle2">Estoque Baixo</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Ações rápidas -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 title q-mb-md">Ações Rápidas</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6 col-md-3">
                <q-btn
                  unelevated
                  color="primary"
                  icon="add"
                  label="Novo Prato"
                  class="full-width"
                  @click="$router.push('/dishes/new')"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-btn
                  unelevated
                  color="secondary"
                  icon="add"
                  label="Nova Reserva"
                  class="full-width"
                  @click="$router.push('/reservations/new')"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-btn
                  unelevated
                  color="info"
                  icon="add"
                  label="Nova Comanda"
                  class="full-width"
                  @click="$router.push('/orders/new')"
                />
              </div>
              <div class="col-12 col-sm-6 col-md-3">
                <q-btn
                  unelevated
                  color="dark"
                  text-color="white"
                  icon="inventory_2"
                  label="Ver Ingredientes"
                  class="full-width"
                  @click="$router.push('/ingredients')"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Resumo de receita -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 title q-mb-md">Resumo Financeiro</div>
            <div class="q-pa-md bg-grey-2 rounded-borders">
              <div class="row justify-between items-center q-mb-sm">
                <span class="text-body1">Receita Total (Pedidos Servidos):</span>
                <span class="text-h5 text-positive"
                  >R$ {{ formatPrice(metrics.totalRevenue || 0) }}</span
                >
              </div>
              <q-separator class="q-my-sm" />
              <div class="row justify-between items-center">
                <span class="text-caption text-grey-7"
                  >Baseado em {{ metrics.pendingOrders }} comandas ativas</span
                >
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 title q-mb-md">Alertas de Estoque</div>
            <q-list v-if="lowStockItems.length > 0" separator>
              <q-item v-for="item in lowStockItems" :key="item.id">
                <q-item-section avatar>
                  <q-icon name="warning" color="warning" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>Estoque: {{ item.stock }} {{ item.unit }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    dense
                    color="primary"
                    label="Repor"
                    size="sm"
                    @click="$router.push(`/ingredients/${item.id}`)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center text-grey-6 q-pa-md">
              <q-icon name="check_circle" size="48px" color="positive" />
              <p class="q-mt-md">Todos os ingredientes estão bem estocados!</p>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDashboardMetrics, getIngredients } from 'stores/mock'

defineOptions({
  name: 'DashboardPage',
})

const metrics = ref({
  menuItems: 0,
  reservations: 0,
  pendingOrders: 0,
  lowStockIngredients: 0,
  totalRevenue: 0,
})

const lowStockItems = ref([])

onMounted(async () => {
  await loadMetrics()
  await loadLowStockItems()
})

async function loadMetrics() {
  const data = await getDashboardMetrics()
  metrics.value = data
}

async function loadLowStockItems() {
  const ingredients = await getIngredients()
  lowStockItems.value = ingredients.filter((i) => i.stock < 5)
}

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.metric-card {
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.rounded-borders {
  border-radius: 8px;
}

h4 {
  font-size: 2rem;
}
</style>
