import Transaction from "@/models/transaction-model";
import User from "@/models/user-model";
import TransactionService from "@/services/transactionService";
import { defineStore } from "pinia";
import { ref} from "vue";
export const useUserStore = defineStore("user-store", () => {

  const transactionService = new TransactionService()
  const transactionList = ref<Transaction[]>([]);

  const user = ref<User>();

  const setUser = (userData : any) => {
    user.value = userData
    console.log("hola",user.value)
  };

  const getTransactionList = async () => {
    const params = {
      q: JSON.stringify({ user_id: '12345DarcherTest' })
    }
  
    let rawTransactionList = await transactionService.get(params)

    transactionList.value = rawTransactionList.map(transaction => ({
      ...transaction,
      crypto_amount: Number(transaction.crypto_amount),
      money: Number(transaction.money),
    }));
    console.log("transactionList", transactionList.value)
  }

  const setBalance = () => {

  }

  const reset = () => {
    user.value = undefined;
  }

  return {
    user,
    transactionList,
    setUser,
    getTransactionList,
    reset
  };
});
