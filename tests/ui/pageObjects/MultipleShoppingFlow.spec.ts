// @ts-check
import {allCombinedFix as test, expect} from "@fixtures/index"
import {authUiTestData, e2eShoppingScenariosUiTestData} from "@testData/index"
import {myTestTags, myTestConfig, logger} from '@utils/index'


test.describe('Suite-MultipleTests-E2E Shopping flow', () => {
    
    test(`TC01-Validate Login Feature`, 

        {tag: [myTestTags.ui, myTestTags.smoke, myTestTags.e2e, myTestTags.p1]},
        async ({unAuthorizedPageObjects}) => {
        
        const loginPage =  unAuthorizedPageObjects.loginPage
        const dashboardPage =  unAuthorizedPageObjects.dashboardPage 
        
        await test.step('Launch the Application and Login to it', async () =>{
            await loginPage.navigateToLoginPage();
            await expect(loginPage.USERNAME_EDITBOX).toBeVisible();
            await expect(loginPage.pageObject).toHaveTitle("Let's Shop");
            await loginPage.loginToApplication(authUiTestData.validCredentials.username, authUiTestData.validCredentials.password);
            await expect(dashboardPage.ALL_PRODUCTS_LIST.first()).toBeVisible();
        })
    })

    test(`TC02-Validate SearchAndSelect Feature`, 
        {tag: [myTestTags.ui, myTestTags.smoke, myTestTags.e2e, myTestTags.p1]},
        async ({preAuthorizedPageObjects}) => {
        
        const loginPage =  preAuthorizedPageObjects.loginPage
        const dashboardPage =  preAuthorizedPageObjects.dashboardPage
        const shoppingCartPage = preAuthorizedPageObjects.shoppingCartPage
    
        await test.step('From Dashboard Page, Search for a product, Add it to Cart and Navigate to ShoppingCart Page', async () => {
            await loginPage.navigateToLoginPage();
            await expect(dashboardPage.ITEMS_IN_CART_ELEMENT).toHaveText("");
            await dashboardPage.searchAndSelectProduct(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect);
            await expect(dashboardPage.OVERLAY_SPINNER_ELEMENT).toBeHidden();
            await expect(dashboardPage.SHOPPING_CART_BUTTON).toBeVisible();
            await expect(dashboardPage.ITEMS_IN_CART_ELEMENT).toHaveText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.quantity);
            await dashboardPage.navigateToShoppingCart();
        })

        await test.step(`From ShoppingCart page, Delete the added item`, async () =>{
            await expect(shoppingCartPage.ITEMS_IN_CART_LIST).toHaveCount(1);
            await shoppingCartPage.deleteAProductFromCart(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect)
            await expect(shoppingCartPage.ITEMS_IN_CART_LIST).toHaveCount(0);
        })
    })

    test(`TC03-Launch and Login to an e-commerce website`, 
        {tag: [myTestTags.ui, myTestTags.smoke, myTestTags.e2e, myTestTags.p1]},
        async ({preAuthorizedPageObjects, addProductToCartApiResp}) => {
        
        const loginPage =  preAuthorizedPageObjects.loginPage
        const dashboardPage =  preAuthorizedPageObjects.dashboardPage 
        const shoppingCartPage = preAuthorizedPageObjects.shoppingCartPage

        await test.step('From ShoppingCart Page, Validate the items in Cart and Navigate to Checkout Page', async () => {
            await loginPage.navigateToLoginPage();
            await expect(dashboardPage.SHOPPING_CART_BUTTON).toBeVisible();
            await dashboardPage.navigateToShoppingCart();
            await expect(shoppingCartPage.CHECKOUT_CART_BUTTON).toBeVisible();
            await expect(shoppingCartPage.CONTINUE_SHOPPING_BUTTON).toBeVisible();
            await expect(shoppingCartPage.ITEMS_IN_CART_LIST).toHaveCount(parseInt(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.quantity));
            await expect(shoppingCartPage.ITEMS_IN_CART_LIST).toContainText(/in stock/i);
            await expect(shoppingCartPage.ITEMS_IN_CART_LIST).toContainText(addProductToCartApiResp.productIDOfSelectedItem);
            await expect(shoppingCartPage.BUY_NOW_BUTTON).toBeVisible();
            await expect(shoppingCartPage.DELETE_ITEM_BUTTON).toBeVisible();
            await shoppingCartPage.checkoutCartAndProceedToPayment();
        })
    })
})