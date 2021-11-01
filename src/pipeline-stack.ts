import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';

import { ApplicationStage } from './application-stage';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new codecommit.Repository(this, 'clubcloud-consumer-app', {
      repositoryName: 'clubcloud-consumer-app',
    });

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new pipelines.CdkPipeline(this, 'clubcloud-consumer-app-pipeline', {
      pipelineName: 'clubcloud-consumer-app',
      cloudAssemblyArtifact,

      sourceAction: new codepipeline_actions.CodeCommitSourceAction({
        actionName: 'CodeCommit',
        output: sourceArtifact,
        repository: repository,
        branch: 'main',
      }),

      synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        installCommand: 'aws codeartifact login --tool npm --repository clubcloud-npm-platform-constructs --domain clubcloud-domain --domain-owner 290794210101 && yarn install',
        buildCommand: 'npx projen build',
        synthCommand: 'npx projen synth',
        rolePolicyStatements: [
          new iam.PolicyStatement({
            actions: [
              'codeartifact:GetAuthorizationToken',
              'codeartifact:GetRepositoryEndpoint',
              'codeartifact:ReadFromRepository',
            ],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            actions: [
              'sts:GetServiceBearerToken',
            ],
            resources: ['*'],
            conditions: {
              StringEquals: {
                'sts:AWSServiceName': 'codeartifact.amazonaws.com',
              },
            },
          }),
        ],
      }),
    });

    pipeline.addApplicationStage(new ApplicationStage(this, 'devEnvironment', {
      env: {
        account: '878922350258',
        region: cdk.Aws.REGION,
      },
    }));

    new cdk.CfnOutput(this, 'codecommit-repository-url', {
      value: repository.repositoryCloneUrlGrc,
      description: 'The clone URL of the CodeCommit repository',
      exportName: 'codecommitRepositoryUrl',
    });
  }
}