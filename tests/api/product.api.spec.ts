import {apiClientsFix as test, expect} from '@fixtures/index';
import {myTestTags} from '@utils/index'
import {GetAllProdcutApiRespType} from '@myTypes/index'
import { APIResponse } from '@playwright/test';

test.describe('API - Products Api Tests', ()=>{
    test(`Validate getAllProducts Api using ApiClient-Fix`, 
            
        {tag: [myTestTags.api, myTestTags.regression, myTestTags.prodcutTests, myTestTags.p1]},    
        async ({productApiClient}) => {
        
        let response: APIResponse
        let json: GetAllProdcutApiRespType

        await test.step(`Invoke GetAllProducts Api`, async () => {
            response = await productApiClient.getAllProducts({data : "{}"});
            json  = await response.json();
        })

        await test.step(`Validate GetAllProducts Response`, async () => {
            expect(response).toBeOK()
            expect(json.data.length).toBe(3)
            expect(json.data.map(item => item.productName)).toEqual(expect.arrayContaining(['ZARA COAT 3', 'iphone 13 pro', 'ADIDAS ORIGINAL']))
            expect(json.data?.filter(item => item.productPrice < 20000).find(item => item.productName == 'ZARA COAT 3')).toHaveProperty("productDescription", "Apple phone")
        })       
    })
})