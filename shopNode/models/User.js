const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  // _id: {
  //   type: Schema.Types.ObjectId,
  // },
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
  cart: {},
});

module.exports = mongoose.model("User", UserSchema);
