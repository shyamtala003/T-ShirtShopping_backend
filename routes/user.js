const express = require("express");
const router = express.Router();

// import controllers
const { signup } = require("../controllers/useController");

router.route("/signup").post(signup);

module.exports = router;
