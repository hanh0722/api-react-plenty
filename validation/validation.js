const { validationLogin } = require("./login");
const registerValidation = require("./register");
const { verifyValidation } = require("./verify");
const validationPostReset = require('./reset');
const validationPassword = require('./reset-password');
const postProductValidation = require('./post-product');
const putCartValidation = require('./put-cart');
module.exports = {
    validationLogin,
    registerValidation,
    verifyValidation,
    validationPostReset,
    validationPassword,
    postProductValidation,
    putCartValidation
}