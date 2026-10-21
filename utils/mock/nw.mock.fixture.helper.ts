import {Route} from '@playwright/test'
import {NwInterceptConfig} from '@myTypes/index'

export function nwRouteHandlerBuilder(config: NwInterceptConfig): (route: Route) => Promise<void> {
    return async (route: Route) => {
        switch(config.routeHandlerAction){
            case 'fullfill' : {
                const originalResponse = await route.fetch();
                await route.fulfill({
                    response : originalResponse,
                    body: JSON.stringify(config.alteredResponseBody ?? {})
                });
                break;
            }
            case 'continue' : {
                console.log('alteredURL -->',config.alteredRequestURL);
                await route.continue({
                    url: config.alteredRequestURL ?? route.request().url()
                });
                break;
            }
            case 'abort' : {
                await route.abort();
                break;
            }
            default : {
                const _exhaustiveCheck: never = config.routeHandlerAction
                throw new Error(`This action is unhandler ${_exhaustiveCheck}`)
            }
        }
    }
}