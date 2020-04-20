const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname.replace(/\s/g, "_"));
  },
});

const fileFilter = (req, file, cb) => {
  // Reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const checkAuth = require("../middlewares/check-auth");

const ProductController = require('../controllers/products');


// Get all products
router.get("/", ProductController.index);

// Add a new product
router.post("/", checkAuth, upload.single('image'), ProductController.store);

// Get a product by ID
router.get("/:productId", ProductController.show);

// Update a product
router.patch("/:productId", checkAuth, ProductController.update);

router.delete("/:productId", checkAuth, ProductController.delete);

module.exports = router;
