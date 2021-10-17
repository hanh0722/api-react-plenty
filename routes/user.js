const express = require("express");
const {
  getUserById,
  getUserForgetPassword,
  getValidateUserReset,
  postResetPassword,
  getUserValidateReset,
  postChangePassword,
} = require("../controller/user");
const { validationPostReset, validationPassword } = require("../validation/validation");
const router = express.Router();

router.get("/info/:id", getUserById);

router.get("/reset/:email", getUserForgetPassword);

router.get("/reset/validation", getValidateUserReset);

router.post("/reset", validationPostReset, postResetPassword);

router.get("/reset-password/:token", getUserValidateReset);

router.put('/reset-password', validationPassword ,postChangePassword);
module.exports = router;
