<template>
  <q-page class="flex flex-center login-page">
    <q-card class="login-card q-pa-lg">
      <div class="text-center q-mb-lg">
        <img
          src="/assets/logo.svg"
          alt="Vin Rouge Bistrô"
          style="width: 120px; margin-bottom: 16px"
        />
        <h5 class="title text-primary q-my-sm">Vin Rouge Bistrô</h5>
        <p class="text-grey-7">Sistema de Gestão Gourmet</p>
      </div>

      <q-form @submit="handleLogin" class="q-gutter-md">
        <q-input
          v-model="email"
          label="Email"
          type="email"
          filled
          :rules="[
            (val) => !!val || 'Email é obrigatório',
            (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          filled
          :rules="[
            (val) => !!val || 'Senha é obrigatória',
            (val) => val.length >= 8 || 'Mínimo 8 caracteres',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="primary" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-btn
          label="Iniciar Sessão"
          type="submit"
          color="primary"
          unelevated
          size="lg"
          class="full-width q-mt-md"
          :loading="loading"
        />
      </q-form>

      <div class="q-mt-lg text-center text-caption text-grey-6">
        <p>Credenciais de exemplo:</p>
        <p><strong>Email:</strong> chef@vinrougebistro.com</p>
        <p><strong>Senha:</strong> chef1234</p>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function handleLogin() {
  loading.value = true

  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value,
    })

    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!',
        icon: 'check_circle',
        position: 'top',
      })
      router.push('/dashboard')
    } else {
      $q.notify({
        type: 'negative',
        message: 'Credenciais inválidas',
        icon: 'error',
        position: 'top',
      })
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao realizar login',
      icon: 'error',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  background-image:
    linear-gradient(135deg, rgba(128, 0, 32, 0.1) 0%, rgba(212, 160, 23, 0.05) 100%),
    url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)" /></svg>');
  min-height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background: #f5f5f5;
  border: 2px solid rgba(128, 0, 32, 0.2);
}

h5 {
  font-size: 1.75rem;
  margin: 0;
}
</style>
