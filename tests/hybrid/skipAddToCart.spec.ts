import {expect, allCombinedFix as test} from '@fixtures/index'
import { myTestTags } from '@utils/index'

test.use({addProductToCartReqODType1 : "iphone 13 pro"})


test.describe(`HYBRID - Skip AddToCart Tests`, () => {

    test(`Validate Skip AddToCart functionality`, 
        {tag: [myTestTags.hybrid, myTestTags.regression, myTestTags.cartTests, myTestTags.p1]},
        async ({addProductToCartApiResp, preAuthorizedPageObjects}) => {
        
        const loginPage = preAuthorizedPageObjects.loginPage
        const dashboardPage = preAuthorizedPageObjects.dashboardPage

        await test.step(`Validating if AddToCart Api is successfull`, async () => {
            expect(addProductToCartApiResp.addProductToCartApiResp.message).toContain("Product Added To Cart")
        })
        await test.step(`Validate Skipping Login and landing on DashboardPage`, async () => {
            await loginPage.navigateToLoginPage();
            await expect(dashboardPage.SHOPPING_CART_BUTTON).toBeVisible();
        })
        await test.step(`Validate if UI reflects AddToCart api action`, async () => {
            await expect(dashboardPage.ITEMS_IN_CART_ELEMENT).toHaveText("1")
        })
    })
})