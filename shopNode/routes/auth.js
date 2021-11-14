const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const crypt = require("crypto");

router.get("/", (req, res) => {
  res.send("it's Auth");
});
router.post("/signUp", async (req, res) => {
  console.log("req.body", req.body);
  try {
    var errors = [];
    var usernamePattern = /^[a-zA-Z0-9_\.\-]*$/;
    var passwordPattern =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if (
      !usernamePattern.test(req.body.username) ||
      req.body.fullName.length < 3 ||
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

router.post("/login", async (req, res) => {
  try {
    var errors = [];
    var token = crypt.createHmac("sha256", req.body.username).digest("base64");
    var succuss = false;
    User.findOne(
      { username: req.body.username, password: req.body.password },
      (err, user) => {
        if (user) {
          succuss = true;
          res.status(200).json({ fullName: user.fullName, token: token });
        } else {
          errors.push({
            key: "username",
            errorText: "this user doesn't exist !",
          });
        }
        res.status(400).json({ errors: errors });
        return;
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
