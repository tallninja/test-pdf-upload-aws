const { v1: uuid } = require("uuid");
const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");

const keys = require("../config/keys");

// setup the express app and middlewares
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup aws sdk
const s3 = new AWS.S3({
  accessKeyId: keys.accessKey,
  secretAccessKey: keys.accessSecret,
});

app.get("/", (req, res) => {
  res.send({ message: "Welcome to my server" });
});

app.get("/uploads", (req, res) => {
  const key = `documents/${uuid()}.pdf`;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "kisomoview-test-file-upload-bucket",
      ContentType: "application/pdf",
      Key: key,
    },
    (err, url) => {
      if (!err) {
        res.send({
          success: "File uploaded successfuly !",
          key: key,
          url: url,
        });
      } else {
        res.send({ error: "Failed to upload file !", message: err });
      }
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
