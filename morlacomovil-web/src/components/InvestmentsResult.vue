<script setup lang="ts">
import { formatCurrency } from '@/helpers/helperFunctions'
import { useUserStore } from '@/store/storeExample'
import { computed } from 'vue'

const userStore = useUserStore()

const cryptoInvestmentList = computed(() => userStore.cryptoInvestmentList)
const totalProfit = computed(() => userStore.totalProfit)
</script>

<template>
  <div class="investment-results">
    <h2>Análisis de Inversión</h2>

    <div v-if="cryptoInvestmentList.length > 0">
      <div class="crypto-card" v-for="crypto in cryptoInvestmentList" :key="crypto.symbol">
        <div class="crypto-header">
          <img :src="crypto.icon" :alt="crypto.name" class="crypto-icon" />
          <h3>{{ crypto.name }} ({{ crypto.symbol }})</h3>
        </div>

        <div class="crypto-stats">
          <div class="stat">
            <span class="stat-label">Invertido:</span>
            <span class="stat-value"> {{ formatCurrency(crypto.invested) }} ARS</span>
          </div>
          <div class="stat">
            <span class="stat-label">Obtenido en ventas:</span>
            <span class="stat-value">{{ formatCurrency(crypto.obtained) }}  ARS</span>
          </div>
          <div class="stat">
            <span class="stat-label">Balance actual:</span>
            <span class="stat-value"
              >{{ crypto.currentAmount.toFixed(8) }} {{ crypto.symbol }}</span
            >
          </div>
          <div class="stat">
            <span class="stat-label">En pesos:</span>
            <span class="stat-value">{{ formatCurrency(crypto.currentValue) }}  ARS</span>
          </div>
          <div class="stat">
            <span class="stat-label">Ganancia/Pérdida:</span>
            <span
              class="stat-value"
              :class="{ profit: crypto.profit >= 0, loss: crypto.profit < 0 }"
            >
              {{ formatCurrency(crypto.profit) }}
              ({{ ((crypto.profit / crypto.invested) * 100 || 0).toFixed(2) }}%)
            </span>
          </div>
        </div>
      </div>

      <div class="total-summary">
        <h3>Resumen Total</h3>
        <div class="total-profit" :class="{ profit: totalProfit >= 0, loss: totalProfit < 0 }">
          {{ formatCurrency(totalProfit) }}
        </div>
      </div>
    </div>

    <div v-else class="empty-state">No hay datos de inversión disponibles</div>
  </div>
</template>

<style scoped>
.investment-results {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.crypto-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.crypto-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.crypto-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.crypto-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat {
  display: flex;
  justify-content: space-between;
}

.stat-label {
  font-weight: 500;
  color: #666;
}

.stat-value {
  font-weight: 600;
}

.profit {
  color: #10b981;
}

.loss {
  color: #ef4444;
}

.total-summary {
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.total-profit {
  font-size: 24px;
  font-weight: 700;
  margin-top: 10px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #64748b;
}
</style>
