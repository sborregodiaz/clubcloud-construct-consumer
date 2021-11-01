import * as cdk from '@aws-cdk/core';

import { S3ConstructStack } from './s3-construct-stack';

export class ApplicationStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new S3ConstructStack(this, 'clubcloud-construct-stack', {
      env: { account: props?.env?.account, region: props?.env?.region },
    });
  }
}