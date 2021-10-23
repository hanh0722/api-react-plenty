const express = require("express");
const { addItemToCartUser, getCartOfUser } = require("../controller/cart");
const isAuth = require("../middleware/is-auth");
const { putCartValidation } = require("../validation/validation");
const Router = express.Router();

Router.put("/add/:id", isAuth, putCartValidation, addItemToCartUser);

Router.get('/user', isAuth, getCartOfUser);
module.exports = Router;
