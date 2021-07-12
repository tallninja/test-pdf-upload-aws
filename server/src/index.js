const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { API_PATH, API_URL } = require("../config/constants");

// setup the express app and middlewares
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Welcome to my server" });
});

app.get("/uploads", async (req, res) => {
  const apiResponse = await getPresignedURL(req.query.fileType);
  res.status(200).send(apiResponse);
});

const getPresignedURL = async (fileType) => {
  const API_BASE_URL = API_URL.slice(0, API_URL.length - 1);
  const res = await axios.get(
    `${API_BASE_URL}/${API_PATH}?fileType=${fileType}`
  );
  return res.data;
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
