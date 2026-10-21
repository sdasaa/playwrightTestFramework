// @ts-check
import { defineConfig, PlaywrightTestConfig,devices, ScreenshotMode, TraceMode, VideoMode, WorkerInfo } from '@playwright/test';
import {logger} from '@utils/index'
import {myTestConfig} from '@utils/index'

if(myTestConfig.pwgt.WORKERS > myTestConfig.env.USER_POOL_ARR.length)
  throw new Error('The number of WORKER is greater than the number of Users in USER_POOL of this env, Fix this!')

const myPlaywrightTestConfig: PlaywrightTestConfig = {
  //globalSetup : './globalSetup',

  testDir: './tests',

  timeout : myTestConfig.pwgt.TIMEOUT_TEST,

  expect : {
    timeout : myTestConfig.pwgt.TIMEOUT_EXPECT,
  },
  
  retries: myTestConfig.pwgt.RE_TRIES,

  workers : myTestConfig.pwgt.WORKERS,

  reporter: myTestConfig.env.IS_CI ?
            [ ['list'], ['json'], ['html'], ['allure-playwright']] :
            [ ['list'], ['html'], ['allure-playwright']],

  use: {
    
    baseURL: myTestConfig.env.BASE_URL,
    headless: myTestConfig.env.IS_CI,
    
    screenshot : myTestConfig.pwgt.SCREENSHOTS as ScreenshotMode,
    trace: myTestConfig.pwgt.TRACES as TraceMode,
    video: myTestConfig.pwgt.VIDEO as VideoMode,

    ignoreHTTPSErrors : true,
    permissions : ["geolocation"],
    //channel : "chrome",
  },

  projects : [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
      
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
      },
      
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      
    },
    {
      name: 'firefox',
      use : {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'api',
      use : {
        baseURL: myTestConfig.env.BASE_URL_API,
      }
    }
  ]
};

export default defineConfig(myPlaywrightTestConfig)
logger.info(`myPlaywright Test Config : ${JSON.stringify(myPlaywrightTestConfig)}`)




