const express = require("express");
require("dotenv/config");

const router = express.Router();
var main_controller = require("../controlers/mailctrl");
router.get("/", (req, res) => {
  res.send("it's main");
});
router.post("/products", main_controller.add_product);

module.exports = router;
