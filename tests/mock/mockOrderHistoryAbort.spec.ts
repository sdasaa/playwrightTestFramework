import {allCombinedFix as test, expect} from '@fixtures/index'
import {nwInterceptionData} from '@testData/index'
import {ENDPOINTS} from '@api/index'
import { logger, myTestConfig, myTestTags } from '@utils/index'


test.describe(`NWMOCK - Abort Request Tests`, () => {

test(`Intercept Nw call and abort the Order-History API call`, 
    {tag: [myTestTags.nwMockTests.nwMockTests, myTestTags.nwMockTests.mockAbort, myTestTags.regression, myTestTags.orderTests, myTestTags.p1]},
    async ({nwInterceptFixture, preAuthorizedPageObjects})=>{

    const urlToIntercept = `${myTestConfig.env.BASE_URL}${ENDPOINTS.orderPath}${nwInterceptionData.nwInterception.abort.urlToIntercept}/**`;
    const loginPage = preAuthorizedPageObjects.loginPage;
    const dashboardPage = preAuthorizedPageObjects.dashboardPage;

    await test.step(`Invoking the fixture - nwInterceptFixture with dynamic input values and Registering route listener`, async () =>{
        // Invocation of the fixture with dynamic values from test
        await nwInterceptFixture({
            urlToIntercept : urlToIntercept,
            routeHandlerAction : 'abort'
        })

    })

    await test.step(`Registering Listener to capture failed Nw calls during test execution`, () => {
        loginPage.pageObject.on('requestfailed', request => logger.error(`>>  ${request.method()} | ${request.url()}`))
    })

    await test.step(`Validating skipping of Login page`, async () => {
        await loginPage.navigateToLoginPage();
        await expect(dashboardPage.ALL_PRODUCTS_LIST.nth(0)).toBeVisible();
    })

    await test.step(`Triggering Action and Validate if the route overrides the response`, async () => {
        await dashboardPage.navigateToOrdersHistoryPage()

    })
        //  await dashboardPage.pageObject.pause();
        //  Promise.all([
        //     loginPage.pageObject.waitForRequest(urlToIntercept),
        //     dashboardPage.navigateToOrdersHistoryPage()
        // ])

    })
})
