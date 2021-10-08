const { validationResult } = require("express-validator");
const errorHandling = require('../util/Error');
const User = require("../models/User");

exports.getVerify = async (req, res, next) => {
  const { id, token } = req.query;
  try {
    const userIsValid = await User.findOne({
      _id: id,
      "verify.verified": false,
      "verify.tokenRegister": token,
      "verify.tokenVerifyExpiration": { $gt: Date.now() },
    });
    if (!userIsValid) {
      const error = new Error("User is not valid!");
      error.statusCode = 400;
      throw error;
    }
    res.status(201).json(userIsValid);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCheckVerifyOTP = async (req, res, next) => {
  const { OTP } = req.body;
  const { id, token } = req.query;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try{
    const userIsValid = await User.findOne({
      _id: id,
      "verify.tokenVerify": OTP,
      "verify.tokenRegister": token,
      "verify.tokenVerifyExpiration": { $gt: Date.now() },
    });
    if(!userIsValid){
      const error = new Error('URL is expired or wrong!');
      error.statusCode = 400;
      throw error;
    }
    userIsValid.verify.verified = true;
    userIsValid.verify.tokenVerify = undefined;
    userIsValid.verify.tokenVerifyExpiration = undefined;
    userIsValid.verify.tokenRegister = undefined;
    const result = await userIsValid.save();
    res.status(201).json(result);
  } catch(err){
    errorHandling(err, next);
  }
};
