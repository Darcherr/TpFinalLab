import client from "@/client";
import Transaction from "@/models/transaction-model";

export default class TransactionService {
    async get(params: any): Promise<Transaction[]> {
        const response = await client.get('transactions', {params} );
        console.log(response.data)
        return response.data;
    }

    async post(params: any) {
        const response = await client.post('transactions',  params );
        return response.data;
    }

    async delete(id: string) {
        await client.delete(`transactions/${id}`);
    }
}
