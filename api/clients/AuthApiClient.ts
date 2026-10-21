import { BaseApi, postOptions } from '@api/index'
import {APIRequestContext, APIResponse} from '@playwright/test'
import type {AuthApiRespType} from '@myTypes/index'
import { ENDPOINTS } from '@api/endpoints';

export class AuthApiClient extends BaseApi {

    constructor(request: APIRequestContext){
        super(request)
    }

    async loginToApp(options: postOptions): Promise<APIResponse>{
        return await this.post(ENDPOINTS.auth.login, options);
    }

    async extractTokenFromResponse(response: APIResponse): Promise<String>{
        const authApiResp: AuthApiRespType = await response.json();
        return authApiResp.token;
    }
}