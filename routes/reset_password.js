const express = require("express");
const router = express.Router();

const controller = require("../controllers/reset_password_controller");


router.get("/", controller.resetPage);

router.get("/:token", controller.updatePassword);

router.post("/generate-token", controller.generateToken);

router.post("/change-password", controller.changePassword);


module.exports = router;