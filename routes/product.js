const express = require("express");
const {
  getProducts,
  getProductById,
} = require("../controller/product");
const router = express.Router();

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

module.exports = router;
