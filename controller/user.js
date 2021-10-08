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
      message: 'User exist',
      code: 200,
      _id: user._id.toString()
    });
  } catch (err) {
    nextError(err, next);
  }
};
