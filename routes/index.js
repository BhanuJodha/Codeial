const express = require("express");
const router = express.Router();
const passport = require("passport");
const custMiddelware = require("../config/middelware");

const controller = require("../controllers/home_controller");

// API routing
router.use("/api", require("./api/index"));

// custom middelware for flash messages
router.use(custMiddelware.flash);

router.use("/user", require("./users"));

router.use("/post", passport.userAuthenticated, require("./posts"));

router.use("/like", passport.userAuthenticated, require("./likes"))

router.use("/follow", passport.userAuthenticated, require("./follow"))

router.use("/comment", passport.userAuthenticated, require("./comment"));

router.use("/chat", passport.userAuthenticated, require("./chat"));

router.get("/home", controller.home);

module.exports = router;