<script setup lang="ts">
import User from '@/models/user-model'
import UserMovements from '@/components/user-movements.vue'
import TransactionService from '@/services/transactionService'
import { useUserStore } from '@/store/storeExample'
import Button from 'primevue/button'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import Toolbar from 'primevue/toolbar'
import { onMounted } from 'vue'
import PriceService from '@/services/CriptoYa/priceService'

const transactionService = new TransactionService()
const priceService = new PriceService();
const userStore = useUserStore()

const testApi = async () => {
  // const params = {
  //   q: JSON.stringify({ user_id: '12345DarcherTest' })
  // }

  // let asd = await transactionService.get(params)
  // console.log(asd)

  await userStore.getTransactionList();
}

const testNewUser = async () => {
  const params = {
    user_id: '12345DarcherTest',
    action: 'purchase',
    crypto_code: 'USDC',
    crypto_amount: '100',
    money: '5000',
    datetime: '02-03-2025 19:44'
  }

  let data = await transactionService.purchase(params)

  console.log('metodo Comprar', data)
}

const setUserStore = () => {
  const rawuser = localStorage.getItem("user_data");
  const user = JSON.parse(rawuser!);
  userStore.setUser(user);
};

const getPrice = async() => {
  const params = {
    exchange: "bybitp2p",
    coin: "BTC",
    fiat: "ARS",
    volumen: "0.1"
  }
let lala = await priceService.get(params);
console.log("exchgange gil", lala)
}

onMounted(async () => {
  setUserStore();
  await testApi()
  await getPrice();
})
</script>

<template>
  <h1>Hola! {{ userStore.user?.email }}</h1>
  <Toolbar>
    <template #start>
        <Button icon="pi pi-plus" class="mr-2" severity="secondary" />
        <Button icon="pi pi-print" class="mr-2" severity="secondary" />
        <Button icon="pi pi-upload" severity="secondary" />
    </template>

    <template #center>
        <!-- <IconField iconPosition="left">
            <InputIcon>
                <i class="pi pi-search" />
            </InputIcon>
            <InputText placeholder="Search" />
        </IconField> -->
    </template>

</Toolbar>
  <div class="grid">
    <div class="col-12">
      <TabView>
        <TabPanel header="Comprar">
          <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </TabPanel>
        <TabPanel header="Vender">
          <p class="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
          </p>
        </TabPanel>
        <TabPanel header="Movimientos">
          <UserMovements></UserMovements>
        </TabPanel>
      </TabView>
      <!-- <Button type="button" label="Comprar" icon="pi pi-search" @click="testNewUser" />
      <Button type="button" label="ver Compras" icon="pi pi-search" @click="testApi" /> -->
    </div>
  </div>
  <main></main>
</template>

<style scoped></style>
