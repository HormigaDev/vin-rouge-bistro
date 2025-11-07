<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="title text-primary q-my-none">
          {{ isEdit ? 'Editar Comanda' : 'Nova Comanda' }}
        </h4>
        <p class="text-grey-7">Preencha as informações da comanda</p>
      </div>
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.push('/orders')" />
    </div>

    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Cliente -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.client"
                label="Nome do Cliente *"
                filled
                :rules="[(val) => !!val || 'Nome do cliente é obrigatório']"
              />
            </div>

            <!-- Mesa -->
            <div class="col-12 col-md-3">
              <q-input
                v-model.number="formData.table"
                type="number"
                label="Número da Mesa *"
                filled
                min="1"
                :rules="[
                  (val) => !!val || 'Mesa é obrigatória',
                  (val) => val > 0 || 'Mesa deve ser maior que zero',
                ]"
              />
            </div>

            <!-- Status -->
            <div class="col-12 col-md-3">
              <q-select
                v-model="formData.status"
                :options="['Em preparação', 'Servido', 'Cancelado']"
                label="Status *"
                filled
                :rules="[(val) => !!val || 'Status é obrigatório']"
              />
            </div>

            <!-- Itens da Comanda -->
            <div class="col-12">
              <div class="text-subtitle1 q-mb-sm">
                <q-icon name="restaurant" /> Itens da Comanda *
              </div>

              <q-card flat bordered class="q-mb-md">
                <q-card-section>
                  <div class="row justify-between items-center q-mb-md">
                    <div class="text-body2 text-grey-7">
                      {{ formData.items.length }} item(s) adicionado(s)
                    </div>
                    <q-btn
                      color="secondary"
                      icon="add"
                      label="Adicionar Item"
                      size="sm"
                      @click="showItemModal = true"
                    />
                  </div>

                  <q-list v-if="formData.items.length > 0" separator>
                    <q-item v-for="(item, index) in formData.items" :key="index">
                      <q-item-section avatar>
                        <q-icon name="restaurant_menu" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item.dishName }}</q-item-label>
                        <q-item-label caption>
                          {{ item.qty }}x R$ {{ formatPrice(item.unitPrice) }} = R$
                          {{ formatPrice(item.subtotal) }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          round
                          icon="delete"
                          color="negative"
                          size="sm"
                          @click="removeItem(index)"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <div v-else class="text-center text-grey-6 q-pa-md">
                    <q-icon name="inventory" size="48px" />
                    <p class="q-mt-sm">Nenhum item adicionado</p>
                  </div>

                  <q-separator v-if="formData.items.length > 0" class="q-my-md" />

                  <div v-if="formData.items.length > 0" class="row justify-end">
                    <div class="q-pa-md bg-grey-2 rounded-borders" style="min-width: 200px">
                      <div class="row justify-between items-center">
                        <span class="text-h6"><strong>Total:</strong></span>
                        <span class="text-h6 text-secondary">R$ {{ formatPrice(total) }}</span>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <div v-if="formData.items.length === 0" class="text-negative text-caption">
                * Adicione pelo menos um item à comanda
              </div>
            </div>
          </div>

          <!-- Botões de ação -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Cancelar" flat color="grey-7" @click="$router.push('/orders')" />
            <q-btn
              label="Salvar"
              type="submit"
              color="primary"
              unelevated
              :loading="loading"
              :disable="formData.items.length === 0"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Modal para adicionar item -->
    <OrderModal v-model="showItemModal" :dishes="dishes" @save="addItem" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { getOrderById, createOrder, updateOrder, getDishes } from 'stores/mock'
import OrderModal from 'components/OrderModal.vue'

defineOptions({
  name: 'OrderFormPage',
})

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const orderId = computed(() => route.params.id)
const isEdit = computed(() => !!orderId.value)

const loading = ref(false)
const showItemModal = ref(false)
const dishes = ref([])

const formData = ref({
  client: '',
  table: 1,
  status: 'Em preparação',
  items: [],
})

const total = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + item.subtotal, 0)
})

onMounted(async () => {
  await loadDishes()
  if (isEdit.value) {
    await loadOrder()
  }
})

async function loadDishes() {
  dishes.value = await getDishes()
}

async function loadOrder() {
  try {
    const order = await getOrderById(orderId.value)
    if (order) {
      formData.value = {
        client: order.client,
        table: order.table,
        status: order.status,
        items: [...order.items],
      }
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

function addItem(item) {
  formData.value.items.push(item)
}

function removeItem(index) {
  formData.value.items.splice(index, 1)
}

async function handleSubmit() {
  if (formData.value.items.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'Adicione pelo menos um item à comanda',
      icon: 'warning',
      position: 'top',
    })
    return
  }

  loading.value = true

  try {
    const orderData = {
      ...formData.value,
      total: total.value,
    }

    if (isEdit.value) {
      await updateOrder(orderId.value, orderData)
      $q.notify({
        type: 'positive',
        message: 'Comanda atualizada com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
    } else {
      await createOrder(orderData)
      $q.notify({
        type: 'positive',
        message: 'Comanda criada com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
    }
    router.push('/orders')
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar comanda',
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
