const express = require("express");
const { generateLinkSingle } = require("../controller/image");
const router = express.Router();

router.post("/image", generateLinkSingle);

module.exports = router;
