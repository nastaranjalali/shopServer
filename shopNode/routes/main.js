const express = require("express");
require("dotenv/config");

const router = express.Router();
var main_controller = require("../controlers/mailctrl");
router.get("/", (req, res) => {
  res.send("it's main");
});
router.post("/products/add", main_controller.add_product);
router.get("/products/get", main_controller.get_product);

module.exports = router;
