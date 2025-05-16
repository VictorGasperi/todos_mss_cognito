import { Construct } from 'constructs'
import {
  UserPool,
  UserPoolClient,
  UserPoolEmail,
  AutoVerifiedAttrs,
  UserVerificationConfig,
  VerificationEmailStyle,
  StandardAttributes,
  StringAttribute,
  BooleanAttribute,
  AuthFlow,
  AccountRecovery,
} from 'aws-cdk-lib/aws-cognito'

import { RemovalPolicy, CfnOutput } from 'aws-cdk-lib'
import * as os from 'os'
import path from 'path'
import * as fs from 'fs'

function save_ids_on_env(userPool: UserPool, client: UserPoolClient): void {
  const envPath = path.resolve(__dirname, '..', '..', '.env')

  // Evita sobrescrever se já existe
  let envContent = ''
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8')
  }

  if (!envContent.includes('COGNITO_USER_POOL_ID')) {
    envContent += `\nCOGNITO_USER_POOL_ID=` + userPool.userPoolId
  }
  if (!envContent.includes('COGNITO_CLIENT_ID')) {
    envContent += `\nCOGNITO_CLIENT_ID=` + client.userPoolClientId
  }

  // Salva
  fs.writeFileSync(envPath, envContent.trim() + '\n')
}

export class CognitoStack extends Construct {
  public readonly userPool: UserPool
  public readonly client: UserPoolClient

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const removalPolicy = RemovalPolicy.DESTROY

    this.userPool = new UserPool(this, 'todo_user_pool', {
      removalPolicy,
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      userVerification: {
        emailSubject: 'ToDos - Verifique seu e-mail',
        emailBody:
          'Clique no link para verificar seu e-mail: {##Verify Email##}',
        emailStyle: VerificationEmailStyle.LINK,
      } as UserVerificationConfig,
      standardAttributes: {
        email: {
          required: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      email: UserPoolEmail.withCognito()
    })

    this.client = this.userPool.addClient('todo_user_pool_client', {
      userPoolClientName: 'todo_user_pool_client',
      generateSecret: false,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        userSrp: true,
      } as AuthFlow,
    })

    const domain = this.userPool.addDomain('ToDoCognitoDomain', {
      cognitoDomain: {
        domainPrefix: 'todo-verify-your-email'
      }
    })

    // save_ids_on_env(this.userPool, this.client)

    new CfnOutput(this, 'CognitoRemovalPolicy', {
      value: removalPolicy,
      exportName: 'CognitoRemovalPolicyValue',
    })

    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      exportName: 'UserPoolId',
    })

    new CfnOutput(this, 'UserPoolClientId', {
      value: this.client.userPoolClientId,
      exportName: 'UserPoolClientId',
    })

    new CfnOutput(this, 'UserPoolDomain', {
      value: domain.domainName,
      exportName: 'UserPoolDomainName'
    })
  }
}
