import { Stack, StackProps, Duration, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { CognitoStack } from './cognito_stack';
import { LambdaStack } from './lambda_stack';

export class IacStack extends Stack {
  private readonly githubRef = process.env.STAGE!;
  private readonly mssName = process.env.MSS_NAME!;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const restApi = new apigateway.RestApi(this, `todo_auth_rest_api_${this.githubRef}`, {
        restApiName: 'ToDo_Cognito_RestApi',
        description: 'This is the ToDo RestApi',
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowHeaders: ['*']
        }
      });
  
      const stage = 'DEV';
  
      const cognitoStack = new CognitoStack(this, `todo_cognito_stack_${this.githubRef}`);
  
      const apiGatewayResource = restApi.root.addResource('mss-cognito', {
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        }
      });
  
      const environmentVariables = {
        STAGE: stage,
        USER_POOL_ID: cognitoStack.userPool.userPoolId,
        CLIENT_ID: cognitoStack.client.userPoolClientId,
        REGION: this.region,
        MSS_NAME: this.mssName
      };
  
      const lambdaStack = new LambdaStack(this, apiGatewayResource, {
        environmentVariables
      });
  
      const cognitoAdminPolicy = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-idp:*'],
        resources: [cognitoStack.userPool.userPoolArn],
      });
  
      lambdaStack.functionsThatNeedCognitoPermissions.forEach(fn => {
        fn.addToRolePolicy(cognitoAdminPolicy);
      });

    new CfnOutput(this, `AuthRestApiUrl-${this.githubRef}`, {
      value: `${restApi.url}mss-cognito`,
      exportName: 'AuthRestApiUrlValue',
    });
  }
}
