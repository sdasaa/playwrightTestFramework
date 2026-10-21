// @ts-check
import {allCombinedFix as test, expect} from "@fixtures/index"
import {authUiTestData, e2eShoppingScenariosUiTestData} from "@testData/index"
import {myTestTags, myTestConfig, logger} from '@utils/index'
import * as allure from 'allure-js-commons'


test.describe('Suite-E2E Shopping flow', () => {

    test(`Test-E2E Shopping flow of an e-commerce website`, 
        
        {tag: [myTestTags.ui, myTestTags.smoke, myTestTags.e2e, myTestTags.p1]},
        async ({unAuthorizedPageObjects}) => {
        
        const loginPage =  unAuthorizedPageObjects.loginPage
        const dashboardPage =  unAuthorizedPageObjects.dashboardPage 
        const shoppingCartPage =  unAuthorizedPageObjects.shoppingCartPage
        const checkoutPage =  unAuthorizedPageObjects.checkoutPage
        const orderConfirmationPage =  unAuthorizedPageObjects.orderConfirmationPage
        const orderHistoryPage =  unAuthorizedPageObjects.orderHistoryPage
        const viewAnOrderPage =  unAuthorizedPageObjects.viewAnOrderPage
        let orderID: string;

        await test.step('Launch the Application and Login to it', async () =>{
            await loginPage.navigateToLoginPage();
            await expect(loginPage.USERNAME_EDITBOX).toBeVisible();
            await expect(loginPage.pageObject).toHaveTitle("Let's Shop");
            await loginPage.loginToApplication(authUiTestData.validCredentials.username, authUiTestData.validCredentials.password);
            await expect(dashboardPage.ALL_PRODUCTS_LIST.first()).toBeVisible();
        })


        await test.step('From Dashboard Page, Search for a product, Add it to Cart and Navigate to ShoppingCart Page', async () => {
            await expect(dashboardPage.ITEMS_IN_CART_ELEMENT).toHaveText("");
            await dashboardPage.searchAndSelectProduct(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect);
            await expect(dashboardPage.OVERLAY_SPINNER_ELEMENT).toBeHidden();
            await expect(dashboardPage.SHOPPING_CART_BUTTON).toBeVisible();
            await expect(dashboardPage.ITEMS_IN_CART_ELEMENT).toHaveText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.quantity);
            await dashboardPage.navigateToShoppingCart();
        })

        await test.step('From ShoppingCart Page, Validate the items in Cart and Navigate to Checkout Page', async () => {
            await expect(shoppingCartPage.CHECKOUT_CART_BUTTON).toBeVisible();
            await expect(shoppingCartPage.CONTINUE_SHOPPING_BUTTON).toBeVisible();
            await expect(shoppingCartPage.ITEMS_IN_CART_LIST).toHaveCount(parseInt(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.quantity));
            await expect(shoppingCartPage.ITEMS_IN_CART_LIST).toContainText(/in stock/i);
            await expect(shoppingCartPage.ITEMS_IN_CART_LIST).toContainText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect);
            await expect(shoppingCartPage.BUY_NOW_BUTTON).toBeVisible();
            await expect(shoppingCartPage.DELETE_ITEM_BUTTON).toBeVisible();
            await shoppingCartPage.checkoutCartAndProceedToPayment();
        })

        await test.step('From Checkout Page, Validate the Payment Types', async () => {
            await expect(checkoutPage.PAYMENT_TYPE_CC).toBeVisible();
            await expect(checkoutPage.PAYMENT_TYPE_CC).toHaveClass(/active/);
            await expect(checkoutPage.PAYMENT_TYPE_INVOICE).not.toHaveClass(/active/);
            await expect(checkoutPage.PAYMENT_TYPE_PPAL).not.toHaveClass(/active/);
            await expect(checkoutPage.PAYMENT_TYPE_SEPA).not.toHaveClass(/active/);
        })
        
        await test.step('From Checkout Page, Enter Credit Card Details and Validate the same', async () => {
            await checkoutPage.enterCCDetails(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.ccDetails);
            await expect(checkoutPage.CC_INFO_CCNUMBER_EDITBOX).toHaveValue(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.ccDetails.ccNumber);
            await expect(checkoutPage.CC_INFO_EXPIRY_DATE_DD.first()).toHaveValue(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.ccDetails.expiry.month);
            await expect(checkoutPage.CC_INFO_EXPIRY_DATE_DD.last()).toHaveValue(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.ccDetails.expiry.year);
            await expect(checkoutPage.CC_INFO_CVV_CODE_EDITBOX).toHaveValue(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.ccDetails.cvvCode);
            await expect(checkoutPage.CC_INFO_NAME_ON_CARD_EDITBOX).toHaveValue(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.ccDetails.nameOnCard);
        })
        

        await test.step('From Checkout Page, Apply Coupon and Validate success message', async () => {
            await checkoutPage.applyCoupon(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.ccDetails);
            await expect(checkoutPage.CC_INFO_APPLY_COUPON_STATUS_TEXT).toBeVisible();
            await expect(checkoutPage.CC_INFO_APPLY_COUPON_STATUS_TEXT).toHaveText(/Coupon Applied/);
        })
        
        await test.step('From Checkout Page, Enter the shipping details and Validate the same', async () => {
            await checkoutPage.enterShippingDetails(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon);
            await expect(checkoutPage.SHIPPING_NAME_EDITBOX).toHaveValue(authUiTestData.validCredentials.username);
            await expect(checkoutPage.SHIPPING_COUNTRY_EDITBOX).toHaveValue(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.country);
        })
        
        
        await test.step('From Checkout Page, Place the order, Validate the Order Confirmation message and Auto-Navigate to OrderConfirmation Page', async () => {
            await checkoutPage.placeOrder();
            await expect(orderConfirmationPage.ORDER_CONFIRMATION_MSG_H1).toBeVisible();
            await expect(orderConfirmationPage.ORDER_CONFIRMATION_MSG_H1).toHaveText(/Thankyou for the order/);
            await expect(orderConfirmationPage.ORDER_CONFIRMATION_ID).toHaveText(/\|\s*.*\s*\|/i);
            await expect(orderConfirmationPage.fetchOrderInfofromOrderSummary(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect)).toContainText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect);
            await expect(orderConfirmationPage.fetchOrderInfofromOrderSummary(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect)).toContainText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.quantity);
        })

        await test.step('From OrderConfirmation Page, save the OrderID and Navigate to OrderHistory Page', async () => {
            orderID = await orderConfirmationPage.fetchOrderID();
            await allure.attachment('Order Confirmation', await orderConfirmationPage.pageObject.screenshot(), allure.ContentType.PNG)
            await orderConfirmationPage.downloadOrderDetailsCsv();
            await orderConfirmationPage.navigateToOrderHistoryPage();
        })
        
        await test.step('From OrderHistory Page, Validate if the newly placed order is displayed', async () => {
            await expect(orderHistoryPage.fetchAnOrder(orderID)).toContainText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect)
            await orderHistoryPage.viewAnOrder(orderID);
        })

        await test.step('From ViewAnOrder Page, Open the Order and Validate details of the new Order', async () => {
            await expect(viewAnOrderPage.VIEW_ORDERS_CONFIRMATION_MSG).toContainText(/Thank you for Shopping With Us/i);
            await expect(viewAnOrderPage.VIEW_ORDERS_ORDER_ID).toContainText(orderID);
            await expect(viewAnOrderPage.VIEW_ORDERS_BILLING_ADDRESS).toContainText(authUiTestData.validCredentials.username);
            await expect(viewAnOrderPage.VIEW_ORDERS_DELIVERY_ADDRESS).toContainText(authUiTestData.validCredentials.username);
            await expect(viewAnOrderPage.VIEW_ORDERS_BILLING_ADDRESS).toContainText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.country);
            await expect(viewAnOrderPage.VIEW_ORDERS_DELIVERY_ADDRESS).toContainText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.country);
            await expect(viewAnOrderPage.VIEW_ORDERS_PDT_ORDERED).toContainText(e2eShoppingScenariosUiTestData.validIphoneCCwCoupon.productToSelect);
            viewAnOrderPage.navigateBackToViewOrders();
        })
        
    })
})