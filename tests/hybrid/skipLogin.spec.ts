import {expect, allCombinedFix as test} from '@fixtures/index';
import { myTestTags } from '@utils/index';

test.use({ authApiReqOD : { "userEmail" : "test1@ecommerce.com"}});

test.describe('HYBRID - Skip Login Tests', () => {

    test(`Validate Skipping of Login Page`,
        {tag: [myTestTags.hybrid, myTestTags.regression, myTestTags.authTests, myTestTags.p1]}, 
        async({preAuthorizedPageObjects, getAllProdcutApiResp}) =>{
        
        const loginPage = preAuthorizedPageObjects.loginPage;
        const dashboardPage = preAuthorizedPageObjects.dashboardPage;

        await test.step('Validate skipping of Login Page', async () =>{
            await loginPage.navigateToLoginPage()
            expect(dashboardPage.ALL_PRODUCTS_LIST.nth(0)).toBeVisible();
            expect(dashboardPage.SHOPPING_CART_BUTTON).toBeVisible();
        })

        await test.step('Validate if the products are displayed in Dashboard Page: Type1', async () =>{
            expect(await dashboardPage.ALL_PRODUCTS_LIST.nth(0).textContent()).toContain(getAllProdcutApiResp.data?.at(0)?.productName ?? '')
            expect(await dashboardPage.ALL_PRODUCTS_LIST.nth(1).textContent()).toContain(getAllProdcutApiResp.data?.at(1)?.productName ?? '')
            expect(await dashboardPage.ALL_PRODUCTS_LIST.nth(2).textContent()).toContain(getAllProdcutApiResp.data?.at(2)?.productName ?? '')
            //expect(await dashboardPage.ALL_PRODUCTS_LIST.nth(0).textContent()).toEqual(expect.arrayContaining([getAllProdcutApiResp.data?.at(2)?.productName ?? '']))
        })

        await test.step('Validate if the products are displayed in Dashboard Page: Type2', async () =>{
            const allProductNames = getAllProdcutApiResp.data?.map(item => item.productName) ?? [];
            expect(await dashboardPage.ALL_PRODUCTS_NAMES.allTextContents()).toEqual(expect.arrayContaining(allProductNames));
            expect(dashboardPage.ALL_PRODUCTS_NAMES).toContainText(allProductNames)
        })
    })
})
