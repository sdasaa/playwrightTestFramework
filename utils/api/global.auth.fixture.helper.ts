import {logger, myTestConfig} from '@utils/index'
import {APIRequestContext, WorkerInfo} from '@playwright/test'
import { AuthApiReqType, AuthApiRespType } from '@myTypes/index';
import { AuthApiClient, ENDPOINTS } from '@api/index'



export function selectAnUserPerWorker(workerInfo: WorkerInfo): string{

    const myUserPool = myTestConfig.env.USER_POOL_ARR;
    const currentShard = workerInfo.config.shard?.current;
    const totalShards = workerInfo.config.shard?.total;
    const expectedNoOfWorkers = workerInfo.config.workers
    const actualNoOfUsers = myTestConfig.env.USER_POOL_ARR.length
    let selectedIndex = 0

    if(totalShards && currentShard){
            logger.info(`Sharding is ON, selecting users accodringly`)
            const expectedNoOfUsers = totalShards * expectedNoOfWorkers;
            selectedIndex = (currentShard - 1) * actualNoOfUsers + workerInfo.parallelIndex

        if(expectedNoOfUsers > actualNoOfUsers){
            logger.error(`expectedNoOfUsers: ${expectedNoOfUsers} is more than  actualNoOfUsers: ${actualNoOfUsers}`)
            throw new Error(`expectedNoOfUsers: ${expectedNoOfUsers} is more than  actualNoOfUsers: ${actualNoOfUsers} \n
                                Increase the actualNoOfUsers or reduce the workers count`)
        }
    }
    logger.info(`Sharding is OFF, selecting users accodring to the workerifo.parallelindex`)
    selectedIndex = workerInfo.parallelIndex
    logger.info(`Selected index : ${selectedIndex} & the user is : ${myUserPool[selectedIndex]}`)

    return myUserPool[selectedIndex]
}


export async function authenticateAnUserUsingApi(request: APIRequestContext, authPayload: AuthApiReqType): Promise<AuthApiRespType>{
    return await (await (new AuthApiClient(request)).loginToApp( {data: authPayload})).json();    
}