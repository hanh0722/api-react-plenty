const { body, query} = require("express-validator");

exports.verifyValidation = [
    body('OTP').isNumeric().isLength({max: 4, min: 4}).withMessage('OTP is too short or too long!'),
    query('id').trim().isString().not().isEmpty().withMessage('User is not existed!'),
    query('token').trim().isString().not().isEmpty().withMessage('User is not validation!')
]