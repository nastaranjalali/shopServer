const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      count: Number,
    },
  ],
});

module.exports = mongoose.model("Cart", ProductSchema);
