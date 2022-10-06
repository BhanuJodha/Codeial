const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/users_controller");

router.use("/forgot-password", require("./reset_password"));

router.get("/profile/:id", controller.userProfile);

router.post("/update/:id", passport.userAuthenticated, controller.updateProfile);

router.get("/sign-in", passport.userUnauthenticated, controller.signIn);

router.get("/sign-up", controller.signUp);

router.get("/sign-out", passport.userAuthenticated, controller.deleteSession);

router.post("/create", controller.create);

// Google OAuth-2 Strategy
router.get("/oauth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/oauth/google/callback", passport.authenticate("google", { failureRedirect: "/user/sign-in", failureFlash: "Unable to authenticate with google" }), controller.createSession);

// Passport local Strategy
router.post("/create-session", passport.authenticate("local", { failureRedirect: "/user/sign-in" }), controller.createSession);


module.exports = router;