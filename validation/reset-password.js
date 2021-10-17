const { body } = require("express-validator");
const { checkValidatePassword } = require("../util/Password");
const resetPasswordValidation = [
  body(
    "password",
    "password needs at least 8 characters long, one special word, one number and one uppercase"
  )
    .isString()
    .isLength({ min: 8 })
    .custom((password, { req }) => {
        const passwordIsValid = checkValidatePassword(password);
        if(!passwordIsValid){
            return false;
        }
        return true;
    }),
    body('_id').not().isEmpty().withMessage('user is not defined'),
    body('token').not().isEmpty().withMessage('user is not valid')
];

module.exports = resetPasswordValidation;