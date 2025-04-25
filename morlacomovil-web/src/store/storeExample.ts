import Transaction from "@/models/transaction-model";
import User from "@/models/user-model";
import PriceService from "@/services/CriptoYa/priceService";
import TransactionService from "@/services/transactionService";
import { defineStore } from "pinia";
import {computed, ref} from "vue";
import { formatCurrency } from "@/helpers/helperFunctions";

export const useUserStore = defineStore("user-store", () => {

  const transactionService = new TransactionService()
  const transactionList = ref<Transaction[]>([]);

  const user = ref<User>();

  const fetchUser = () => {
    const rawuser = localStorage.getItem("user_data");
    const de = JSON.parse(rawuser!);
    user.value = de;
  };


  const updateUserAmount = (amount : number) => {
    if(user.value)
    user.value.balance = amount;
    localStorage.setItem("user_data", JSON.stringify(user.value));
    
    const usersRaw = localStorage.getItem("users");
    if (usersRaw) {
      const users = JSON.parse(usersRaw) as User[];
      const userIndex = users.findIndex(u => u.userId === user.value?.userId);
      
      if (userIndex !== -1) {
        users[userIndex].balance = amount;
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
    fetchUser();
  }

  // const setBalance = () => {
  //   if (transactionList.value) {
  //     const balanceMap: Record<string, number> = {};
  
  //     transactionList.value.forEach(tx => {
  //       const { crypto_code, action, crypto_amount } = tx; // currency: "BTC", "ETH", etc.
        
  //       if (!balanceMap[crypto_code]) {
  //         balanceMap[crypto_code] = 0;
  //       }
  
  //       if (action === "purchase") {
  //         balanceMap[crypto_code] += crypto_amount;
  //       } else if (action === "sell") {
  //         balanceMap[crypto_code] -= crypto_amount;
  //       }
  //     });

  //     balanceMap["ARS"] = parseFloat(user.value!.balance.toFixed(2));
  
  //     return balanceMap;
  //   }
  // };
  

  const getTransactionList = async () => {

    const params = {
      q: JSON.stringify({ user_id: user.value?.userId })
    }

    let rawTransactionList = await transactionService.get(params)

    transactionList.value = rawTransactionList.map(transaction => ({
      ...transaction,
      crypto_amount: Number(transaction.crypto_amount),
      money: Number(transaction.money),
    }));

  }

  const investmentResults = computed(() => {
    if (!transactionList.value || !user.value) return null;
  
    const results: Record<string, {
      name: string,
      symbol: string,
      invested: number,
      obtained: number,
      currentAmount: number,
      currentValue: number,
      profit: number,
      icon: string
    }> = {};
  
    // Inicializar con las criptomonedas disponibles
    cryptos.value.forEach(crypto => {
      results[crypto.symbol] = {
        name: crypto.name,
        symbol: crypto.symbol,
        invested: 0,
        obtained: 0,
        currentAmount: 0,
        currentValue: 0,
        profit: 0,
        icon: crypto.icon
      };
    });
  
    // Calcular balances y montos
    const balances: Record<string, number> = {};
    
    transactionList.value.forEach(tx => {
      const { crypto_code, action, crypto_amount, money } = tx;
  
      if (!balances[crypto_code]) {
        balances[crypto_code] = 0;
      }
  
      if (action === "purchase") {
        balances[crypto_code] += crypto_amount;
        results[crypto_code].invested += money;
      } else if (action === "sale") {
        balances[crypto_code] -= crypto_amount;
        results[crypto_code].obtained += money;
      }
    });
  
    // Calcular valor actual y ganancias
    Object.keys(balances).forEach(symbol => {
      const currentPrice = getCryptoSellPrice(symbol);
      results[symbol].currentAmount = balances[symbol];
      results[symbol].currentValue = balances[symbol] * currentPrice;
      results[symbol].profit = 
        (results[symbol].obtained + results[symbol].currentValue) - results[symbol].invested;
    });
  
    return results;
  });

  const cryptoInvestmentList = computed(() => {
    if (!investmentResults.value) return [];
    
    return Object.values(investmentResults.value).filter(crypto => 
      crypto.invested > 0 || crypto.obtained > 0 || crypto.currentAmount > 0
    );
  });
  
  const totalProfit = computed(() => {
    if (!investmentResults.value) return 0;
    return Object.values(investmentResults.value).reduce((sum, crypto) => sum + crypto.profit, 0);
  });

  const reset = () => {
    user.value = undefined;
  }

  interface Crypto {
    name: string;
    symbol: string;
    sellPrice: number;
    purchasePrice: number;
    icon: string;
  }
  
    const cryptos = ref<Crypto[]>([
      { name: 'Bitcoin', symbol: 'BTC', sellPrice: 0, purchasePrice: 0, icon: '/btc-bitcoin.png' },
      { name: 'Ethereum', symbol: 'ETH', sellPrice: 0, purchasePrice: 0, icon: '/eth-ethereum.png' },
      { name: 'Tether USDt', symbol: 'USDT', sellPrice: 0, purchasePrice: 0, icon: '/usdt-tether.png' }
    ]);
  
    let updateInterval: number | null = null;
    const priceService = ref<PriceService>(); // Inyecta tu servicio aquí
  
    const updateCryptoRates = async () => {
      try {
        const updatePromises = cryptos.value.map(async (x) => {
          const params = {
            exchange: 'bybitp2p',
            coin: x.symbol,
            fiat: 'ARS',
            volumen: 1
          };
          
          const crypto = await priceService.value!.get(params);
          return {
            ...x,
            purchasePrice: crypto.totalAsk,
            sellPrice: crypto.totalBid
          };
        });
  
        const updatedCryptos = await Promise.all(updatePromises);
        cryptos.value = updatedCryptos;
      } catch (error) {
        console.error('Error updating crypto rates:', error);
      }
    };
  
    const startAutoUpdate = (service: PriceService) => {
      priceService.value = service;
      updateCryptoRates();
      updateInterval = window.setInterval(updateCryptoRates, 30000000); //30000
    };
  
    const stopAutoUpdate = () => {
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
    };

    const getCryptoOptions = computed(() => {
      return cryptos.value.map(crypto => ({
        name: crypto.name,
        symbol: crypto.symbol,
        buyPrice: crypto.purchasePrice,
        sellPrice: crypto.sellPrice,
        formattedBuyPrice: formatCurrency(crypto.purchasePrice),
        formattedSellPrice: formatCurrency(crypto.sellPrice),
        icon: crypto.icon
      }));
    });

    const getCryptoSellPrice = (symbol: string): number => {
      const crypto = cryptos.value.find(c => c.symbol === symbol);
      return crypto ? crypto.sellPrice : 0;
    };

    const getCryptoBuyPrice = (symbol: string): number => {
      const crypto = cryptos.value.find(c => c.symbol === symbol);
      return crypto ? crypto.purchasePrice : 0;
    };

    const getCryptoName = (symbol: string) => {
      return getCryptoOptions.value.find((c) => c.symbol === symbol)?.name
    };

    const getCryptoIcon = (symbol: string) => {
      return getCryptoOptions.value.find((c) => c.symbol === symbol)?.icon
  }
    
  return {
    user,
    transactionList,
    cryptos,
    getCryptoOptions,
    investmentResults,
    totalProfit,
    cryptoInvestmentList,
    fetchUser,
    updateUserAmount,
    getTransactionList,
    startAutoUpdate,
    stopAutoUpdate,
    getCryptoSellPrice,
    getCryptoBuyPrice,
    getCryptoName,
    getCryptoIcon,
    reset
  };
});
