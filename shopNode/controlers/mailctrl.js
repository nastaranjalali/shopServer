const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

exports.add_product = async function (req, res) {
  console.log("req.body", req.body);
  try {
    var errors = [];
    const { name, price, img } = req.body;
    var image = img && img !== "" ? img : "default.jpg";

    if (name.length < 3 || price < 0) {
      if (name.length < 3) {
        errors.push({ key: "name", errorText: "Name is too short!" });
      }
      if (price < 0) {
        errors.push({
          key: "price",
          errorText: "price cannot be minus!",
        });
      }

      res.status(400).json({ errors: errors });
      return;
    }

    const existProduct = await Product.findOne({ name });
    if (existProduct) {
      errors.push({
        key: "name",
        errorText: "this product already exists !",
      });
      res.status(409).json({ errors: errors });
      return;
    }
    let product = new Product({
      name: name,
      price: price,
      img: image,
    });

    console.log(product);
    product
      .save()
      .then((data) => {
        console.log("saved");
        res.status(201).json({
          message: "Successfully created",
          data,
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
exports.get_product = function (req, res) {
  Product.find({}, (err, products) => {
    if (err) return handleError(err);
    res.status(200).json({ products });
  });
};
