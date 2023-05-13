const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController.js");

router.post("/register", userController.Register);

router.post("/login", userController.Login);

module.exports = router;
