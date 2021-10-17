const crypto = require("crypto");
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");
const mailer = require("../util/node-mailer");
const User = require("../models/User");
const throwError = require("../util/ThrowError");
const nextError = require("../util/Error");
exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throwError("user is not defined with id", 401);
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error("user is not existed!");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json(user);
  } catch (err) {
    nextError(err, next);
  }
};

exports.getUserForgetPassword = async (req, res, next) => {
  const { email } = req.params;
  if (!email) {
    throwError("user is not defined with email", 404);
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("User is not existed!");
    }
    if (!user.verify.verified) {
      return res.status(401).json("user is not validated with email");
    }
    res.json({
      message: "User exist",
      code: 200,
      _id: user._id.toString(),
    });
  } catch (err) {
    nextError(err, next);
  }
};

exports.postResetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email, "verify.verified": true });
    if (!user) {
      throwError("user is not existed", 404);
    }
    crypto.randomBytes(32, async (err, buffer) => {
      const token = buffer.toString("hex");
      user.tokenReset = token;
      user.tokenExpiration = Date.now() + 24 * 60 * 60 * 1000;
      const saveUser = await user.save();
      mailer.sendMail(
        {
          to: email,
          from: process.env.EMAIL_SENDER,
          subject: "Reset password",
          html: `<div style="text-align: center">
                <h1 style="text-align: center">Request reset password from user</h1>
                <p>Click the <a href="http://localhost:3000/reset/validation?uidt=${saveUser._id.toString()}&token=${token}">link</a> to reset your account</p>
              </div>`,
        },
        (err, res) => {
          if (err) {
            console.log(err);
          }
          console.log(res);
        }
      );
      res.json({
        message: "pending user for reset password successfully",
        code: 200,
        _id: saveUser._id.toString(),
        tokenReset: saveUser.tokenReset,
        tokenExpiration: saveUser.tokenExpiration,
      });
    });
  } catch (err) {
    nextError(err, next);
  }
};
exports.getValidateUserReset = async (req, res, next) => {
  const { uidt } = req.query;
  const {token} = req.params;
  if (!uidt || !token) {
    return res.status(400).json({
      message: "User is not defined",
      code: 400,
    });
  }
  try {
    const user = await User.findOne({
      _id: id,
      tokenReset: token,
      tokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      throwError("user is not valid or url is expired", 403);
    }
    res.json({
      message: "successfully validated",
      code: 200,
    });
  } catch (err) {
    nextError(err, next);
  }
};

exports.getUserValidateReset = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(401).json({
      message: "access denied",
      code: 401,
    });
  }
  try {
    const user = await User.findOne({ tokenReset: token });
    if (!user) {
      throwError("user is not existed", 404);
    }
    if (user.tokenExpiration < Date.now()) {
      throwError("url is expired", 408);
    }
    res.json({
      message: "Successfully",
      code: 200,
      userId: user._id.toString(),
    });
  } catch (err) {
    nextError(err, next);
  }
};

exports.postChangePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(408).json({
      message: 'user information is not credential',
      code: 408
    })
  }
  const { password, _id, token } = req.body;
  try {
    const user = await User.findOne({
      _id: _id,
      tokenReset: token,
      tokenExpiration: { $gt: Date.now() },
    });
    if(!user){
      throwError('url is expired', 408);
    }
    const hash = await bcrypt.hash(password, 12);
    user.password = hash;
    user.tokenReset = undefined;
    user.tokenExpiration = undefined;
    await user.save();
    res.json({
      message: 'changed password successfully',
      code: 200
    })
  } catch (err) {
    nextError(err, next);
  }
};

