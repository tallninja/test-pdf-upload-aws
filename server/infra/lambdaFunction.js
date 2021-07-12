const { S3 } = require("aws-sdk");
const uuid = require("uuid");

if (!process.env.BUCKET_NAME) {
  console.log("Environment variable BUCKET_NAME must be set");
}

export async function main(event) {
  console.log(`Event is: ${JSON.stringify(event, null, 2)}`);

  try {
    if (!event.queryStringParameters?.fileType) {
      throw new Error("File type must be specified");
    }

    const { fileType } = event.queryStringParameters;
    const filePath = uuid.v1();
    const presignedURL = await createPresignedURL({ fileType, filePath });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...presignedURL,
        filePath,
      }),
    };
  } catch (error) {
    console.log("ERROR is:", error);
    if (error instanceof Error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ error: JSON.stringify(error) }),
    };
  }
}

export function createPresignedURL({ fileType, filePath }) {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Fields: { key: filePath, acl: "public-read" },
    Conditions: [["eq", "Content-Type", fileType]],
    Expires: 15,
  };

  const s3 = new S3();

  return s3.createPresignedPost(params);
}
