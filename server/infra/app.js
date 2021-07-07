const { App } = require("@aws-cdk/core");

const {
  DEPLOY_ENVIRONMENT,
  REGION,
  STACK_PREFIX,
} = require("../config/constants");
const PdfUploadStack = require("./stack");

const app = new App();

new PdfUploadStack(app, `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`, {
  stackName: `${STACK_PREFIX}-${DEPLOY_ENVIRONMENT}`,
  env: {
    region: REGION,
  },
  tags: {
    env: "dev",
  },
});
