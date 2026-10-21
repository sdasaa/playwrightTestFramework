import {allCombinedFix as test, expect} from '@fixtures/index'
import {myTestTags, logger} from '@utils/index'  

test.use({createAnOrderApiReqOD: {count:3}})

test.describe(`HYBRID - Skip OrderCreation Tests`, () => {

    test(`Validate Skip Order Creation`, 
    
    {tag: [myTestTags.hybrid, myTestTags.regression, myTestTags.authTests, myTestTags.p1]},     
    async({createOrderApiResp, preAuthorizedPageObjects}) => {
        
        let loginPage = preAuthorizedPageObjects.loginPage;
        let dashboardPage = preAuthorizedPageObjects.dashboardPage;
        let orderHistoryPage = preAuthorizedPageObjects.orderHistoryPage;

        await test.step(`Validate if CreateOrder Api is successfull`, async () =>{
            expect(createOrderApiResp.message).toContain("Order Placed Successfully")
            logger.info(`CreateOrderApi OrderID's -> ${createOrderApiResp.orders}`);
        })

        await test.step(`Validate skipping of Login and land in Dashboard Page`, async () =>{
            await loginPage.navigateToLoginPage();
            expect(dashboardPage.SHOPPING_CART_BUTTON).toBeVisible();
        })
        
        await test.step(`Navigate to OrderHistory Page and Validate the newly created order details`, async () =>{
            await dashboardPage.navigateToOrdersHistoryPage();
            await expect(orderHistoryPage.ORDER_HISTORY_TABLE).toBeVisible();
            createOrderApiResp.orders.forEach( (orderID) => {
                logger.info(`checking order id - ${orderID}`)
                expect(orderHistoryPage.ORDER_HISTORY_ROWS.filter({hasText : orderID})).toBeTruthy();
            })

        })
    })
})
