const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/posts_controller");

router.post("/create", passport.userAuthenticated, controller.createPost);

router.post("/comment", passport.userAuthenticated, controller.createComment);

module.exports = router;
