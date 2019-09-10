const express = require("express");
const router = express.Router();
const { getFonts } = require("../controllers/fonts");

router.get("/", getFonts);

module.exports = router;