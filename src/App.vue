<template>
  <router-view />
</template>

<script setup>
// Importações globais para o Vin Rouge Bistrô
import { useAuthStore } from 'stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  // Verifica autenticação ao carregar o app
  authStore.checkAuth()
})
</script>

<style>
/* Estilos globais já estão definidos em src/css/app.scss */
</style>
