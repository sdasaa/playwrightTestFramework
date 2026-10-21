// The first | is just for uniformity and has no actual meaning
// We use interface for simple object shapes and for complex conditions and shapes, use types

export type CreateAnOrderApiReqODType =
    | {productsToOverride: string[]; count?: never }
    | {count: number; productsToOverride?: never}


export interface UpdateAnOrderApiReqODType {
    orderID?: string,
}

