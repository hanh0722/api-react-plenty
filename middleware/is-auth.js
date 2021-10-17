const jwt = require('jsonwebtoken');
const key = require('../util/Keys');
const throwError = require('../util/ThrowError');
module.exports = (req, res, next) => {
    let decoded;
    const header = req.get('Authorization');
    if(!header){
        throwError('Not authorization', 401);
    }
    const token = header.split(' ')[1];
    try{
        decoded = jwt.verify(token, key);
    } catch(err){
        throwError('Cannot decode token', 401);
    }
    req.userId = decoded.userId;
    req.userEmail = decoded.userEmail;
    next();
}