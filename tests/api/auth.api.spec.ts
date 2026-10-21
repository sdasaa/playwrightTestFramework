import {apiClientsFix as test, expect} from '@fixtures/index'
import {authApiReqData} from '@testData/index'
import {AuthApiClient, ENDPOINTS} from '@api/index'
import {AuthApiRespType} from '@myTypes/index'
import {logger, myTestTags} from '@utils/index'
import { APIResponse } from '@playwright/test'

test.describe(`API - Login API Tests`, () => {

    test(`Validate Login Api`, 
        {tag: [myTestTags.api, myTestTags.regression, myTestTags.authTests, myTestTags.p1]},
        async ({request, selectAnUser}) => {

        let response: APIResponse;
        let headers: Record<string, string>;
        let loginApiData: AuthApiRespType;

        
        await test.step(`Invoke Auth Api`, async () => {
            response = await new AuthApiClient(request).loginToApp({data: selectAnUser});
            headers = response.headers();
            loginApiData = await response.json();
        })
        
        await test.step(`Validate the Auth Api response`, async () => {
            await expect(response).toBeOK();
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200)
            expect(response.statusText()).toBe("OK");
            expect(headers?.['content-type']).toContain("application/json");
        })
    })
})