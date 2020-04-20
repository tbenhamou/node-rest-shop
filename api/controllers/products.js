const mongoose = require("mongoose");

const Product = require("../models/product");


exports.index = (req, res, next) => {
  Product.find()
    .select("name price _id image")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            image: process.env.APP_URL + doc.image,
            links: {
              type: "GET",
              url: process.env.APP_URL + "products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};

exports.store = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    image: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product successfully added",
        product: {
          name: result.name,
          price: result.price,
          image: process.env.APP_URL + result.image,
          _id: result._id,
          links: {
            type: "GET",
            url: process.env.APP_URL + "products/" + result._id,
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
};

exports.show = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id image")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          name: doc.name,
          price: doc.price,
          image: process.env.APP_URL + doc.image,
          _id: doc._id,
          links: {
            type: "GET",
            url: process.env.APP_URL + "products/",
          },
        });
      } else {
        res.status(404).json({
          message: "No entry found for this ID",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};

exports.update = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product successfully updated!",
        links: {
          type: "GET",
          url: process.env.APP_URL + "products/" + id,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};

exports.delete = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .then((result) => {
      res.status(200).json({
        message: "Product Successfully deleted!",
        links: {
          type: "POST",
          url: process.env.APP_URL + "products",
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};
