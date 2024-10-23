import client from "@/client";

export default class TransactionService {
    async get(params: any) {
        console.log("query", params)
        const response = await client.get(`transactions`, { params });
        return response.data;
    }

    async purchase(params: any) {
        const response = await client.post(`transactions`, { params });
        return response.data;
    }
}
