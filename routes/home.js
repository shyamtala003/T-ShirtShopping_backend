const express = require("express");
const router = express.Router();

// import controllers
const { homeCotroller, login } = require("../controllers/homeController");

router.route("/").get(homeCotroller);
router.route("/login").get(login);

module.exports = router;
