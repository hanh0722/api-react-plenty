const { validationLogin } = require("./login");
const registerValidation = require("./register");
const { verifyValidation } = require("./verify");

module.exports = {
    validationLogin,
    registerValidation,
    verifyValidation
}