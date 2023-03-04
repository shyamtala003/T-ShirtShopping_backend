const express = require("express");
const router = express.Router();

// import controllers
const { signup, postform } = require("../controllers/useController");

router.route("/signup").post(signup);
router.route("/postform").get(postform);

module.exports = router;
