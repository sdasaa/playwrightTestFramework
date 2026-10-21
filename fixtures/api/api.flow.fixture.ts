import {preAuthorizedContextsFix as base, expect} from '@fixtures/index';
import type {AllUserAuthApiReqType, AuthApiRespType, GetAllProdcutApiRespType, OrderApiAllReqDataType, OrderApiAllRespDataType,
                UserApiAllReqDataType, UserApiAllRespDataType, AddProductToCartReqODType, CreateAnOrderApiReqODType, 
            } from '@myTypes/index'
import {ENDPOINTS, ProductApiClient, UserApiClient, OrdersApiClient} from '@api/index'  
import {productSelector, logger} from '@utils/index'

type ApiReqOptions = {
    authApiReqOD: Partial<AllUserAuthApiReqType["eventHubUser"]>,
    // addProductToCartReqODType: Partial<AddProductToCartReqODType>,
    addProductToCartReqODType1: AddProductToCartReqODType['productName']
    createAnOrderApiReqOD: Partial<CreateAnOrderApiReqODType>
};

type ApiRespOPtions = {
    getAllProdcutApiResp: GetAllProdcutApiRespType,
    addProductToCartApiResp: { addProductToCartApiResp : UserApiAllRespDataType["addProductToCartApiResp"], productIDOfSelectedItem: string }
    deleteAProudctApiResp: UserApiAllRespDataType['deleteAProductInCartResp'],
    createOrderApiResp: OrderApiAllRespDataType["createOrderApiResp"]
};

export const apiFlowFix = base.extend<ApiReqOptions & ApiRespOPtions>({
    authApiReqOD : [{}, {option: true}],
    addProductToCartReqODType1 : [ '', {option: true}],
    createAnOrderApiReqOD : [{}, {option : true}],

    getAllProdcutApiResp : async ({authorizedApiRequestContext}, use) => {
        logger.info(`In getAllProdcutApiResp cf, invoking getAllProducts API`)
        const response = await new ProductApiClient(authorizedApiRequestContext) 
                .getAllProducts(
                        {
                            data : {}
                        }
                )
        await use(await response.json())
    },

    addProductToCartApiResp : async ({authorizedApiRequestContext,authenticateAnUser, getAllProdcutApiResp, addProductToCartReqODType1}, use) => {
        logger.info(`In addProductToCartApiResp cf, invoking addProductToCart API`)
        const allProducts = getAllProdcutApiResp["data"]
        const userApiClient = new UserApiClient(authorizedApiRequestContext);
        const selectedProduct = addProductToCartReqODType1
                                ? allProducts.find(p => p.productName == addProductToCartReqODType1) || allProducts[Math.floor(Math.random() * allProducts.length)]
                                : allProducts[Math.floor(Math.random() * allProducts.length)]
        const payload: UserApiAllReqDataType["addProductToCartApiReq"] = {
            "_id" : authenticateAnUser.authResponse.userId,
            "product" : selectedProduct
        }
        const respone = await userApiClient.addProductToCart({data: payload} );
        const json:UserApiAllRespDataType["addProductToCartApiResp"] = await respone.json();
        await use({addProductToCartApiResp: json, productIDOfSelectedItem: selectedProduct['_id']})
        const deleteResponse: UserApiAllRespDataType['deleteAProductInCartResp'] = await (await userApiClient.deleteProductFromCart(payload['_id'], payload['product']._id)).json()
        expect(deleteResponse.message).toBe('Product Removed from cart');
    },

    createOrderApiResp : async ({authorizedApiRequestContext, createAnOrderApiReqOD, authenticateAnUser, getAllProdcutApiResp}, use) => {
        logger.info(`In createOrderApiResp cf, invoking createAnOrder API`)
        const productsToOrderOD = productSelector(getAllProdcutApiResp, createAnOrderApiReqOD)
        const payload: OrderApiAllReqDataType["createOrderApiReq"] = {
            orders : productsToOrderOD.map(p => ({country: "india", productOrderedId: p._id}))
        }
        const response = await new OrdersApiClient(authorizedApiRequestContext).createAnOrder({ data : payload})
        await use(await response.json());
    }

})

