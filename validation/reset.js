const { body } = require("express-validator");

const validationPostReset = [
    body('email').isEmail()
]

module.exports = validationPostReset;