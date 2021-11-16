const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  // _id: {
  //   type: Schema.Types.ObjectId,
  // },
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  img: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
