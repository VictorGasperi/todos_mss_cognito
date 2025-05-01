/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from 'aws-cdk-lib'

import { adjustLayerDirectory } from './adjust_layer_directory'
import { config } from 'dotenv'
import { IacStack } from 'iac/iac_stack'
config()

console.log('Starting the CDK')

console.log('Adjusting the layer directory')
adjustLayerDirectory()
console.log('Finished adjusting the layer directory')

const app = new cdk.App()

const awsRegion = process.env.REGION
const awsAccount = process.env.AWS_ACCOUNT_ID
const stackName = process.env.STACK_NAME

let stage = ''

if (stackName === 'prod') {
  stage = 'PROD'
} else if (stackName === 'homolog') {
  stage = 'HOMOLOG'
} else if (stackName === 'dev') {
  stage = 'DEV'
} else if (stackName === 'test') {
  stage = 'TEST'
}

const tags = {
  'project': 'Todo',
  'stage': 'dev',
  'stack': 'BACK',
  'owner': 'gasperi'
}

new IacStack(app, stackName as string, {
  env: {
    region: awsRegion,
    account: awsAccount
  },
  tags: tags
})

app.synth()
