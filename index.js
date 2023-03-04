require("dotenv").config();
const express = require("express");
const app = require("./app.js");
const connectToDB = require("./config/database");

// connect to database
connectToDB();

app.listen(process.env.PORT, () => {
  console.log("server is running on port: " + process.env.PORT);
});
