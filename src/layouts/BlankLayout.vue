<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: 'BlankLayout',
})
</script>

<style scoped>
/* Layout sem decorações para páginas standalone */
</style>
