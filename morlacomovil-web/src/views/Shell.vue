<script setup lang="ts">
import { useUserStore } from '@/store/storeExample';
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();

const logout = async () => {
  localStorage.removeItem("user_data");
  userStore.reset();
  await router.push({ name: "login" });
};
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
      <template #end>
        <Button label="Cerrar Sesión" icon="pi pi-sign-out" class="p-button-text" v-on:click="logout"></Button>
      </template>
    </Toolbar>
  </div>
  <div class="p-3">
    <router-view></router-view>
  </div>
</template>
