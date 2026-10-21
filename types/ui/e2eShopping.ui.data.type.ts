import {CcDetailsUiTdType} from "./ccDetails.ui.data.type"

export interface E2eShoppingDetailsUiTdType { 
    allProducts: string[],
    productToSelect: string,
    quantity: string,
    ccDetails: CcDetailsUiTdType,
    country: string
}

export interface E2eShoppingScenariosUiTdType {
    validIphoneCCwCoupon: E2eShoppingDetailsUiTdType,
    validZaraCCwoCoupon: E2eShoppingDetailsUiTdType,
}
