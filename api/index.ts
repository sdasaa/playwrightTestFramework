import {APIRequestContext} from '@playwright/test'

export {BaseApi} from './BaseApi'
export {ENDPOINTS} from './endpoints';

export type getOptions = Parameters<APIRequestContext['get']>[1];
export type postOptions = Parameters<APIRequestContext['post']>[1];

// Clients
export {AuthApiClient} from './clients/AuthApiClient'
export {UserApiClient} from './clients/UserApiClient'
export {ProductApiClient} from './clients/ProductApiClient'
export {OrdersApiClient} from './clients/OrdersApiClient'