const express = require("express");
const port = 8000;
const app = express();
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");


// instantiating config files
const passportLocal = require("./config/passport_local_strategy");
const db = require("./config/mongoose");


// setting SASS or SCSS
app.use(sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css"
}))

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

// setting session cookies
app.use(session({
    name: "Codial",
    secret: "Secure3D#",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 600000
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: "enable"
        },
        function (err) {
            console.log(err);
        }
    )
}))

// setting passport
app.use(passport.initialize());
app.use(passport.session());

// setting locals
app.use(passport.setLocals);

// express router
app.use("/", require("./routes/index"));


app.listen(port, (err) => {
    if (err) {
        return console.log("Unable to start server :", err);
    }
    return console.log("Server is listening on port", port);
})