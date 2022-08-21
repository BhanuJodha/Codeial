const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/users_controller");

router.get("/home", passport.userAuthenticated, require("../controllers/home_controller").home);

router.get("/profile", passport.userAuthenticated, controller.userProfile);

router.get("/sign-in", passport.userUnauthenticated, controller.signIn);

router.get("/sign-up", controller.signUp);

router.get("/sign-out", passport.userAuthenticated, controller.deleteSession);

router.post("/create", controller.create);

// getting verified by passport middelware
router.post("/create-session", passport.authenticate("local", { failureRedirect: "/sign-in" }), controller.createSession)


module.exports = router;