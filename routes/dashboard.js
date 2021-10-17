const express = require("express");
const { getUserDashboard } = require("../controller/dashboard");
const isAuthorization = require('../middleware/is-auth');
const router = express.Router();

router.get("/user", isAuthorization ,getUserDashboard);

module.exports = router;
