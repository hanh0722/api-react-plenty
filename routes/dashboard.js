const express = require("express");
const { getUserDashboard, postProduct } = require("../controller/dashboard");
const isAuthorization = require("../middleware/is-auth");
const { postProductValidation } = require("../validation/validation");
const router = express.Router();

router.get("/user", isAuthorization, getUserDashboard);

router.post("/product", isAuthorization, postProductValidation, postProduct);
module.exports = router;
