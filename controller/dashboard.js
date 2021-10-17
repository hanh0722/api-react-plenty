const User = require("../models/User");
const throwError = require("../util/ThrowError");
const nextError = require("../util/Error");
exports.getUserDashboard = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    throwError("Not authorization", 422);
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      throwError("user is not existed", 404);
    }
    res.json({
      code: 200,
      message: "Successfully",
      user: user,
    });
  } catch (err) {
    nextError(err, next);
  }
};
