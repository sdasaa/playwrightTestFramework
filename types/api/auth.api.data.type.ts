export interface AuthApiReqType {
    userEmail: string, 
    userPassword: string,
}

export interface AllUserAuthApiReqType {
    eventHubUser : AuthApiReqType,
    testUser : AuthApiReqType
}

export interface AuthApiRespType {
    token: string,
    userId: string,
    message: string
}