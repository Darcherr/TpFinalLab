<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
    console.log("App.vue", "window", window.GLOBAL_CONFIG);
})
</script>

<template>
    <RouterView></RouterView>
</template>

<style scoped></style>
