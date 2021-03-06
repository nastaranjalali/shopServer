const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const crypt = require("crypto");

router.get("/", (req, res) => {
  res.send("it's Auth");
});
router.post("/add", async (req, res) => {
  console.log("req.body", req.body);
  try {
    var errors = [];
    if (
      req.body.name.length < 3 ||
      req.body.price < 0 ||
      !passwordPattern.test(req.body.password)
    ) {
      if (req.body.fullName.length < 3) {
        errors.push({ key: "fullName", errorText: "Name is too short!" });
      }
      if (!usernamePattern.test(req.body.username)) {
        errors.push({
          key: "username",
          errorText:
            "username must be a combinition of alphabets and numbers and  . and _ !",
        });
      }
      if (!passwordPattern.test(req.body.password)) {
        errors.push({ key: "password", errorText: "your password is weak !" });
      }
      res.status(400).json({ errors: errors });
      return;
    }
    var user = new User({
      fullName: req.body.fullName,
      username: req.body.username,
      password: req.body.password,
    });
    const existUsername = await User.findOne({ username: req.body.username });
    if (existUsername) {
      errors.push({
        key: "username",
        errorText: "this username is already taken !",
      });
      res.status(400).json({ errors: errors });
      return;
    }
    user
      .save()
      .then((data) => {
        console.log("saved");
        res.json(data);
      })
      .catch((err) => {
        console.log("failed" + err);
        res.send(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
