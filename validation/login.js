const { body } = require("express-validator");
const User = require("../models/User");
const { checkValidatePassword } = require("../util/Password");
exports.validationLogin = [
  body("email").isEmail().withMessage("Email is not valid!"),
  body("password")
    .trim()
    .isString()
    .isLength({ min: 8 })
    .custom((password, { req }) => {
      const passwordIsValid = checkValidatePassword(password);
      if (!passwordIsValid) {
        return false;
      }
      return true;
    })
    .withMessage(
      "password must have at least 8 character with 1 special character, 1 uppercase and 1 number"
    ),
];
