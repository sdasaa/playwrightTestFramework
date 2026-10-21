//import {test as base} from '@playwright/test'
import {preAuthorizedContextsFix as base} from '@fixtures/index'
import {authApiReqData} from '@testData/index'
import {AuthApiRespType} from '@myTypes/index'
import {ENDPOINTS, AuthApiClient, OrdersApiClient, ProductApiClient, UserApiClient} from '@api/index'

type apiClientFixtures = {
    authToken: string,
    ordersApiClient: OrdersApiClient,
    productApiClient: ProductApiClient,
    userApiClient: UserApiClient
}

export const apiClientsFix = base.extend<apiClientFixtures>({

    authToken : async ({authenticateAnUser}, use) => {
        const authToken = authenticateAnUser.authResponse.token
        await use(authToken);
    },

    productApiClient : async ({authorizedApiRequestContext}, use) => {
        await use(new ProductApiClient(authorizedApiRequestContext));
    },

    userApiClient : async ({authorizedApiRequestContext}, use) => {
        await use(new UserApiClient(authorizedApiRequestContext))
    },

    ordersApiClient : async ({authorizedApiRequestContext}, use) => {
        await use(new OrdersApiClient(authorizedApiRequestContext)) 
    }

})