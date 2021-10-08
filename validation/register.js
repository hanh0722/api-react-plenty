const User = require("../models/User");
const { body } = require("express-validator");
const { checkValidatePassword } = require("../util/Password");
const registerValidator = [
  body("name")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name must be filled!"),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .custom((password, { req }) => {
      const passwordIsValid = checkValidatePassword(password)
      if (!passwordIsValid) {
        return false;
      }
      return true;
    })
    .withMessage(
      "Password needs at least 8 characters long and contains 1 special word, 1 number"
    ),
  body("email")
    .isEmail()
    .trim()
    .withMessage("email is not valid!")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email: email });
      if (user) {
        return Promise.reject("User is already existed!");
      }
      return true;
    }),
  body("phone")
    .isNumeric()
    .trim()
    .isLength({ min: 10, max: 11 })
    .withMessage("Mobile phone is not valid!"),
];

module.exports = registerValidator;
