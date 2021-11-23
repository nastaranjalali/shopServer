const express = require("express");
require("dotenv/config");

const router = express.Router();
let panel_controller = require("../controlers/panelCntr");
const verifyToken = require("../middlewares/auth");
router.get("/", (req, res) => {
  res.send("it's panel");
});
router.post("/cart/add", verifyToken, panel_controller.add_product);
// router.delete("/cart/:id", panel_controller.delete_product);
// router.get("/cart", panel_controller.get_cart);

module.exports = router;
