import { ENDPOINTS } from "@api/endpoints";
import { BaseApi,getOptions,postOptions } from "@api/index";
import { APIRequestContext, APIResponse } from "@playwright/test";


export class UserApiClient extends BaseApi{
    
    constructor(request: APIRequestContext, authToken?: string){
            super(request, authToken)
    }

    async addProductToCart(options: postOptions): Promise<APIResponse>{
        return await this.post(ENDPOINTS.user.addToCart, options)
    }

    async getCartCount(userID: string): Promise<APIResponse>{
        return await this.get(ENDPOINTS.user.getCartCount(userID));
    }

    async getProductsInCart(userID: string): Promise<APIResponse>{
        return await this.get(ENDPOINTS.user.getCartCount(userID))
    }

    async deleteProductFromCart(userID: string, productID: string):Promise<APIResponse>{
        return await this.delete(ENDPOINTS.user.deleteAProduct(userID, productID))
    }
}