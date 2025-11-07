<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h4 class="title text-primary q-my-none">
          {{ isEdit ? 'Editar Reserva' : 'Nova Reserva' }}
        </h4>
        <p class="text-grey-7">Preencha as informações da reserva</p>
      </div>
      <q-btn flat icon="arrow_back" label="Voltar" @click="$router.push('/reservations')" />
    </div>

    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Nome do Cliente -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.client"
                label="Nome do Cliente *"
                filled
                :rules="[
                  (val) => !!val || 'Nome do cliente é obrigatório',
                  (val) => val.length >= 3 || 'Nome deve ter pelo menos 3 caracteres',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <!-- Telefone -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.phone"
                label="Telefone *"
                filled
                mask="(##) #####-####"
                unmasked-value
                :rules="[
                  (val) => !!val || 'Telefone é obrigatório',
                  (val) => val.length >= 10 || 'Telefone inválido',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>

            <!-- Data -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.date"
                label="Data *"
                filled
                type="date"
                :rules="[
                  (val) => !!val || 'Data é obrigatória',
                  (val) => isValidDate(val) || 'Data não pode ser no passado',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>

            <!-- Horário -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.time"
                label="Horário *"
                filled
                type="time"
                :rules="[(val) => !!val || 'Horário é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="schedule" />
                </template>
              </q-input>
            </div>

            <!-- Número de Pessoas -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="formData.people"
                type="number"
                label="Número de Pessoas *"
                filled
                min="1"
                max="20"
                :rules="[
                  (val) => !!val || 'Número de pessoas é obrigatório',
                  (val) => val > 0 || 'Deve ser maior que zero',
                  (val) => val <= 20 || 'Máximo de 20 pessoas por reserva',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="group" />
                </template>
              </q-input>
            </div>

            <!-- Status -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="formData.status"
                :options="statusOptions"
                label="Status *"
                filled
                :rules="[(val) => !!val || 'Status é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="info" />
                </template>
              </q-select>
            </div>

            <!-- Observações -->
            <div class="col-12">
              <q-input
                v-model="formData.observations"
                label="Observações"
                filled
                type="textarea"
                rows="3"
                hint="Informações adicionais sobre a reserva (opcional)"
                counter
                maxlength="500"
              >
                <template v-slot:prepend>
                  <q-icon name="notes" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Card de resumo -->
          <q-card
            flat
            bordered
            class="q-mt-md"
            v-if="formData.client && formData.date && formData.time"
          >
            <q-card-section class="bg-grey-2">
              <div class="text-h6 q-mb-sm"><q-icon name="summarize" /> Resumo da Reserva</div>
              <q-separator class="q-mb-md" />
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Cliente</div>
                  <div class="text-body1">
                    <strong>{{ formData.client }}</strong>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="text-caption text-grey-7">Telefone</div>
                  <div class="text-body1">
                    <strong>{{ formatPhone(formData.phone) }}</strong>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Data</div>
                  <div class="text-body1">
                    <strong>{{ formatDate(formData.date) }}</strong>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Horário</div>
                  <div class="text-body1">
                    <strong>{{ formData.time }}</strong>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="text-caption text-grey-7">Pessoas</div>
                  <div class="text-body1">
                    <strong>{{ formData.people }}</strong>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Botões de ação -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn label="Cancelar" flat color="grey-7" @click="$router.push('/reservations')" />
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
import { getReservationById, createReservation, updateReservation } from 'stores/mock'

defineOptions({
  name: 'ReservationFormPage',
})

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const reservationId = computed(() => route.params.id)
const isEdit = computed(() => !!reservationId.value)

const loading = ref(false)

const statusOptions = ['Confirmada', 'Pendente', 'Cancelada', 'Finalizada']

const formData = ref({
  client: '',
  phone: '',
  date: '',
  time: '',
  people: 2,
  status: 'Confirmada',
  observations: '',
})

onMounted(async () => {
  if (isEdit.value) {
    await loadReservation()
  } else {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    formData.value.date = today
  }
})

async function loadReservation() {
  try {
    const reservation = await getReservationById(reservationId.value)
    if (reservation) {
      formData.value = {
        client: reservation.client,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        people: reservation.people,
        status: reservation.status,
        observations: reservation.observations || '',
      }
    } else {
      $q.notify({
        type: 'negative',
        message: 'Reserva não encontrada',
        icon: 'error',
        position: 'top',
      })
      router.push('/reservations')
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar reserva',
      icon: 'error',
      position: 'top',
    })
  }
}

function isValidDate(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selectedDate = new Date(dateStr + 'T00:00:00')
  return selectedDate >= today
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function formatPhone(phone) {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

async function handleSubmit() {
  loading.value = true

  try {
    if (isEdit.value) {
      await updateReservation(reservationId.value, formData.value)
      $q.notify({
        type: 'positive',
        message: 'Reserva atualizada com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
    } else {
      await createReservation(formData.value)
      $q.notify({
        type: 'positive',
        message: 'Reserva criada com sucesso',
        icon: 'check_circle',
        position: 'top',
      })
    }
    router.push('/reservations')
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar reserva',
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
