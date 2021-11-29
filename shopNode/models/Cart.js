var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const CartSchema = mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totalPrice: { type: Number },
});

module.exports = mongoose.model("Cart", CartSchema);
