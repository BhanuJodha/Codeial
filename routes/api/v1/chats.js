const express = require("express");
const passport = require("passport");
const chatApi = require("../../../controllers/api/v1/chat_api");

const router = express.Router();

router.get("/getChat/:id", passport.authenticate("jwt", {session: false}), chatApi.getChat);

module.exports = router;