const express = require("express");
const passport = require("passport");
const router = express.Router();
const postsApi = require("../../../controllers/api/v1/posts_api");


router.get("/", postsApi.index);

router.post("/create", passport.authenticate("jwt", {session: false}), postsApi.createPost);

router.delete("/", passport.authenticate("jwt", {session: false}), postsApi.deletePost);

module.exports = router;