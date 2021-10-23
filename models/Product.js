const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    images: {
      urls: [
        {
          type: String,
        },
      ],
    },
    inStock: {
      type: Boolean,
      required: true,
    },
    type_product: {
      type: String,
      required: true,
    },
    regular_price: {
      type: Number,
      required: true,
    },
    sale_percent: {
      type: Number,
    },
    last_price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('product', ProductSchema);