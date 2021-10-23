const { validationResult } = require("express-validator");
const throwError = require("../util/ThrowError");
const nextError = require("../util/Error");
const User = require("../models/User");
const Product = require("../models/Product");

exports.addItemToCartUser = async (req, res, next) => {
  const { id } = req.params;
  const value = +req.query.value || 1;
  const userId = req.userId;
  const errors = validationResult(req);
  if (!userId) {
    throwError("user is not authorization", 401);
  }
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "not successfully",
      code: 400,
      errors: errors.array(),
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      throwError("User is not existed", 404);
    }
    user.addToCartById(id, value);
    const product = await Product.findById(id);
    if (!product) {
      throwError("Item is not existed", 404);
    }
    res.json({
      message: "Successfully",
      code: 200,
      product: {
        ...product._doc,
        add_quantity: value,
      },
    });
  } catch (err) {
    nextError(err, next);
  }
};

exports.getCartOfUser = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
      throwError('user is not authorization', 401);
  }
  try{
    const user = await User.findById(userId).populate('cart.productId');
    if(!user){
        throwError('user is not existed', 404);
    }
    res.json({
        message: 'successfully',
        code: 200,
        cart: user.cart.map(product => {
            return {
                ...product.productId._doc,
                quantity: product.quantity
            }
        })
    })
  }catch(err){
    nextError(err, next);
  }
};
