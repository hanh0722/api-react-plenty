const fs = require("fs");
const User = require("../models/User");
const Product = require("../models/Product");
const throwError = require("../util/ThrowError");
const nextError = require("../util/Error");
const { validationResult } = require("express-validator");
const cloudinaryUpload = require('../util/cloudinary-cdn');
const removeFile = require('../util/remove-file');
exports.getUserDashboard = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    throwError("Not authorization", 422);
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      throwError("user is not existed", 404);
    }
    res.json({
      code: 200,
      message: "Successfully",
      user: user,
    });
  } catch (err) {
    nextError(err, next);
  }
};

exports.postProduct = async (req, res, next) => {
  const validateProduct = validationResult(req);
  const userId = req.userId;
  if (!userId) {
    throwError("Not authorization", 401);
  }
  if (!validateProduct.isEmpty()) {
    return res.status(422).json({
      message: "error validate",
      code: 422,
      errors: validateProduct.array(),
    });
  }
  try {
    const files = req.files;
    const fileArray = [];
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinaryUpload(path);
      fileArray.push(newPath);
      removeFile(path)
    }
    const product = new Product({
      ...req.body,
      images: {
        urls: fileArray.map(url => url.res),
      },
    });
    const saved_product = await product.save();
    res.json({ message: "Succesfully", code: 200, product: saved_product });
  } catch (err) {
    nextError(err, next);
  }
};
