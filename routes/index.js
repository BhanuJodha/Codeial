const express = require("express");
const router = express.Router();
const passport = require("passport");
const custMiddelware = require("../config/middelware");
const cors = require("cors");
const env = require("../config/environment");

const controller = require("../controllers/home_controller");

// API routing
router.use("/api", cors({origin: env.clientCorsOrigin, credentials: true}), require("./api/index"));

// React version
router.get("/v2/*", controller.reactFiles);

// custom middelware for flash messages
router.use(custMiddelware.flash);

router.get("/", controller.home);

router.use("/user", require("./users"));

router.use("/post", passport.userAuthenticated, require("./posts"));

router.use("/like", passport.userAuthenticated, require("./likes"))

router.use("/follow", passport.userAuthenticated, require("./follow"))

router.use("/comment", passport.userAuthenticated, require("./comment"));

router.use("/chat", passport.userAuthenticated, require("./chat"));

module.exports = router;