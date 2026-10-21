import {allCombinedFix as test, expect} from '@fixtures/index'
import {ENDPOINTS} from '@api/index'
import {nwInterceptionData} from '@testData/index'
import {myTestTags, myTestConfig, logger} from '@utils/index'

test.describe(`NWMOCK - Modify Request Tests`, () => {

test(`Intercept Nw call and alter the request of Order History Page`,
    {tag: [myTestTags.nwMockTests.nwMockTests, myTestTags.nwMockTests.mockRequest, myTestTags.regression, myTestTags.orderTests, myTestTags.p1]},
    async ({nwInterceptFixture, preAuthorizedPageObjects})=>{
    
    const loginPage = preAuthorizedPageObjects.loginPage;
    const dashboardPage = preAuthorizedPageObjects.dashboardPage;
    const urlToIntercept = `${myTestConfig.env.BASE_URL}${ENDPOINTS.orderPath}${nwInterceptionData.nwInterception.continue.urlToIntercept}/**`
    const alteredRequestURL = `${myTestConfig.env.BASE_URL}${ENDPOINTS.orderPath}${nwInterceptionData.nwInterception.continue.urlToIntercept}/${nwInterceptionData.nwInterception.continue.unAuthorizedUserID}`
    
    await test.step(`Invoking the fixture - nwInterceptFixture with dynamic input values and Registering route listener`, async () =>{
        await nwInterceptFixture({
            urlToIntercept: urlToIntercept,
            routeHandlerAction: 'continue',
            alteredRequestURL : alteredRequestURL
        })
    })

    await test.step(`Registering listener to capture urlToIntercept`, async () => {
        loginPage.pageObject.on('response', async (response) => {
            if(response.url() == alteredRequestURL)
                logger.info(`The required URL is invoked -> ${await response.body()}`)
        })
        // loginPage.pageObject.on('requestfailed', (request) => {
        //     if(request.url() == urlToIntercept)
        //         logger.info(`The required URL is invoked -> ${request.url}`)
        // })
    })

    await test.step(`Validating skipping of Login page`, async () => {
        await loginPage.navigateToLoginPage();
        await expect(dashboardPage.ORDERS_HISTORY_BUTTON).toBeVisible();
    })

    await test.step(`Validating NwMock-Intercepted Request URL is FORBIDDEN`, async () => {
        const [response] = await Promise.all([
            dashboardPage.pageObject.waitForResponse(response => response.url() == alteredRequestURL),
            dashboardPage.navigateToOrdersHistoryPage()
        ]);
        expect(response.url()).toContain(nwInterceptionData.nwInterception.continue.unAuthorizedUserID)
        expect(response.status()).toBe(403)
        expect(await response.json()).toMatchObject({"message":"You are not authorize to view these orders"})
    })
})
})