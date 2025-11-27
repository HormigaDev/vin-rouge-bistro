<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="title text-primary q-my-none">Reservas</h4>
        <p class="text-grey-7">Gerencie as reservas do restaurante</p>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Nova Reserva"
        unelevated
        @click="$router.push('/reservations/new')"
      />
    </div>

    <!-- Filtros -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input v-model="filters.search" label="Buscar por cliente" filled dense clearable>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="filters.date" label="Data" type="date" filled dense clearable />
          </div>
          <div class="col-12 col-md-4">
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

    <!-- Tabela de reservas -->
    <q-table
      :rows="filteredReservations"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10, 20, 50]"
      flat
      bordered
    >
      <template v-slot:body-cell-client="props">
        <q-td :props="props">
          <div>
            <div class="text-bold">{{ props.row.client }}</div>
            <div class="text-caption text-grey-7">{{ props.row.phone }}</div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-dateTime="props">
        <q-td :props="props">
          <div>
            <div>{{ formatDate(props.row.date) }}</div>
            <div class="text-caption text-grey-7">{{ props.row.time }}</div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-people="props">
        <q-td :props="props">
          <q-chip color="info" text-color="white" icon="people">
            {{ props.row.people }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.row.status)" :label="props.row.status" />
        </q-td>
      </template>

      <template v-slot:body-cell-notes="props">
        <q-td :props="props">
          <div v-if="props.row.notes" class="text-caption">
            {{ props.row.notes }}
          </div>
          <div v-else class="text-caption text-grey-5">Sem observações</div>
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
            @click="viewReservation(props.row)"
          >
            <q-tooltip>Ver Detalhes</q-tooltip>
          </q-btn>
          <q-btn
            v-if="props.row.status === 'Pendente'"
            flat
            dense
            round
            icon="check"
            color="positive"
            size="sm"
            @click="confirmReservationStatus(props.row)"
          >
            <q-tooltip>Confirmar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="edit"
            color="secondary"
            size="sm"
            @click="editReservation(props.row)"
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
            @click="confirmDeleteReservation(props.row)"
          >
            <q-tooltip>Excluir</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Mensagem se não houver reservas -->
    <div v-if="filteredReservations.length === 0" class="text-center q-pa-xl">
      <q-icon name="event_busy" size="64px" color="grey-5" />
      <p class="text-h6 text-grey-6 q-mt-md">Nenhuma reserva encontrada</p>
    </div>

    <!-- Master Detail -->
    <MasterDetail
      v-model="showDetail"
      :title="`Reserva de ${selectedReservation?.client || ''}`"
      width="500px"
    >
      <template v-if="selectedReservation">
        <div class="q-col-gutter-md">
          <!-- Status -->
          <div
            class="text-center q-pa-md rounded-borders"
            :class="getStatusBgClass(selectedReservation.status)"
          >
            <q-badge
              :color="getStatusColor(selectedReservation.status)"
              :label="selectedReservation.status"
              class="text-body1"
              style="padding: 8px 16px"
            />
          </div>

          <!-- Informações do cliente -->
          <div>
            <div class="text-caption text-grey-7">Cliente</div>
            <div class="text-h6">{{ selectedReservation.client }}</div>
          </div>

          <div>
            <div class="text-caption text-grey-7">Telefone</div>
            <div class="text-body1">
              <q-icon name="phone" class="q-mr-xs" />
              {{ selectedReservation.phone }}
            </div>
          </div>

          <q-separator />

          <!-- Data e hora -->
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-caption text-grey-7">Data</div>
              <div class="text-body1">
                <q-icon name="event" class="q-mr-xs" />
                {{ formatDate(selectedReservation.date) }}
              </div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-7">Horário</div>
              <div class="text-body1">
                <q-icon name="schedule" class="q-mr-xs" />
                {{ selectedReservation.time }}
              </div>
            </div>
          </div>

          <!-- Pessoas -->
          <div>
            <div class="text-caption text-grey-7">Número de Pessoas</div>
            <q-chip color="info" text-color="white" icon="people" size="lg">
              {{ selectedReservation.people }} pessoa(s)
            </q-chip>
          </div>

          <q-separator />

          <!-- Observações -->
          <div>
            <div class="text-caption text-grey-7">Observações</div>
            <div class="text-body1 q-pa-sm bg-grey-1 rounded-borders" style="min-height: 60px">
              {{ selectedReservation.notes || 'Sem observações' }}
            </div>
          </div>

          <!-- Ações de status -->
          <div v-if="selectedReservation.status === 'Pendente'" class="q-pt-md">
            <q-btn
              unelevated
              color="positive"
              icon="check"
              label="Confirmar Reserva"
              class="full-width"
              @click="confirmReservationStatusFromDetail"
            />
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
          @click="editReservationFromDetail"
        />
      </template>
    </MasterDetail>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import {
  getReservations,
  updateReservation,
  deleteReservation as deleteReservationAPI,
} from 'stores/mock'
import MasterDetail from 'components/MasterDetail.vue'

