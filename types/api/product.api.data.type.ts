
export interface GetAllProdcutApiRespType {
    data: [
        {
            _id: string,
            productName: string,
            productCategory: string,
            productSubCategory: string,
            productPrice: number,
            productDescription: string,
            productImage: string,
            productRating: string,
            productTotalOrders: string,
            productStatus: boolean,
            productFor: string,
            productAddedBy: string,
            __v: number

        }
    ]
}