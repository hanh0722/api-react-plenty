const { validationLogin } = require("./login");
const registerValidation = require("./register");
const { verifyValidation } = require("./verify");
const validationPostReset = require('./reset');
const validationPassword = require('./reset-password');
module.exports = {
    validationLogin,
    registerValidation,
    verifyValidation,
    validationPostReset,
    validationPassword
}