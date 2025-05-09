import { STAGE } from './domain/enums/stage_enum'
import { IUserRepository } from './domain/repositories/user_repository_interface'
import { UserRepositoryCognito } from './infra/repositories/user_repository_cognito'
import { UserRepositoryMock } from './infra/repositories/user_repository_mock'
import { config } from 'dotenv'
config()

export class Environments {
  stage: STAGE = STAGE.TEST
  region: string = ''
  cognitoUserPoolId: string = ''
  cognitoClientId: string = ''
  mssName: string = ''

  configureLocal() {
    console.log('process.env.STAGE - [ENVIRONMENTS - { CONFIGURE LOCAL }] - ', process.env.STAGE)
    process.env.STAGE = process.env.STAGE || 'TEST'
  }

  loadEnvs() {
    if (!process.env.STAGE) {
      this.configureLocal()
    }

    
    this.stage = process.env.STAGE as STAGE

    console.log('process.env.STAGE - [CHEGOU NO LOAD_ENVS] - ', process.env.STAGE)
    console.log('process.env.REGION - [CHEGOU NO LOAD_ENVS] - ', process.env.REGION)
    console.log('process.env.COGNITO_USER_POOL_ID - [CHEGOU NO LOAD_ENVS] - ', process.env.COGNITO_USER_POOL_ID)
    console.log('process.env.COGNITO_CLIENT_ID - [CHEGOU NO LOAD_ENVS] - ', process.env.COGNITO_CLIENT_ID)
    console.log('this.stage - [CHEGOU NO LOAD_ENVS] - ', this.stage)
    this.mssName = process.env.MSS_NAME as string
    this.cognitoClientId = process.env.COGNITO_CLIENT_ID as string
    this.cognitoUserPoolId = process.env.COGNITO_USER_POOL_ID as string

    if (this.stage === STAGE.TEST) {
      this.region = 'sa-east-1'
    } else {
      this.region = process.env.REGION as string
    }
  }

  static getUserRepo(): IUserRepository {
    console.log('Environments.getEnvs().stage - [ENVIRONMENTS - { GET USER REPO }] - ', Environments.getEnvs().stage)

    if (Environments.getEnvs().stage === STAGE.TEST) {
      return new UserRepositoryMock()
    } else if (Environments.getEnvs().stage === STAGE.DEV) {
      return new UserRepositoryCognito()
    } else {
      throw new Error('Invalid STAGE')
    }
  }

  static getEnvs() {
    const envs = new Environments()
    envs.loadEnvs()
    return envs
  }
}
