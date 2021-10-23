const { validationResult } = require("express-validator");
const Product = require("../models/Product");
const nextError = require("../util/Error");
const throwError = require("../util/ThrowError");
exports.getProducts = async (req, res, next) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 1;
  try {
    const totalProduct = await Product.countDocuments();
    const products = await Product.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
    if (!products) {
      throwError("cannot fetch product", 500);
    }
    res.json({
      message: "Successfully",
      products: products,
      code: 200,
      total_product: totalProduct,
    });
  } catch (err) {
    nextError(err, next);
  }
};

exports.getProductById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).json({
      code: 401,
      message: "problems with query",
    });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      throwError("product is undefined", 404);
    }
    res.json({
      code: 200,
      message: "Successfully",
      product: product,
    });
  } catch (err) {
    nextError(err, next);
  }
};
