import {GetAllProdcutApiRespType} from './product.api.data.type'

interface AddProductToCartApiReqType {
    _id : string,
    product: GetAllProdcutApiRespType["data"][number]
}

interface AddProductToCartApiRespType {
    message: string,
}

interface UpdateProductInCartApiReqType {
    quantity : number
}

interface UpdateProductInCartRespType {
    message : string
}

interface GetCartCountResp {
    count: string,
    message: string
}

interface GetProductsInCartResp {
    products: AddProductToCartApiReqType['product'],
    count: string,
    message: string
}


interface DeleteAProductInCart {
    message: string
}

export interface UserApiAllReqDataType {
    addProductToCartApiReq: AddProductToCartApiReqType
    updateProductInCartApiReq : UpdateProductInCartApiReqType
}

export interface UserApiAllRespDataType {
    addProductToCartApiResp : AddProductToCartApiRespType,
    getCartCountResp: GetCartCountResp,
    getProductsInCartResp: GetProductsInCartResp,
    deleteAProductInCartResp: DeleteAProductInCart,
    updateProductInCartResp : UpdateProductInCartRespType
}
