const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.add_product = async function (req, res) {
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
          foundCart.totalPrice += foundProduct.price;
          foundCart.products[productExistsInCart].quantity += quantity;
          await foundCart.save();
          res.status(200).json({ foundCart, user: req.user });
        } else {
          foundCart.products.push({
            product_id: foundProduct._id,
            quantity: quantity,
          });
          foundCart.totalPrice += foundProduct.price;
          foundCart.save();
          res.status(200).json({ added: true });
        }
      } else {
        let cart = new Cart({
          user: foundUser._id,
          products: [{ product_id: foundProduct._id, quantity: quantity }],
          totalPrice: foundProduct.price,
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
        key: "notFound",
        errorText: "user or product does not exist !",
      });
      res.status(404).json({ errors: errors });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
exports.delete_product = async function (req, res) {
  var errors = [];
  try {
    const foundUser = await User.findOne({ username: req.user.username });
    const foundProduct = await Product.findOne({ _id: req.params.id });

    if (foundUser && foundProduct) {
      let foundCart = await Cart.findOne({ user: foundUser._id });
      if (foundCart) {
        const productExistsInCart = foundCart.products.findIndex(
          ({ product_id }) => product_id == foundProduct._id.toString()
        );

        if (productExistsInCart >= 0) {
          foundCart.totalPrice -=
            foundProduct.price *
            foundCart.products[productExistsInCart].quantity;

          foundCart.products.splice(productExistsInCart, 1);
          await foundCart.save();
          res.status(200).json({ deleted: true });
        } else {
          errors.push({
            key: "product",
            errorText: "product not found!",
          });
          res.status(404).json({ errors: errors });

          return;
        }
      } else {
        errors.push({
          key: "cart",
          errorText: "cart not found!",
        });
        res.status(404).json({ errors: errors });

        return;
      }
    } else {
      errors.push({
        key: "notFound",
        errorText: "user or product does not exist !",
      });
      res.status(409).json({ errors: errors });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
    return;
  }
};
exports.get_cart = async function (req, res) {
  try {
    const foundUser = await User.findOne({ username: req.user.username });
    if (foundUser) {
      const foundCart = await Cart.findOne({ user: foundUser._id });
      if (foundCart) {
        const idOfProducts = [];
        foundCart.products.forEach((element) => {
          idOfProducts.push(element.product_id);
        });
        let products = await Product.find({ _id: { $in: idOfProducts } });
        foundCart.products.forEach((element, index) => {
          products[index] = {
            ...products[index]._doc,
            count: element.quantity,
          };
        });

        res
          .status(200)
          .json({ products: products, totalPrice: foundCart.totalPrice });
      } else {
        let cart = new Cart({
          user: foundUser._id,
          products: [],
        });

        cart.save().then(() => {
          res.status(201).json({
            message: "nothing in the cart",
            products: cart.products,
          });
        });
      }
    } else {
      errors.push({
        key: "user",
        errorText: "user not found!",
      });
      res.status(404).json({ errors: errors });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
exports.set_quantity = async function (req, res) {
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
          foundCart.products[productExistsInCart].quantity = quantity;
          await foundCart.save();
          res.status(200).json({ foundCart, user: req.user });
        } else {
          errors.push({
            key: "notFound",
            errorText: " product does not exist in cart !",
          });
          res.status(404).json({ errors: errors });
          return;
        }
      } else {
        errors.push({
          key: "notFound",
          errorText: "cart does not exist !",
        });
        res.status(404).json({ errors: errors });
        return;
      }
      return;
    } else {
      errors.push({
        key: "notFound",
        errorText: "user or product does not exist !",
      });
      res.status(404).json({ errors: errors });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
