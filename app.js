require("dotenv").config();
const express = require("express");
const app = express();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressFileupload = require("express-fileupload");

// swagger docs import and middleware
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// middleware for file upload and cokies
app.use(cookieParser());
app.use(
  expressFileupload({
    useTempFiles: true,
    tempFileDir: "/uploads/",
  })
);

// use morgon middleware
app.use(morgan("dev"));

// import all routes
const home = require("./routes/home");
const user = require("./routes/user");
const product=require("./routes/product");

// use routes middleware
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);

module.exports = app;
