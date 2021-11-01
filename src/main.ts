import * as cdk from '@aws-cdk/core';

import { PipelineStack } from './pipeline-stack';

const environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();
new PipelineStack(app, 'clubcloud-consumer-pipeline-stack', { env: environment, tags: { Owner: 'ClubCloud' } });