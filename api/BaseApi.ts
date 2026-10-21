import {APIRequestContext, APIResponse, request}  from '@playwright/test'
import {getOptions, postOptions} from "@api/index"
import { logger } from '@utils/index'

export class BaseApi {

    protected request: APIRequestContext;
    protected authToken?: string;

    constructor(request: APIRequestContext, authToken?: string){
        this.request = request;
        this.authToken = authToken;
    }

    // ? checks truthiness, {0|null|undefined|"" all retrun false}
    get authHeader(): Record<string, string>{
        return this.authToken? {"Authorization" : this.authToken} : {};
    }


    async get(url: string, options?: getOptions): Promise<APIResponse>{
        logger.info(`[REQUEST] GET ${url} \n JSON.stringify(options)`);
        
        const response: APIResponse =  await this.request.get(
            url,
            {
                ...options,
                headers : {
                    ...options?.headers,
                    ...this.authHeader
                }
            }
        )
        logger.info(`[RESPONSE] GET ${response.status()} \n await ${response.text()}`);
        return response;
    }

    async post(url: string, options: postOptions): Promise<APIResponse>{
        logger.info(`[REQUEST] POST | URL -> ${url} |\n Options -> ${JSON.stringify(options)}}`);
        const response = await this.request.post(
            url,
            {
                ...options,
                headers : {
                    ...options?.headers,
                    ...this.authHeader
                }
            }
        )
        logger.info(`[RESPONSE] POST | Status -> ${response.status()} |\n ${JSON.stringify(await response.json())}`);
        return response;
    }

    async delete(url: string, options?: getOptions): Promise<APIResponse>{
        logger.info(`[REQUEST] DELETE | URL -> ${url} |\n Options -> ${JSON.stringify(options)}}`);
        const response = await this.request.delete(
            url,
            {
                ...options,
                headers : {
                    ...options?.headers,
                    ...this.authHeader
                }
            }
        )
        logger.info(`[RESPONSE] DELETE | Status -> ${response.status()} |\n ${JSON.stringify(await response.json())}`);
        return response;
    }


}