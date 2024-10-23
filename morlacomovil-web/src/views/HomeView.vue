<script setup lang="ts">
import TransactionService from '@/services/transactionService';
import Button from 'primevue/button';
import { onMounted } from 'vue'

const transactionService = new TransactionService();

const testApi = async () => {
  // const prueba = transactionService.get()
  const params = {
    q: JSON.stringify({ user_id: "12345DarcherTest" }),
  }

  let asd = await transactionService.get(params);
  console.log(asd);

}


const testNewUser = async () => {
  const params = {
    user_id: "12345DarcherTest",
    action: "purchase",
    crypto_code: "amigueroCoin",
    crypto_amount: "777",
    money: "2000",
    datetime: "21-10-2024 19:44",
  }

  let data = await transactionService.purchase(params);

  console.log("metodo Comprar", data);
}
onMounted(() => {
  testApi()
})
</script>

<template>
  <h1>Pantalla Principal</h1>
  <div class="grid">
    <div class="col-12">
      <Button type="button" label="Comprar" icon="pi pi-search" @click="testNewUser" />
      <Button type="button" label="ver Compras" icon="pi pi-search" @click="testApi" />
    </div>
  </div>
  <main></main>
</template>

<style scoped></style>
