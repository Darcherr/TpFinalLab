<script setup lang="ts">
import TransactionService from '@/services/transactionService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import { ref } from 'vue';
import { useUserStore } from '@/store/storeExample';

const userStore = useUserStore();
const transactionSelected = ref<any>();

// const getTransactionList = async () => {
//   const params = {
//     q: JSON.stringify({ user_id: '12345DarcherTest' })
//   }

//   let asd = await transactionService.get(params)
//   console.log(asd)
//   transactionList.value = asd;
// }

const getSeverity = (transaction: string) => {
    switch (transaction) {
        case 'sale':
            return 'danger';

        case 'purchase':
            return 'success';
    }
}

const getTransactionName = (transaction : string) => {
    switch (transaction) {
        case 'sale':
            return 'Venta';

        case 'purchase':
            return 'Compra';
    }
}

// onMounted(async () => {
//   await getTransactionList()
// })
</script>
<template>
    <Toolbar>
        <template #start>
            <Button></Button>
        </template>
    </Toolbar>
<DataTable :value="userStore.transactionList" stripedRows tableStyle="min-width: 50rem" selectionMode="single" v-model:selection="transactionSelected">
    <Column field="crypto_code" header="Moneda"></Column>
    <Column field="crypto_amount" header="Monto"></Column>
    <Column field="money" header="En pesos"></Column>
    <column field="action" header="operacion">
        <template #body="{data}">
            <Tag :value="getTransactionName(data.action)" :severity="getSeverity(data.action)" />
        </template></column>
    <Column field="datetime" header="Fecha"></Column>
</DataTable>
</template>