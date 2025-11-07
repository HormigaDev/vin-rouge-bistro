<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="$emit('toggle-drawer')" />

      <q-toolbar-title class="row items-center">
        <img src="/assets/logo.svg" alt="Vin Rouge" style="height: 40px; margin-right: 12px" />
        <span class="title">Vin Rouge Bistrô</span>
      </q-toolbar-title>

      <q-space />

      <div class="row items-center q-gutter-sm">
        <q-chip color="secondary" text-color="dark" icon="person">
          {{ userName }}
        </q-chip>
        <q-btn flat dense round icon="logout" @click="handleLogout">
          <q-tooltip>Sair</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

defineOptions({
  name: 'AppHeader',
})

defineEmits(['toggle-drawer'])

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name || 'Chef')

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.q-toolbar-title {
  font-size: 1.25rem;
}
</style>
