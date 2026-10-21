import { ENDPOINTS } from '@api/endpoints'
import {allCombinedFix as test, expect} from '@fixtures/index'
import type {UserApiAllReqDataType, UserApiAllRespDataType} from '@myTypes/index'
import {logger, myTestTags} from '@utils/index'
import { log } from 'node:console'


test.describe(`API - User API Tests`, () => {

test(`Add Item to cart`,
    
    {tag: [myTestTags.api, myTestTags.regression, myTestTags.cartTests, myTestTags.p1]},
    async ({authenticateAnUser,getAllProdcutApiResp, userApiClient}) => {
    let addToCartReq: UserApiAllReqDataType['addProductToCartApiReq']

        await test.step(`Create payload for AddToCart Api`, () => {
            logger.info(Math.floor(Math.random() * getAllProdcutApiResp.data.length))
            addToCartReq = {
                "_id" : authenticateAnUser.authResponse.userId,
                "product" : getAllProdcutApiResp.data[Math.floor(Math.random() * getAllProdcutApiResp.data.length)]
            }
        })
        await test.step(`Invoke AddProductToCart Api`, async () => {
            const response = await userApiClient.addProductToCart({data: addToCartReq})
            const json: UserApiAllRespDataType['addProductToCartApiResp'] = await response.json()
            await expect(response).toBeOK();
            expect(json.message).toBe("Product Added To Cart")
            expect(json).toMatchObject({
            "message": "Product Added To Cart"
            })
        })
    })

    test(`Get the count of the Cart`,

    {tag: [myTestTags.api, myTestTags.regression, myTestTags.cartTests, myTestTags.p1]},
    async ({authenticateAnUser, userApiClient}) => {

        await test.step(`Invoke GetCartCount Api`, async () => {
            const response = await userApiClient.getCartCount(authenticateAnUser.authResponse.userId)
            const json: UserApiAllRespDataType['getCartCountResp'] = await response.json()
            logger.info(`${JSON.stringify(json)}`)
            await expect(response).toBeOK();
            await expect(json.message).toBe("Cart Data Found")
        })
    })


    test(`Get products in cart`,

    {tag: [myTestTags.api, myTestTags.regression, myTestTags.cartTests, myTestTags.p1]},
    async ({authenticateAnUser, userApiClient}) => {

        await test.step(`Invoke GetProductsInCart Api`, async () => {
            const response = await userApiClient.getProductsInCart(authenticateAnUser.authResponse.userId)
            const json: UserApiAllRespDataType['getProductsInCartResp'] = await response.json()
            logger.info(`${JSON.stringify(json)}`)
            await expect(response).toBeOK();
            expect(json.message).toBe("Cart Data Found")
        })
    })
})