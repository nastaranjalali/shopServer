const mongoose = require("mongoose");

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
  cart: {},
});

module.exports = mongoose.model("User", UserSchema);
