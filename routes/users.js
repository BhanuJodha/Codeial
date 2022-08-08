const express = require("express");
const router = express.Router();

const controller = require("../controllers/users_controller");

// for form data
router.use(express.urlencoded({
    extended: false
}))

router.get("/sign-in", controller.signIn);

router.get("/sign-up", controller.signUp);

router.post("/create", controller.create)

router.post("/create-session", controller.createSession)


module.exports = router;