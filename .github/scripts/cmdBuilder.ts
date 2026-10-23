import * as fs from 'fs';
import {logger} from '@utils/index'

const ciGrepParams: string[] = ['TEST_SUITE', 'TEST_FEATURE', 'TEST_PRIORITY']
const isCrossBrowser = process.env['cross_browser']
let cmdToExecute = 'npx playwright test'
let grepParams = '--grep'

if(!process.env['TEST_ENV'] || !process.env['TEST_SUITE']){
    logger.error('Mandatory env params test_env & test_suite is not set! ')
    throw new Error('Unable to execute test, Provide mandatory params - test_env & test_suite')
}

logger.info('################# Starting CMD building #################')

logger.info(ciGrepParams.filter((param) => process.env[param] != undefined)
            .map( praram => `(?=.*@${process.env[praram]})`).join(""))

grepParams += ciGrepParams.filter((param) => process.env[param] != undefined && process.env[param] != "")
                    .map( praram => ` (?=.*@${process.env[praram]})`).join("")

if(isCrossBrowser === 'true'){
    grepParams += ` --project=${process.env['cbrowser']}`
}

cmdToExecute += ` ${grepParams}`
logger.info(`Executing command -> ${cmdToExecute}`)

const ghOutput=process.env['GITHUB_OUTPUT']
if(ghOutput)
    fs.appendFileSync(ghOutput, `cmdToExecute=${cmdToExecute}`)