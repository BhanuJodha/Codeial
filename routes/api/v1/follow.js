const express = require("express");
const passport = require("passport");
const router = express.Router();

const followApi = require("../../../controllers/api/v1/follow_api");

router.get("/fetch_user_following", passport.authenticate("jwt",{session: false}), followApi.following);

router.get("/fetch_user_friends", passport.authenticate("jwt",{session: false}), followApi.getFriends);

router.post("/create_following", passport.authenticate("jwt",{session: false}), followApi.addFollow);

router.post("/remove_following", passport.authenticate("jwt",{session: false}), followApi.removeFollow);

module.exports = router;