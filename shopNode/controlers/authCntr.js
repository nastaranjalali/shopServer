const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.auth_signup = async function (req, res) {
  console.log("req.body", req.body);
  try {
    const { fullName, username, password } = req.body;
    var errors = [];
    var usernamePattern = /^[a-zA-Z0-9_\.\-]*$/;
    var passwordPattern =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    if (
      !usernamePattern.test(req.body.username) ||
      fullName.length < 3 ||
      !passwordPattern.test(req.body.password)
    ) {
      if (fullName.length < 3) {
        errors.push({ key: "fullName", errorText: "Name is too short!" });
      }
      if (!usernamePattern.test(username)) {
        errors.push({
          key: "username",
          errorText:
            "username must be a combinition of alphabets and numbers and  . and _ !",
        });
      }
      if (!passwordPattern.test(password)) {
        errors.push({ key: "password", errorText: "your password is weak !" });
      }
      res.status(400).json({ errors: errors });
      return;
    }

    const existUsername = await User.findOne({ username: req.body.username });
    if (existUsername) {
      errors.push({
        key: "username",
        errorText: "this username is already taken !",
      });
      res.status(409).json({ errors: errors });
      return;
    }
    encryptedPassword = await bcrypt.hash(req.body.password, 10);
    var user = new User({
      fullName: fullName,
      username: username,
      password: encryptedPassword,
    });
    const token = jwt.sign(
      { user_id: user._id, username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    console.log(user);
    user
      .save()
      .then((data) => {
        console.log("saved");
        res.status(201).json({
          token,
          message: "Successfully Signed up",
          fullName: data.fullName,
        });
        // res.status(201).json(data);
      })
      .catch((err) => {
        console.log("failed" + err);
        res.send(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.auth_login = async function (req, res) {
  try {
    const { username, password } = req.body;
    var errors = [];
    const user = await User.findOne({ username });
    console.log({ user });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      res
        .status(200)
        .json({
          token,
          message: "Successfully loged in",
          fullName: user.fullName,
        });
    } else {
      errors.push({
        key: "username",
        errorText: "username or password is wrong!",
      });
      res.status(409).json({ errors: errors });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