defineOptions({
  name: 'ReservationsListPage',
})

const router = useRouter()
const $q = useQuasar()

const reservations = ref([])
const showDetail = ref(false)
const selectedReservation = ref(null)

const filters = ref({
  search: '',
  date: '',
  status: null,
})

const statusOptions = ['Pendente', 'Confirmada', 'Cancelada', 'Finalizada']

const columns = [
  { name: 'client', label: 'Cliente', field: 'client', align: 'left', sortable: true },
  { name: 'dateTime', label: 'Data/Hora', field: 'date', align: 'left', sortable: true },
  { name: 'people', label: 'Pessoas', field: 'people', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'notes', label: 'Observações', field: 'notes', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const filteredReservations = computed(() => {
  let result = reservations.value

  if (filters.value.search) {
    result = result.filter((r) =>
      r.client.toLowerCase().includes(filters.value.search.toLowerCase()),
    )
  }

  if (filters.value.date) {
    result = result.filter((r) => r.date === filters.value.date)
  }

  if (filters.value.status) {
    result = result.filter((r) => r.status === filters.value.status)
  }

  return result
})

onMounted(async () => {
  await loadReservations()
})

async function loadReservations() {
  reservations.value = await getReservations()
}

function getStatusColor(status) {
  const colors = {
    Pendente: 'warning',
    Confirmada: 'positive',
    Cancelada: 'negative',
    Finalizada: 'info',
  }
  return colors[status] || 'grey'
}

function getStatusBgClass(status) {
  const classes = {
    Pendente: 'bg-orange-1',
    Confirmada: 'bg-green-1',
    Cancelada: 'bg-red-1',
    Finalizada: 'bg-blue-1',
  }
  return classes[status] || 'bg-grey-1'
}

function formatDate(date) {
  if (!date) return '-'
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

function viewReservation(reservation) {
  selectedReservation.value = reservation
  showDetail.value = true
}

async function confirmReservationStatus(reservation) {
  try {
    await updateReservation(reservation.id, { ...reservation, status: 'Confirmada' })
    $q.notify({
      type: 'positive',
      message: 'Reserva confirmada com sucesso',
      icon: 'check_circle',
      position: 'top',
    })
    await loadReservations()
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao confirmar reserva',
      icon: 'error',
      position: 'top',
    })
  }
}

async function confirmReservationStatusFromDetail() {
  await confirmReservationStatus(selectedReservation.value)
  selectedReservation.value = reservations.value.find((r) => r.id === selectedReservation.value.id)
}

function editReservation(reservation) {
  router.push(`/reservations/${reservation.id}`)
}

function editReservationFromDetail() {
  showDetail.value = false
  router.push(`/reservations/${selectedReservation.value.id}`)
}

function confirmDeleteReservation(reservation) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir a reserva de ${reservation.client}?`,
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
      await deleteReservationAPI(reservation.id)
      $q.notify({
        type: 'positive',
        message: 'Reserva excluída com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
      await loadReservations()
    } catch {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir reserva',
        icon: 'error',
        position: 'top',
      })
    }
  })
}
</script>

<style scoped>
h4 {
  font-size: 1.75rem;
}
</style>
