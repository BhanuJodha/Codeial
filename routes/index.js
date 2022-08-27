const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/home_controller");

// for form data
router.use(express.urlencoded({
    extended: false
}))


router.use("/user", require("./users"));

router.use("/post", passport.userAuthenticated, require("./posts"));

router.use("/comment", passport.userAuthenticated, require("./comment"));

router.get("/home", controller.home);


module.exports = router;