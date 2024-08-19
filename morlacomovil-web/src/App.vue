<script setup lang="ts">
import { onMounted } from "vue";
import client from "./client";

onMounted(() => {
    console.log("App.vue", "window", window.GLOBAL_CONFIG);
    client.get('');
})
</script>

<template>
    <RouterView></RouterView>
</template>

<style scoped></style>
