const express = require("express");
const router = express.Router();

const controller = require("../controllers/users_controller");

router.get("/pro", controller.pro);

router.get("/", controller.user)


module.exports = router;