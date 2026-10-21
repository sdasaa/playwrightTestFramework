import type {AuthUiTdType, E2eShoppingScenariosUiTdType, AllUserAuthApiReqType, UserApiAllReqDataType, OrderApiAllReqDataType} from '@myTypes/index'

// UI-Test Data
import {default as authJson} from './test-data/ui/Auth.data.json'
export const authUiTestData: AuthUiTdType = authJson;

import {default as e2eShoppingJson} from './test-data/ui/E2EShopping.data.json';
export const e2eShoppingScenariosUiTestData: E2eShoppingScenariosUiTdType = e2eShoppingJson;

// API-Test Data
import {default as authApiJson} from "./test-data/api/auth.api.data.json"
export const authApiReqData = authApiJson as AllUserAuthApiReqType;

import {default as userApiJson} from './test-data/api/user.api.data.json';
export const userApiReqData: UserApiAllReqDataType  = userApiJson;

import {default as orderApiJson} from './test-data/api/order.api.data.json'
export const orderApiReqData: OrderApiAllReqDataType = orderApiJson;

// NwInterception-Mock
export {default as nwInterceptionData} from './test-data/mock/nw.interception.json'
export {default as nwAlteredResponse} from './test-data/mock/nw.altered.response.json'

