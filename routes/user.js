const express = require("express");
const { getUserById, getUserForgetPassword } = require("../controller/user");
const router = express.Router();

router.get("/info/:id", getUserById);

router.get('/reset/:email', getUserForgetPassword);
module.exports = router;
