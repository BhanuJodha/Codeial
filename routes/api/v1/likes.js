const express = require("express");
const passport = require("passport");
const router = express.Router();
const likesApi = require("../../../controllers/api/v1/likes_api");

router.get("/toggle", passport.authenticate("jwt", {session: false}), likesApi.toggleLike);

module.exports = router;