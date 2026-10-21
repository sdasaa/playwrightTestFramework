import { ENDPOINTS } from "@api/endpoints";
import { BaseApi, postOptions } from "@api/index";
import {APIRequestContext, APIResponse} from '@playwright/test'

export class ProductApiClient extends BaseApi{
    
    constructor(request: APIRequestContext, authToken?: string){
        super(request, authToken)
    }

    async getAllProducts(options: postOptions): Promise<APIResponse>{
        return await this.post(ENDPOINTS.product.getAllProducts, options);
    }

}