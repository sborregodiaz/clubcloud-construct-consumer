const { AwsCdkTypeScriptApp } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.127.0',
  projenVersion: '0.29.17',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'main',
  repositoryUrl: 'https://github.com/sborregodiaz/clubcloud-construct-pipeline',
  name: 'consumer-app',
  context: {
    '@aws-cdk/core:newStyleStackSynthesis': true,
  },
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-codebuild',
    '@aws-cdk/aws-codecommit',
    '@aws-cdk/aws-codepipeline',
    '@aws-cdk/aws-codepipeline-actions',
    '@aws-cdk/pipelines',
    '@aws-cdk/aws-iam',
  ],
  deps: [
    '@platform/secure-bucket',
  ],
  devDeps: [
    'ts-node',
    '@jest/globals',
  ],
  // GitHub configuration
  buildWorkflow: false,
  dependabot: false,
  mergify: false,
  pullRequestTemplate: false,
  releaseWorkflow: false,
  tsconfig: {
    compilerOptions: {
      lib: ['es2019', 'dom'], // 251021: Many Projen upgrades broke over night due to TS2304: Cannot find name 'AbortSignal'. Turns out it's a DefinitelyTyped bug.  They're working on it. https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56713/files
    },
  },
});

project.synth();