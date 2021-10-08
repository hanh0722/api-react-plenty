const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'product'
        }
    ],
    phone: {
        type: String,
        required: true
    },
    verify: {
        verified: {
            type: Boolean,
            required: true
        },
        tokenVerify: {
            type: Number
        },
        tokenVerifyExpiration: {
            type: Number
        },
        tokenRegister: {
            type: String
        }
    },
    tokenReset: {
        type: String
    },
    tokenExpiration: {
        type: Number
    }
})

module.exports = mongoose.model('user', userSchema);