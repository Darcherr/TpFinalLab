<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { formatCurrency } from '@/helpers/helperFunctions'
import TransactionService from '@/services/transactionService'
import { useUserStore } from '@/store/storeExample'
import { ref, watch, onMounted, computed } from 'vue'

const transactionService = new TransactionService()

const userStore = useUserStore()

const selectedCrypto = ref()
const amountPesos = ref<any | null>(null)
const amountCrypto = ref<any | null>(null)
const lastChanged = ref<'pesos' | 'crypto'>('pesos')
const isPurchasing = ref<boolean>(false)

const updateCrypto = () => {
  if (amountPesos.value !== null && selectedCrypto.value) {
    amountCrypto.value = amountPesos.value / userStore.getCryptoBuyPrice(selectedCrypto.value)
  } else {
    amountCrypto.value = null
  }
}

const updatePesos = () => {
  if (amountCrypto.value !== null && selectedCrypto.value) {
    amountPesos.value = amountCrypto.value * userStore.getCryptoBuyPrice(selectedCrypto.value)
  } else {
    amountPesos.value = null
  }
}

const maxARS = computed(() => {
  return userStore.user?.balance
})

const currentBalance = computed(() => {
  return userStore.user ? userStore.user.balance - amountPesos.value : 0
})

const purchase = async () => {
  const params = {
    user_id: userStore.user?.userId,
    action: 'purchase',
    crypto_code: selectedCrypto.value,
    crypto_amount: amountCrypto.value,
    money: amountPesos.value.toFixed(2),
    datetime: new Date().toLocaleDateString('es-ES', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  console.log(params)
  try {
    isPurchasing.value = !isPurchasing.value
    await transactionService.post(params)
    userStore.updateUserAmount(currentBalance.value)
  } catch (error) {
    console.error('Error en la compra:', error)
  } finally {
    resetAmounts()
    await userStore.getTransactionList()
    isPurchasing.value = !isPurchasing.value
  }
}

watch(selectedCrypto, () => {
  if (lastChanged.value === 'pesos') {
    updateCrypto()
  } else {
    updatePesos()
  }
})

const resetAmounts = () => {
  amountCrypto.value, amountPesos.value = 0;
}


const cryptoOptions = computed(() => {
  return userStore.getCryptoOptions.map((crypto) => ({
    label: `${crypto.name} (Compra: ${crypto.formattedBuyPrice} ARS | Venta: ${crypto.formattedSellPrice} ARS)`,
    value: crypto.symbol,
    data: crypto
  }))
})

onMounted(async () => {
  userStore.fetchUser()
})

</script>

<template>
  <form @submit.prevent="purchase()">
    <div class="grid">
      <div class="col-8">
        <div class="grid">
          <div class="col-12 md:col-6">
            <label class="block mb-2 font-medium" for="crypto">Criptomoneda</label>
            <Dropdown
              v-model="selectedCrypto"
              :options="cryptoOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona una cripto"
              class="w-full"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center gap-2">
                  <img
                    :src="userStore.getCryptoIcon(slotProps.value)"
                    :alt="userStore.getCryptoName(slotProps.value)"
                    style="width: 20px; height: 20px"
                  />
                  <div>
                    <div class="font-bold">{{ userStore.getCryptoName(slotProps.value) }}</div>
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center gap-2">
                  <img
                    :src="slotProps.option.data.icon"
                    :alt="slotProps.option.data.name"
                    style="width: 20px; height: 20px"
                  />
                  <div>
                    <div class="font-bold">{{ slotProps.option.data.name }}</div>
                    <div class="flex gap-3 text-sm">
                      <span class="text-green-500"
                        >Compra: {{ slotProps.option.data.formattedBuyPrice }} ARS</span
                      >
                      <span class="text-red-500"
                        >Venta: {{ slotProps.option.data.formattedSellPrice }} ARS</span
                      >
                    </div>
                  </div>
                </div>
              </template>
            </Dropdown>
          </div>
          <div class="col-12 md:col-6">
            <label class="block mb-2 font-medium" for="pesos">Monto en Pesos</label>
            <InputNumber
              :disabled="!selectedCrypto"
              id="pesos"
              v-model="amountPesos"
              mode="currency"
              currency="ARS"
              locale="es-AR"
              :min="0"
              :max="maxARS"
              class="w-full"
              @input="
                (e) => {
                  amountPesos = e.value
                  lastChanged = 'pesos'
                  updateCrypto()
                }
              "
            />
            <small id="amountPesos-help" class="p-info info-small" v-if="amountPesos > maxARS!">
              <i class="pi pi-exclamation-triangle"></i>No tienes fondos suficientes.
            </small>
            <small id="amountPesos-help" class="p-info info-small" v-else>
              <i class="pi pi-info-circle"></i> {{ formatCurrency(currentBalance) }} disponibles.
            </small>
          </div>
          <div class="col-12 md:col-6">
            <label class="block mb-2 font-medium" for="cryptoAmount">Monto en Cripto</label>
            <InputNumber
              :disabled="!selectedCrypto"
              id="cryptoAmount"
              v-model="amountCrypto"
              :maxFractionDigits="8"
              class="w-full"
              @input="
                (e) => {
                  amountCrypto = e.value
                  lastChanged = 'crypto'
                  updatePesos()
                }
              "
            />
          </div>
          <div class="col-12 md:col-6" style="padding-top: 2rem">
            <Button label="Comprar" type="submit" :loading="isPurchasing" />
          </div>
        </div>
      </div>
      <div class="col-4"></div>
    </div>
  </form>
</template>

<style scoped>
.info-small {
  display: block;
  padding: 0.2rem;
}
.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.crypto-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
