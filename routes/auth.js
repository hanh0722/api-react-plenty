const express = require("express");
const { postRegister, postSignIn } = require("../controller/auth");
const { getVerify, postCheckVerifyOTP } = require("../controller/verify");
const { register, verify, login } = require("../Route/Route");
const {
  registerValidation,
  verifyValidation,
  validationLogin,
} = require("../validation/validation");
const router = express.Router();

router.post(register, registerValidation, postRegister);

router.get(verify, getVerify);

router.post(verify, verifyValidation, postCheckVerifyOTP);

router.post(login, validationLogin ,postSignIn);

module.exports = router;
