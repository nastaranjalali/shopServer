const express = require("express");
require("dotenv/config");

const router = express.Router();
let panel_controller = require("../controlers/panelCntr");
const verifyToken = require("../middlewares/auth");
router.get("/", (req, res) => {
  res.send("it's panel");
});
router.post("/cart/", verifyToken, panel_controller.add_product);
router.post("/cart/setQuantity", verifyToken, panel_controller.set_quantity);
router.delete("/cart/:id", verifyToken, panel_controller.delete_product);
router.get("/cart", verifyToken, panel_controller.get_cart);

module.exports = router;
