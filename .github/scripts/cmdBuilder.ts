import * as fs from 'fs';
import {logger} from '@utils/index'

const ciGrepParams: string[] = ['TEST_SUITE', 'TEST_FEATURE', 'TEST_PRIORITY']
const isCrossBrowser = process.env['CROSS_BROWSER']
let cmdToExecute = 'npx playwright test'
let grepParams = `--grep '`
const runOnChrome = '--project=chrome'

if(!process.env['TEST_ENV'] || !process.env['TEST_SUITE']){
    logger.error('Mandatory env params test_env & test_suite is not set! ')
    throw new Error('Unable to execute test, Provide mandatory params - test_env & test_suite')
}

logger.info('Starting building of cmdToExecute')

logger.debug(ciGrepParams.filter((param) => process.env[param] != undefined && process.env[param] != "")
            .map( praram => `(?=.*@${process.env[praram]})`).join(""))

grepParams += ciGrepParams.filter((param) => process.env[param] != undefined && process.env[param] != "")
                    .map( praram => `(?=.*@${process.env[praram]})`).join("") + "'"

cmdToExecute += ` ${grepParams}`

if(isCrossBrowser == 'false')
    cmdToExecute += ` ${runOnChrome}`

logger.info(` cmdToExecute ---> ${cmdToExecute}`)

const ghOutput=process.env['GITHUB_OUTPUT']
if(ghOutput)
    fs.appendFileSync(ghOutput, `cmdToExecute=${cmdToExecute}`)