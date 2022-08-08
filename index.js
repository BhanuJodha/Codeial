const express = require("express");
const port = 8000;
const app = express();
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");

// adding database
const db = require("./config/mongoose");



// setting statics
app.use(express.static("./assets"));

// setting cookie parser
app.use(cookieParser());

// setting layouts
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// setting view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// express router
app.use("/", require("./routes/index"));


app.listen(port, (err) => {
    if (err) {
        return console.log("Unable to start server :", err);
    }
    return console.log("Server is listening on port", port);
})