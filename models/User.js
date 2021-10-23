const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "product",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  avatar: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  verify: {
    verified: {
      type: Boolean,
      required: true,
    },
    tokenVerify: {
      type: Number,
    },
    tokenVerifyExpiration: {
      type: Number,
    },
    tokenRegister: {
      type: String,
    },
  },
  tokenReset: {
    type: String,
  },
  tokenExpiration: {
    type: Number,
  },
});

userSchema.methods.addToCartById = function (productId, value) {
  const isExistedInCart = this.cart.findIndex(
    (pId) => pId.productId.toString() === productId.toString()
  );
  let newCart;
  if (isExistedInCart <= -1) {
    // not existed;
    newCart = [
      ...this.cart,
      {
        productId: productId,
        quantity: value,
      },
    ];
  } else {
    // existed
    const cloneCart = [...this.cart];
    cloneCart[isExistedInCart].quantity =
      cloneCart[isExistedInCart].quantity + value;
    newCart = cloneCart;
  }
  this.cart = newCart;
  return this.save();
};
module.exports = mongoose.model("user", userSchema);
