const express = require("express");
require("dotenv/config");

const router = express.Router();
let main_controller = require("../controlers/mailctrl");
let helper = require("../helpers/paginate");
const Product = require("../models/Product");
router.get("/", (req, res) => {
  res.send("it's main");
});
router.post("/products/add", main_controller.add_product);
router.get("/products/get", main_controller.get_product);
router.get(
  "/products/paginate",
  helper.paginatedResults(Product),
  main_controller.paginate
);

module.exports = router;
