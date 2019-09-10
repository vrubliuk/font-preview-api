const express = require("express");
const router = express.Router();
const { getImage } = require("../controllers/images");

router.get("/", getImage);

module.exports = router;
