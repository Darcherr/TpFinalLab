<script setup lang="ts">
import Toolbar from 'primevue/toolbar'
</script>

<template>
  <div class="grid">
    <Toolbar class="col-12 mb-0">
      <template #start>
        <div class="flex justify-content-center mb-0">
          <router-link to="/home">
            <img alt="logo" src="/public/favicon.ico" class="w-auto pr-6 pl-3" />
          </router-link>
        </div>
      </template>
    </Toolbar>
  </div>
</template>
