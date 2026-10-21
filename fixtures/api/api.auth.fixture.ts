import {test as base, expect, BrowserContext, APIRequestContext, request, APIRequest, Page} from '@playwright/test'
import {AllUserAuthApiReqType, AuthApiReqType, AuthApiRespType} from '@myTypes/index'
import { AuthApiClient, ENDPOINTS } from '@api/index'
import {authenticateAnUserUsingApi, logger, myTestConfig, selectAnUserPerWorker} from '@utils/index'
import { inspect } from 'node:util'

type myWorkerFixtures = {
    selectAnUser : AuthApiReqType,
    authenticateAnUser : {storageState: Awaited<ReturnType<BrowserContext['storageState']>>, authResponse: AuthApiRespType}
}

type myTestFixtures = {
    //dummy: void,
    authorizedBrowserContext: BrowserContext,
    authorizedBrowserPage: Page,
    authorizedApiRequestContext: APIRequestContext
}

export const preAuthorizedContextsFix = base.extend<myTestFixtures, myWorkerFixtures>({

    selectAnUser : [async ({}, use, workerInfo) => {
        logger.info(`workerInfo -> : ${JSON.stringify(workerInfo)}`)
        logger.info(`In selectAnUser cf, One user will be used per Worker for all the test execution of that worker`)
        const selectedUser = selectAnUserPerWorker(workerInfo)
        await use({userEmail: selectedUser, userPassword: myTestConfig.env.USER_PWD})
    },{scope: 'worker'}],

    authenticateAnUser : [async ({selectAnUser}, use, testInfo) => {
            logger.info(`In authenticateAnUser cf, invoking auth api using user - ${selectAnUser.userEmail}`)
            const apiRequestContext = await request.newContext();
            const response: AuthApiRespType = await authenticateAnUserUsingApi(apiRequestContext, selectAnUser)
            expect(response.message).toMatch(/success/i)
            await use({storageState: await apiRequestContext.storageState(), authResponse: response})
            await apiRequestContext.dispose();
        },
        {scope: 'worker'}
    ],

    // dummy : async ({authenticateAnUser}, use, testInfo) => {
    //     logger.info(`testInfo -> ${inspect(testInfo, { depth: 1 })}`)
    // },
    authorizedBrowserContext : async ({authenticateAnUser, browser}, use, testInfo) => {
            logger.info(`In authorizedBrowserContext cf, overriding BrowserContext with AUTH details`)
            //logger.info(`testinfo -> ${JSON.stringify(testInfo)}`)
            const loggedInBrowserContext = authenticateAnUser.storageState.cookies.length
                ? await browser.newContext({storageState: authenticateAnUser.storageState})
                : await browser.newContext()
            if(!authenticateAnUser.storageState.cookies.length){
                logger.info("STS of ApiRequestContext is empty, Setting token using init script for the BrowserContext")
                await loggedInBrowserContext.addInitScript(token => window.localStorage.setItem('token', token), authenticateAnUser.authResponse?.token);
            }
            logger.info(`Auth details updated in BrowserContext - ${JSON.stringify(loggedInBrowserContext)}`)
            await use(loggedInBrowserContext)
            await testInfo.attach("userInfo-Browser", {body: authenticateAnUser.authResponse.userId})
            await loggedInBrowserContext.close()
    },

    authorizedBrowserPage : async ({authorizedBrowserContext}, use) => {
        const authorizedBrowserPage = await authorizedBrowserContext.newPage();
        await use(authorizedBrowserPage)
        await authorizedBrowserPage.close()

    },
    authorizedApiRequestContext: async({authenticateAnUser, baseURL}, use, testInfo) => {
            logger.info(`In authorizedApiRequestContext cf, overriding authorizedApiRequestContext with AUTH details`)
            const newRequestContextConfig: Parameters<APIRequest['newContext']>[0] = {
                baseURL : baseURL,
                extraHTTPHeaders : {
                    Authorization: `${authenticateAnUser.authResponse.token}`, 
                }
            };

            if(authenticateAnUser.storageState.cookies){
                newRequestContextConfig.storageState = {
                    ...authenticateAnUser.storageState
                }
            }

            const loggedInRequestContext = (await request.newContext(newRequestContextConfig))
            logger.info(`Auth details updated in ApiRequestContext - ${JSON.stringify(loggedInRequestContext)}`)
            await use(loggedInRequestContext)
            await testInfo.attach("userInfo-Req", {body: authenticateAnUser.authResponse.userId})
            await loggedInRequestContext.dispose();
    }
})