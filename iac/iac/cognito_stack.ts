import { Construct } from 'constructs';
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
  AuthFlow
} from 'aws-cdk-lib/aws-cognito';

import { RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import * as os from 'os';

export class CognitoStack extends Construct {
  public readonly userPool: UserPool;
  public readonly client: UserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const removalPolicy = RemovalPolicy.DESTROY;

    this.userPool = new UserPool(this, 'todo_user_pool', {
      removalPolicy,
      selfSignUpEnabled: true,
      autoVerify: { email: true } as AutoVerifiedAttrs,
      userVerification: {
        emailSubject: 'Verifique seu email para acessar o ToDo',
        emailBody: 'Seu código é {####}',
        emailStyle: VerificationEmailStyle.CODE
      } as UserVerificationConfig,
      standardAttributes: {
        email: {
          required: true,
        }
      }
    });

    this.client = this.userPool.addClient('todo_user_pool_client', {
      userPoolClientName: 'todo_user_pool_client',
      generateSecret: false,
      authFlows: {
        adminUserPassword: true,
        userPassword: true,
        userSrp: true
      } as AuthFlow
    });

    new CfnOutput(this, 'CognitoRemovalPolicy', {
      value: removalPolicy,
      exportName: 'CognitoRemovalPolicyValue'
    });
  }
}
