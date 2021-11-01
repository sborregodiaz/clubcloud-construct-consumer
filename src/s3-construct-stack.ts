import * as cdk from '@aws-cdk/core';

import { SecureBucket } from '@platform/secure-bucket';

export class S3ConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new SecureBucket(this, 'myBucket', {});
    new SecureBucket(this, 'testBucket', { versioned: false });
  }
}