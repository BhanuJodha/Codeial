const express = require("express");
const router = express.Router();

const controller = require("../controllers/home_controller");

router.use("/user", require("./users"));

router.get("/", controller.home);


module.exports = router;