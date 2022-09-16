const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            req.flash("error", err);
            return done(err);
        }
        if (!user || user.password !== password) {
            req.flash("error", "Incorrect password or username");
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
    if (req.xhr){
        return res.status(401).send("User is not signed-in");
    }
    req.flash("warning", "User is not signed-in")
    res.redirect("/user/sign-in");
}

passport.userUnauthenticated = (req, res, next) => {
    if (req.isUnauthenticated()) {
        return next();
    }
    req.flash("warning", "User is already signed-in")
    res.redirect("/user/profile/"+ req.user.id);
}

passport.setLocals = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();
}

module.exports = passport;