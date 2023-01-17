const express = require("express");
const passport = require("passport");
const env = require("../../../config/environment");
const router = express.Router();

const userApi = require("../../../controllers/api/v1/user_api");

router.post("/login", userApi.login);

router.post("/signup", userApi.signup);

router.get("/checkGoogleAuth", userApi.checkGoogleAuth);

router.post("/edit", passport.authenticate("jwt",{session: false}), userApi.editUser);

router.get("/search", passport.authenticate("jwt",{session: false}), userApi.searchUsers);

// Google OAuth-2 Strategy
router.get("/oauth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/oauth/google/callback", passport.authenticate("google", {failureRedirect: env.google_failure_redirect, successRedirect: env.google_success_redirect}));

router.get("/:id", passport.authenticate("jwt",{session: false}), userApi.userInfo);

module.exports = router;
