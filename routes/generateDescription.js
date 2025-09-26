// routes/generateDescription.js
const express = require("express");
const { isLoggedIn } = require("../middleware.js");
const { generateDescription } = require("../controller/generateController.js");

const router = express.Router();

router.post("/", isLoggedIn, generateDescription);

module.exports = router;
