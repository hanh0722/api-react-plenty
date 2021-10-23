const { body, check } = require("express-validator");

const postProductValidation = [
    body('title').trim().isLength({min: 1, max: 500}).withMessage('Title must be from 1 to 500 length'),
    body('regular_price').isNumeric().not().isEmpty().withMessage('Product must have price')
]

module.exports = postProductValidation;