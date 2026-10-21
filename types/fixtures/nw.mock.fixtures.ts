import {Page} from '@playwright/test'

export type NwInterceptRouteHandlerAction = 'fullfill' | 'continue' | 'abort';

export interface NwInterceptConfig {
    urlToIntercept: string,
    routeHandlerAction: NwInterceptRouteHandlerAction,
    alteredResponseBody?: Record<string, unknown>,
    alteredRequestURL?: string
}

export type NwInterceptFixture = (config: NwInterceptConfig) => Promise<void>;

export type NwMockFixtures = {
    nwInterceptFixture: NwInterceptFixture
}