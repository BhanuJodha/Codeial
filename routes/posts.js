const express = require("express");
const router = express.Router();

const controller = require("../controllers/posts_controller");

router.post("/create", controller.createPost);

router.get("/delete/:id", controller.deletePost);

module.exports = router;
