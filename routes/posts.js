const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/posts_controller");

router.post("/create", controller.createPost);

router.post("/comment", controller.createComment);

router.get("/delete/:id", controller.deletePost);

router.get("/delete-comment/:id", controller.deleteComment);

module.exports = router;
