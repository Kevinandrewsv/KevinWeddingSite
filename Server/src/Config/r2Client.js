const { S3Client } = require("@aws-sdk/client-s3");

const getRequiredEnv = (key) => {
  const value = process.env[key];

  if (!value || !value.trim()) {
    throw new Error(`${key} is missing in .env`);
  }

  return value.trim();
};

const r2AccountId = getRequiredEnv("R2_ACCOUNT_ID");
const r2AccessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID");
const r2SecretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY");

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});

module.exports = r2Client;