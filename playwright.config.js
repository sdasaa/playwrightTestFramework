// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({

  testDir: './tests',
  
  reporter: 'html',

  expect : {
    timeout : 5000,
  },


  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName : "chromium",
    //channel : "chrome",
    ignoreHTTPSErrors : true,
    permissions : ["geolocation"],
    headless : false,
    screenshot : "only-on-failure",
    trace: 'retain-on-failure-and-retries'
  },

  // projects : [
  //   {
  //     name: 'Microsoft Edge',
  //     use: { ...devices['Desktop Edge'], channel: 'msedge' },
  //   },
  // ]
});

