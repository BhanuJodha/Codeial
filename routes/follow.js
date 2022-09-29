const express = require("express");
const router = express.Router();

const controller = require("../controllers/follow_controllers");

router.get("/:id", controller.toggleFollow);

module.exports = router;