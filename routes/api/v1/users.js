const express = require("express");
const passport = require("passport");
const router = express.Router();

const userApi = require("../../../controllers/api/v1/user_api");

router.post("/login", userApi.login);

router.post("/signup", userApi.signup);

router.post("/editUser", passport.authenticate("jwt",{session: false}), userApi.editUser);

router.get("/searchUser", passport.authenticate("jwt",{session: false}), userApi.searchUser);

router.get("/userInfo/:id", passport.authenticate("jwt",{session: false}), userApi.userInfo);

module.exports = router;
