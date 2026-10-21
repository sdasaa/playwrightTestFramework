import {allCombinedFix as test, expect} from '@fixtures/index'
import { OrderApiAllReqDataType, OrderApiAllRespDataType } from '@myTypes/index'
import {logger, myTestTags} from '@utils/index'
import {orderApiReqData} from '@testData/index'
import { APIResponse } from '@playwright/test'


test.describe('API - Order Api Tests', ()=>{

    test(`Validate Order Api's`, 
    {tag: [myTestTags.api, myTestTags.regression, myTestTags.orderTests, myTestTags.p1]},    
    async ({addProductToCartApiResp, ordersApiClient}) => {
        
        let payload: OrderApiAllReqDataType['createOrderApiReq']
        let respone: APIResponse;
        let json: OrderApiAllRespDataType['createOrderApiResp']

        await test.step(`Build Create Order payload`, async () => {
            payload = {
                orders : [
                    {
                        country: orderApiReqData.createOrderApiReq.orders[0].country,
                        productOrderedId : addProductToCartApiResp.productIDOfSelectedItem
                    }
                ]
            }
            logger.info(`Place an Order Request Body ${payload}`)
        })

        await test.step(`Invoking PlaceAnOrde Api`, async () => {
            respone = await ordersApiClient.createAnOrder({data: payload})
            json = await respone.json();
        })

        await test.step(`Validating Api response`, async () => {
            expect(respone).toBeOK();
            expect(json.message).toBe("Order Placed Successfully")
        })
    })
})