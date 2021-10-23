const { param } = require("express-validator");
const Product = require("../models/Product");
const putCartValidation = [
  param("id")
    .not()
    .isEmpty()
    .withMessage("product id is not defined!")
    .custom(async (id, { req }) => {
        const product = await Product.findById(id);
        if(!product){
            return Promise.reject('product is not existed');
        }
        return true;
    }),
];

module.exports = putCartValidation;