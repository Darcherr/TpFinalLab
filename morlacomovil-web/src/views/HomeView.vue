<script setup lang="ts">
import User from '@/models/user-model'
import UserMovements from '@/components/user-movements.vue'
import InvestmentsResult from '@/components/InvestmentsResult.vue'
import TransactionService from '@/services/transactionService'
import { useUserStore } from '@/store/storeExample'
import Button from 'primevue/button'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import Toolbar from 'primevue/toolbar'
import { computed, onMounted } from 'vue'
import PriceService from '@/services/CriptoYa/priceService'
import Purchase from '@/components/purchase.vue'
import Badge from 'primevue/badge'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Card from 'primevue/card'
import Sell from '@/components/sell.vue'

const userStore = useUserStore()

const setUserStore = () => {
  userStore.fetchUser()
}


const setBalance = computed(() => {
  if (userStore.transactionList) {
    const balanceMap: Record<string, number> = {}

    userStore.transactionList.forEach((tx) => {
      const { crypto_code, action, crypto_amount } = tx

      if (!balanceMap[crypto_code]) {
        balanceMap[crypto_code] = 0
      }
      let sellPrice = userStore.getCryptoSellPrice(crypto_code)
      if (action === 'purchase') {
        console.log("purchase",sellPrice)
        console.log("balance parcial",(crypto_amount * sellPrice))
        balanceMap[crypto_code] += (crypto_amount * sellPrice);
      } else if (action === 'sell') {
        balanceMap[crypto_code] -= (crypto_amount * sellPrice);
      }
    })

    balanceMap['ARS'] = parseFloat(userStore.user ? userStore.user.balance.toFixed(2) : '0')

    return balanceMap
  } else return {}
})

const totalBalance = computed(() => {
  return formatCurrency(Object.values(setBalance.value)
    .reduce((sum, amount) => sum + amount, 0));
})

const formatCurrency = (value: number) => {
  return value?.toLocaleString('es-AR', {
    style: 'decimal',
    minimumFractionDigits: 2
  })
}


onMounted(async () => {
  setUserStore()
})
</script>

<template>
  <Card>
    <template #title>
      <h1>Hola! {{ userStore.user?.email }}</h1>
    </template>
    <template #content>
      <div class="balance-container">
        <div class="balance-total">
          <span class="currency-label"> Balance Total:</span>
          <Badge severity="success" class="ml-2">
            <template #default>
              <span>
                {{ `${totalBalance} ARS`  }}
              </span>
            </template>
          </Badge>
        </div>
      </div>
    </template>
    <template #footer>
      <Accordion>
    <AccordionTab header="Detalle de Saldo">
      <template v-if="Object.keys(setBalance).length">
        <ul class="balance-list">
          <li v-for="(amount, currency) in setBalance" :key="currency" class="balance-item">
            <span class="currency-label">{{ currency }}:</span>
            <Badge :value="formatCurrency(amount)" severity="info" class="ml-2" >
              <template #default> 
                <span>
                {{ `${formatCurrency(amount)} ARS`  }}
              </span>
              </template>
            </Badge>
          </li>
        </ul>
      </template>
      <span v-else>No hay movimientos</span>
    </AccordionTab>
  </Accordion>
    </template>
  </Card>

  <div class="grid">
    <div class="col-12">
      <TabView>
        <TabPanel header="Comprar" >
          <Purchase></Purchase>
        </TabPanel>
        <TabPanel header="Vender">
          <Sell></Sell>
        </TabPanel>
        <TabPanel header="Movimientos">
          <UserMovements></UserMovements>
        </TabPanel>
        <TabPanel header="Analisis">
          <InvestmentsResult></InvestmentsResult>
        </TabPanel>
      </TabView>
    </div>
  </div>
  <main></main>
</template>

<style scoped></style>
