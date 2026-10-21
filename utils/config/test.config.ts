import {configDotenv} from 'dotenv'
import { logger } from '..';

if(!process.env.CI)
    configDotenv();

interface testConfig {
    env: {
            IS_CI: boolean,
            BASE_URL: string,
            BASE_URL_API: string,
            USER_POOL_ARR: string[],
            USER_PWD: string
        },
    pwgt: {
        WORKERS: number,
        HEADLESS: boolean
        TIMEOUT_TEST: number,
        TIMEOUT_EXPECT: number,
        SCREENSHOTS: string,
        VIDEO: string,
        TRACES: string,
        RE_TRIES: number,
    }
}

export const myTestConfig: testConfig = {

    env : {
        IS_CI: process.env.CI === 'true',
        BASE_URL: process.env.BASE_URL || 'BASE_URL',
        BASE_URL_API: process.env.BASE_URL_API || 'BASE_URL_API',
        USER_POOL_ARR: (process.env.USER_POOL || 'USER_POOL').split(','),
        USER_PWD: process.env.USER_PWD || 'USER_PWD'
    },
    pwgt : {
        WORKERS: parseInt(process.env.WORKERS || '2'),
        HEADLESS: process.env.HEADLESS === 'true',
        TIMEOUT_TEST: parseInt(process.env.TIMEOUT_TEST || '12000'),
        TIMEOUT_EXPECT: parseInt(process.env.TIMEOUT_EXPECT || '5000'),
        SCREENSHOTS: process.env.SCREENSHOTS || 'retain-on-failure-and-retries',
        VIDEO: process.env.VIDEO || 'retain-on-failure',
        TRACES: process.env.TRACES || 'retain-on-failure',
        RE_TRIES: parseInt(process.env.RE_TRIES || '1')
    }
}

logger.info(`Global Test Config : ${JSON.stringify(myTestConfig)}`)