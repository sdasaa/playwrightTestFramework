import * as fs from 'fs';
import path from 'path';

const ciGrepParams: string[] = ['test_suite', 'test_feature', 'test_priority']
const isCrossBrowser = process.env['cross_browser']

console.log('################# Starting CMD building ###############')
console.log(ciGrepParams.filter((param) => process.env[param] != undefined)
            .map( praram => `(?=.*@${process.env[praram]})`).join(""))

let grepParams = ciGrepParams.filter((param) => process.env[param] != undefined)
                    .map( praram => `(?=.*@${process.env[praram]})`).join("")
if(isCrossBrowser === 'true'){
    grepParams += ` --project=${process.env['cbrowser']}`
}

const ghOutput=process.env['GITHUB_OUTPUT']

if(ghOutput)
    fs.appendFileSync(ghOutput, grepParams)
