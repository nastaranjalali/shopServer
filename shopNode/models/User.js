const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const UserSchema = mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
    unique: "That username is already taken",
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
});

module.exports = mongoose.model("User", UserSchema);
