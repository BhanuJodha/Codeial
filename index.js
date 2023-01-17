const express = require("express");
const env = require("./config/environment");
const port = 8000;
const app = express();
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

// setting socket.io files
const socket = require("./config/socket_io")(app);

// passport authentication files
const passport = require("passport");
const passportLocal = require("./config/passport_local_strategy");
const passportJwt = require("./config/passport_jwt_strategy");
const passportGoogle = require("./config/passport_google_oauth2_strategy");

// initializing views helper
const viewHelper = require("./config/view_helper")(app);

// setting SASS or SCSS
if (env.name === "Devlopment"){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, "/scss"),
        dest: path.join(__dirname, env.asset_path, "/css"),
        debug: true,
        outputStyle: "expanded",
        prefix: "/css"
    }))
}

// setting statics
app.use(express.static(path.join(__dirname, env.asset_path)));

// setting statics for react
app.use("/v2", express.static(path.join(__dirname, "build")));

// setting statics for profile picture
app.use("/uploads", cors({origin: env.clientCorsOrigin}), express.static("./uploads"));

// setting logger
app.use(logger(env.morgan.mode, env.morgan.options));

// setting layouts
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// setting view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Extracting x-www-form-urlencoded form
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// setting cookie parser
app.use(cookieParser());

// setting session cookies
app.use(session({
    name: "Codeial",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    rolling: false,
    cookie: {
        maxAge: 300000
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

// setting flash messages
app.use(flash());

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