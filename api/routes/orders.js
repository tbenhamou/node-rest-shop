const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate("product", "name price")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            links: {
              type: "GET",
              url: process.env.APP_URL + "orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch();
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.product)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then((doc) => {
      res.status(201).json({
        message: "Order successfully created!",
        order: {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          links: {
            type: "GET",
            url: process.env.APP_URL + "orders/" + doc._id,
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product", "name price")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found!",
        });
      }
      res.status(200).json({
        order: {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
        },
        links: {
          type: "GET",
          url: process.env.APP_URL + "orders",
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// @TODO
router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  res.status(200).json({
    message: "Updated Order",
    id: id,
  });
});

router.delete("/:orderId", (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order successfully deleted!",
        links: {
          type: "POST",
          url: process.env.APP_URL + "orders",
          body: { product: "ID", quantity: "Number" },
        },
      });
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

module.exports = router;
