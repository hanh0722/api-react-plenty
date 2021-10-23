const fs = require('fs');
const throwError = require('../util/ThrowError');
const removeFile = (pathFile) => {
    fs.unlink(pathFile, (err) => {
        if(err){
            throwError('cannot remove file in server', 500);
        }
    })
}

module.exports = removeFile;