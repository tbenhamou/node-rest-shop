const express = require("express");
const router = express.Router();

const checkAuth = require('../middlewares/check-auth');

const UserController = require('../controllers/users');

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.delete("/:userId", checkAuth, UserController.delete);

module.exports = router;
