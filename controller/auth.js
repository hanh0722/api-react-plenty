const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mailer = require('../util/node-mailer');
const User = require("../models/User");
const key = require("../util/Keys");
const errorHandling = require("../util/Error");
const throwError = require("../util/ThrowError");

exports.postRegister = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Information is not valid!", errors: errors.array() });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        const error = new Error("Cannot get token");
        error.statusCode = 500;
        throw error;
      }
      const token = buffer.toString("hex");
      const generateNumber = Math.floor(
        Math.random() * (9999 - 1000 + 1) + 1000
      );
      const user = new User({
        name: name,
        email: email,
        password: hash,
        phone: phone,
        cart: [],
        verify: {
          verified: false,
          // generate from 1000 to 9999
          tokenVerify: generateNumber,
          tokenRegister: token,
          // date verify now: 3 hours
          tokenVerifyExpiration: Date.now() + 3 * 60 * 60 * 1000,
        },
      });
      const result = await user.save();
      const sendingEmailToUser = {
        to: email,
        from: process.env.EMAIL_SENDER,
        subject: "Verify your account",
        html: `<div><h1 style="text-align: center">Thank you for register account in our store</h1>
                <p>Four number to verify: <span style="font-size: 22px; font-weight: bold;">${generateNumber}</span>
                <p>Click the <a href="http://localhost:3000/register/verify?id=${result._id.toString()}&token=${token}">link</a> to finish verify account</p>
              </div>`,
      };
      mailer.sendMail(sendingEmailToUser, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log(res);
      });
      res.json(result);
    });
    // const result = await user.save();
  } catch (err) {
    errorHandling(err, next);
  }
};

exports.postSignIn = async (req, res, next) => {
  const { email, password } = req.body;
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json("invalid in validation");
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throwError("User is not existed!", 404);
    }
    if (user && !user.verify.verified) {
      return res.status(401).json({
        message: "User is not authenticated with email",
        code: 401,
        _id: user._id.toString(),
      });
    }
    const isEqualPassword = await bcrypt.compare(password, user.password);
    if (!isEqualPassword) {
      throwError("user is invalid", 422);
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      key,
      { expiresIn: "3h" }
    );
    res.json({
      message: "success",
      code: 200,
      _id: user._id.toString(),
      token: token,
      expiry: Date.now() + 3 * 60 * 60 * 1000,
    });
  } catch (err) {
    errorHandling(err, next);
  }
};
