const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  cart:[{
      productID,
      count :Number
  }],
  
});s

module.exports = mongoose.model("Cart", CartSchema);
