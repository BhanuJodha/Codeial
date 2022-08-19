const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, function (email, password, done) {
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            console.log(err.toString());
            return done(err);
        }
        if (!user || user.password !== password) {
            console.log("Incorrect password or username");
            return done(null, false);
        }
        return done(null, user);
    });
})
);


// serialization of cookies to be sent
passport.serializeUser(function (user, done) {
    done(null, user.id);
})

// deserialization of cookies to be received
passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
        if (err) {
            console.log(err.toString());
            return done(err);
        }
        done(null, user);
    })
})


passport.userAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/user/sign-in");
}

passport.userUnauthenticated = (req, res, next) => {
    if (req.isUnauthenticated()) {
        return next();
    }
    res.redirect("/user/profile");
}

passport.setLocals = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();
}

module.exports = passport;