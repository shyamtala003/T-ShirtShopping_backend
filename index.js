require("dotenv").config();
const express = require("express");
const app = require("./app.js");
const cloudinary = require("cloudinary");
const connectToDB = require("./config/database");

app.set("view engine", "ejs");

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// connect to database
connectToDB();

app.listen(process.env.PORT, () => {
  console.log("server is running on port: " + process.env.PORT);
});
