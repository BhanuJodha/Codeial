const express = require("express");
const Router = express.Router();

const controller = require("../controllers/chat_controller");

Router.get("/:id", controller.openChat);

module.exports = Router;