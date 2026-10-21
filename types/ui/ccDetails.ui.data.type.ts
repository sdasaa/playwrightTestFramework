export interface CcDetailsUiTdType {
    ccNumber : string,
    expiry : {
        month: string,
        year: string
    },
    cvvCode : string,
    nameOnCard: string,
    couponToApply: string
}