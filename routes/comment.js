const express = require("express");
const router = express.Router();

const controller = require("../controllers/comment_controller");

router.post("/create", controller.createComment);

router.get("/delete/:id", controller.deleteComment);

module.exports = router;
