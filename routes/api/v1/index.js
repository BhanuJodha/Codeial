const express = require("express");

const router = express.Router();

router.use("/posts", require("./posts"));

router.use("/users", require("./users"));

router.use("/followship", require("./follow"));

router.use("/comments", require("./comments"));

router.use("/likes", require("./likes"));

module.exports = router;