import criptoYaClient from "@/criptoYaApiclient";

export default class PriceService {
    async get(params: any) {
        const response = await criptoYaClient.get(`/${params.exchange}/${params.coin}/${params.fiat}/${params.volumen}`); //ESTO ES HORRIBLE, DEBERIA FUNCIONAR CON PARAMETROS
        return response.data;
    }
}