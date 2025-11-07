<template>
  <q-layout view="hHh lpR fFf">
    <AppHeader @toggle-drawer="drawerOpen = !drawerOpen" />

    <AppSidebar v-model="drawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from 'components/Header.vue'
import AppSidebar from 'components/Sidebar.vue'

const drawerOpen = ref(false)
</script>
