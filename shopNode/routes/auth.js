const express = require("express");
require("dotenv/config");

const router = express.Router();
const auth = require("../middlewares/auth");
var auth_controller = require("../controlers/authCntr");
router.get("/", (req, res) => {
  res.send("it's Auth");
});
router.post("/signUp", auth_controller.auth_signup);

router.post("/login", auth_controller.auth_login);

router.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
module.exports = router;
