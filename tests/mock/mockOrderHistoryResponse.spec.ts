import {allCombinedFix as test, expect} from '@fixtures/index'
import {nwInterceptionData ,nwAlteredResponse} from '@testData/index'
import {ENDPOINTS} from '@api/index'
import {myTestTags, myTestConfig, logger} from '@utils/index'



test.describe(`NWMOCK - Modify Request Tests`, () => {

test(`Intercept Nw call and alter the response body of Order History Page`, 
    {tag: [myTestTags.nwMockTests.nwMockTests, myTestTags.nwMockTests.mockResponse, myTestTags.regression, myTestTags.orderTests, myTestTags.p1]},
    async ({nwInterceptFixture, preAuthorizedPageObjects})=>{
    
    const urlToIntercept = `${myTestConfig.env.BASE_URL}${ENDPOINTS.orderPath}${nwInterceptionData.nwInterception.fullfill.urlToIntercept}/**`;
    const loginPage = preAuthorizedPageObjects.loginPage;
    const dashboardPage = preAuthorizedPageObjects.dashboardPage;
    const orderHistoryPage = preAuthorizedPageObjects.orderHistoryPage;

    await test.step(`Invoking the fixture - nwInterceptFixture with dynamic input values and Registering route listener`, async () =>{
    await nwInterceptFixture({
                        urlToIntercept: urlToIntercept,
                        routeHandlerAction: 'fullfill',
                        alteredResponseBody: nwAlteredResponse["orderHistoryNullResponse"] 
                    })
    })

    await test.step(`Registering listener to capture urlToIntercept`, async () => {
        loginPage.pageObject.on('response', async (response) => {
            if(response.url().includes(urlToIntercept))
                logger.info(`Response altered -> ${await response.json()}`)
        })
    })

    await test.step(`Validating skipping of Login page`, async () => {
        await loginPage.navigateToLoginPage();
    })

    await test.step(`Validating NwMock-Intercepted Response is Updated`, async () => {
        await expect(dashboardPage.ORDERS_HISTORY_BUTTON).toBeVisible();
        await dashboardPage.navigateToOrdersHistoryPage();
        await expect(orderHistoryPage.ORDER_HISTORY_EMPTY_MSG).toBeVisible();
        await expect(orderHistoryPage.ORDER_HISTORY_EMPTY_MSG).toContainText(/You have No Orders/i)
    })
})
})