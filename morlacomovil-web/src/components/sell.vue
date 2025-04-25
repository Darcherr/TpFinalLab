<script setup lang="ts">
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import TransactionService from '@/services/transactionService'
import { useUserStore } from '@/store/storeExample'
import { computed, ref, watch } from 'vue'

const userStore = useUserStore()

const selectedCrypto = ref<any>()
const cryptoAmount = ref<any>(null)
const arsAmount = ref<any>(null)
const lastChanged = ref<'pesos' | 'crypto'>('pesos')
const isSelling = ref<boolean>(false)
const transactionService = new TransactionService();

const cryptoOptions = computed(() => {
  const balances = getCryptoAmount.value
  const cryptoFilteredList = userStore.getCryptoOptions.filter((crypto) => {
    return balances[crypto.symbol] > 0
  })

  return cryptoFilteredList.map((x) => ({
    label: `${x.name} (${x.symbol}) - Venta: ${x.formattedSellPrice} ARS`,
    value: x.symbol,
    data: x
  }))
})

const getCryptoAmount = computed(() => {
  if (userStore.transactionList) {
    const balanceMap: Record<string, number> = {}

    userStore.transactionList.forEach((tx) => {
      const { crypto_code, action, crypto_amount } = tx

      if (!balanceMap[crypto_code]) {
        balanceMap[crypto_code] = 0
      }
      if (action === 'purchase') {
        balanceMap[crypto_code] += crypto_amount
      } else if (action === 'sale') {
        balanceMap[crypto_code] -= crypto_amount
      }
    })

    return balanceMap
  } else return {}
})

const currentBalance = computed(() => {
  return userStore.user ? userStore.user.balance + arsAmount.value : 0
})

watch(selectedCrypto, () => {
  if (lastChanged.value === 'pesos') {
    updateCrypto()
  } else {
    updatePesos()
  }
})

const sell = async () => {

  const params = {
    user_id: userStore.user?.userId,
    action: 'sale',
    crypto_code: selectedCrypto.value,
    crypto_amount: cryptoAmount.value,
    money: arsAmount.value.toFixed(2),
    datetime: new Date().toLocaleDateString('es-ES', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  try {
    isSelling.value = !isSelling.value
    await transactionService.post(params)
    userStore.updateUserAmount(currentBalance.value)
  } catch (error) {
    console.error('Error en la venta:', error)
  } finally {
    resetAmounts()
    await userStore.getTransactionList()
    isSelling.value = !isSelling.value
  }
}

const resetAmounts = () => {
  cryptoAmount.value, arsAmount.value = 0
}

const updatePesos = () => {
  if (cryptoAmount.value !== null && selectedCrypto.value) {
    arsAmount.value = cryptoAmount.value * userStore.getCryptoSellPrice(selectedCrypto.value)
  } else {
    arsAmount.value = null
  }
}

const updateCrypto = () => {
  if (arsAmount.value !== null && selectedCrypto.value) {
    cryptoAmount.value = arsAmount.value / userStore.getCryptoSellPrice(selectedCrypto.value)
  } else {
    cryptoAmount.value = null
  }
}
</script>

<template>
  <form @submit.prevent="sell()">
    <div class="grid">
      <div class="col-8">
        <div class="grid">
          <div class="col-12 md:col-6">
            <label class="block mb-2 font-medium">Criptomoneda</label>
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
                    <div class="font-bold">{{ userStore.getCryptoName(slotProps.value) }} </div>
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
                    <div class="flex gap-3 text-sm">
                      <span class="text-black-500"
                        >Cantidad: {{ getCryptoAmount[slotProps.option.data.symbol] }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </Dropdown>
          </div>
          <div class="col-12 md:col-6">
            <label class="block mb-2 font-medium"> Monto a vender </label>
            <InputNumber
              :disabled="!selectedCrypto"
              v-model="cryptoAmount"
              :min="0"
              :max="getCryptoAmount[selectedCrypto] || 0"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="8"
              class="w-full"
              placeholder="Ingrese el monto a vender"
              @input="
                (e) => {
                  cryptoAmount = e.value
                  lastChanged = 'crypto'
                  updatePesos()
                }
              "
            />
            <div v-if="selectedCrypto">
              <small
                id="amountPesos-help"
                class="p-info info-small text-gray-500"
                v-if="cryptoAmount > getCryptoAmount[selectedCrypto]"
              >
                <i class="pi pi-exclamation-triangle"></i>No tienes fondos suficientes.
              </small>
              <small id="amountPesos-help" class="p-info info-small text-gray-500" v-else>
                <i class="pi pi-info-circle"></i>
                {{ getCryptoAmount[selectedCrypto] - cryptoAmount }} disponibles.
              </small>
            </div>
          </div>
          <div class="col-12 md:col-8">
            <label class="block mb-2 font-medium">Recibirás en ARS</label>
            <InputNumber
              :disabled="!selectedCrypto"
              v-model="arsAmount"
              mode="currency"
              currency="ARS"
              locale="es-AR"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              class="w-full"
              placeholder="Monto equivalente en ARS"
              @input="
                (e) => {
                  arsAmount = e.value
                  lastChanged = 'pesos'
                  updateCrypto()
                }
              "
            />
          </div>
          <div class="col-12 md:col-4" style="padding-top: 2rem">
            <Button
              type="submit"
              label="Vender"
              class="p-button-danger"
              :loading="isSelling"
              :disabled="!selectedCrypto || !cryptoAmount || parseFloat(cryptoAmount) <= 0"
            />
          </div>
        </div>
      </div>
      <div class="col-4"></div>
    </div>
  </form>
</template>

<style scoped></style>
