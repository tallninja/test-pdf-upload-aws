module.exports = {
  REGION: process.env.CDK_DEFAULT_REGION,
  STACK_PREFIX: "test-pdf-upload",
  DEPLOY_ENVIRONMENT: "dev",
  FRONTEND_BASE_URL: "http://localhost:3000",
  API_PATH: "get-presigned-url",
  API_URL: require("../src/cdk-exports-dev.json")["test-pdf-upload-dev"].apiUrl,
};
