
interface CreateOrderApiReqType {
    orders: 
        {
            country: string,
            productOrderedId: string
        }[];
}

interface CreateOrderApiRespType {
    orders: string[],
    productOrderId: string[],
    message: string
}

interface UpdateAnOrderApiReqType {
    orders : Array<
        {
            "orderID" : string
        }
    >
}

export interface OrderApiAllReqDataType {
    createOrderApiReq : CreateOrderApiReqType,
    updateAnOrderApiReq : UpdateAnOrderApiReqType
}

export interface OrderApiAllRespDataType {
    createOrderApiResp: CreateOrderApiRespType
}