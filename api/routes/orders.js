const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/check-auth");

const OrderController = require('../controllers/orders');

router.get("/", OrderController.index);

router.post("/", checkAuth, OrderController.store);

router.get("/:orderId", OrderController.show);

// @TODO
router.patch("/:orderId", checkAuth, OrderController.update);

router.delete("/:orderId", checkAuth, OrderController.delete);

module.exports = router;
