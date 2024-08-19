<script setup lang="ts">
import client from '@/client'
import { onMounted } from 'vue'

const testApi = () => {
  console.log('eu')
  let lala = client.get('transactions')
  console.log(lala)
}
onMounted(() => {
  console.log('gaisdas')
  testApi()
})
</script>

<template>
  <h1>gil</h1>
  <main></main>
</template>
