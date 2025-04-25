<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import TransactionService from '@/services/transactionService'
import { useUserStore } from '@/store/storeExample'
import Transaction from '@/models/transaction-model'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const transactionSelected = ref<Transaction>()
const transactionService = new TransactionService();
const isDeleting = ref<boolean>(false)

const deleteMovement = async () => {
  isDeleting.value = !isDeleting.value
  await transactionService.delete(transactionSelected.value!._id)
  await userStore.getTransactionList()
  isDeleting.value = !isDeleting.value
}
const getSeverity = (transaction: string) => {
  switch (transaction) {
    case 'sale':
      return 'danger'

    case 'purchase':
      return 'success'
  }
}

const getTransactionName = (transaction: string) => {
  switch (transaction) {
    case 'sale':
      return 'Venta'

    case 'purchase':
      return 'Compra'
  }
}

const formatCurrency = (value: number) => {
  return value?.toLocaleString('es-AR', {
    style: 'decimal',
    minimumFractionDigits: 2
  })
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('es-ES')
}

onMounted(async () => {
  userStore.getTransactionList();
})

</script>
<template>
  <Toolbar>
    <template #start>
      <Button icon="pi pi-trash" class="p-button-danger ml-2" @click="deleteMovement()" :disabled="!transactionSelected" :loading="isDeleting"></Button>
    </template>
  </Toolbar>
  <DataTable
    :value="userStore.transactionList"
    stripedRows
    tableStyle="min-width: 50rem"
    selectionMode="single"
    v-model:selection="transactionSelected"
  >
    <Column field="crypto_code" header="Moneda">
      <template #body="slotProps">
        <div class="flex align-items-center gap-2">
          <img
            :src="userStore.getCryptoIcon(slotProps.data.crypto_code)"
            :alt="slotProps.data.symbol"
            class="crypto-icon"
          />
          <span class="crypto-info">
            <span>{{ slotProps.data.crypto_code }}</span>
          </span>
        </div>
      </template></Column
    >
    <Column field="crypto_amount" header="Monto"></Column>
    <Column field="money" header="En pesos">
      <template #body="{ data }">
        <span> {{ formatCurrency(data.money) }}</span>
      </template></Column
    >
    <column field="action" header="operacion">
      <template #body="{ data }">
        <Tag
          :value="getTransactionName(data.action)"
          :severity="getSeverity(data.action)"
        /> </template
    ></column>
    <Column field="datetime" header="Fecha">
      <template #body="{ data }">
        <span> {{ formatDate(data.datetime) }}</span>
      </template></Column
    >
  </DataTable>

</template>

<style scoped>
.crypto-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
};
</style>