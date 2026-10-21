//import {test as base} from '@playwright/test'
import {preAuthorizedContextsFix as base} from '@fixtures/index'
import {NwMockFixtures, NwInterceptConfig} from '@myTypes/index'
import {nwRouteHandlerBuilder, logger} from '@utils/index'


export const networkMockFix = base.extend<NwMockFixtures>({

    nwInterceptFixture : async ({authorizedBrowserPage}, use) => {
        
        const matchingUrls: string[]=[""];

        // Fn to register a Nw Interception
        const registerAnIntercept = async (config: NwInterceptConfig) => {
            logger.info(`NetworkInterception Config - ${JSON.stringify(config)}`)
    
            const routeHandler = nwRouteHandlerBuilder(config);
            await authorizedBrowserPage.route(config.urlToIntercept, routeHandler)
            matchingUrls.concat(config.urlToIntercept);
        }
        await use(registerAnIntercept)
        
        // De-register Nw Interception
        for(let url of matchingUrls){
            await authorizedBrowserPage.unroute(url)
        }
    }
})
