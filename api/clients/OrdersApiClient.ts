import {APIRequestContext, APIResponse} from '@playwright/test'
import { BaseApi, postOptions } from "@api/index";
import {OrderApiAllRespDataType} from "@myTypes/index";
import { ENDPOINTS } from '@api/endpoints';



export class OrdersApiClient extends BaseApi{
    static fetchOrderIDsFromOrderApiResp: any;

    constructor(request: APIRequestContext, authToken?: string){
        super(request, authToken)
    }

    async createAnOrder(options: postOptions): Promise<APIResponse>{
        return await this.post(ENDPOINTS.orders.createOrder, options);
    }

    fetchOrderIDsFromCreateAnOrderResp(response: OrderApiAllRespDataType["createOrderApiResp"]): string[]{
        return response.orders;
    }
}