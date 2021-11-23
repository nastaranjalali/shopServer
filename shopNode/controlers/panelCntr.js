const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.add_product = async function (req, res) {
  console.log("req.body", req.body);
  try {
    var errors = [];
    const { name, quantity } = req.body;

    if (!name || quantity < 0) {
      if (!name) {
        errors.push({
          key: "product",
          errorText: "there is no product selected!",
        });
      }

      if (quantity < 0) {
        errors.push({
          key: "quantity",
          errorText: "quantity cannot be minus!",
        });
      }

      res.status(400).json({ errors: errors });
      return;
    }

    const foundUser = await User.findOne({ username: req.user.username });
    const foundProduct = await Product.findOne({ name });

    if (foundUser && foundProduct) {
      let foundCart = await Cart.findOne({ user: foundUser._id });
      if (foundCart) {
        const productExistsInCart = foundCart.products.findIndex(
          ({ product_id }) => product_id == foundProduct._id.toString()
        );

        if (productExistsInCart >= 0) {
          foundCart.products[productExistsInCart].quantity += quantity;
          await foundCart.save();
          res.status(200).json({ foundCart, user: req.user });
        } else {
          foundCart.products.push({
            product_id: foundProduct._id,
            quantity: quantity,
          });
          foundCart.save();
          res.status(200).json(foundCart);
        }
      } else {
        let cart = new Cart({
          user: foundUser._id,
          products: [{ product_id: foundProduct._id, quantity: quantity }],
        });

        cart.save().then((data) => {
          console.log("saved");
          res.status(201).json({
            message: "Successfully created",
            data,
          });
        });
      }
      return;
    } else {
      errors.push({
        key: "name",
        errorText: "this product already exists !",
      });
      res.status(409).json({ errors: errors });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
exports.delete_product = function (req, res) {};
// exports.get_cart = function (req, res) {
//   Product.find({}, (err, products) => {
//     if (err) return handleError(err);
//     res.status(200).json({ products });
//   });
// };
