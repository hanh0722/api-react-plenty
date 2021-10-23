const cloudinary = require("cloudinary").v2;
const removeFile = require("../util/remove-file");
const nextError = require("../util/Error");
const throwError = require("../util/ThrowError");

exports.generateLinkSingle = async (req, res, next) => {
  const files = req.files[0];
  if (!files) {
    throwError("files are empty!", 422);
  }
  try {
    // only get single file in here!
    cloudinary.uploader.upload(files.path, (err, result) => {
      if (err) {
        throwError("cannot upload image", 500);
      }
      removeFile(files.path);
      res.json({ message: "Successfully", url: result.secure_url, code: 200 });
    });
  } catch (err) {
    nextError(err, next);
  }
};
