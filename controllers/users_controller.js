const User = require("../models/user");

module.exports.signIn = (req, res) => {
    res.render("sign_in", {
        title: "Sign In"
    });
}

module.exports.signUp = (req, res) => {
    res.render("sign_up", {
        title: "Sign Up"
    });
}

module.exports.deleteSession = (req, res) => {
    req.logout((err) => {
        if (err){
            console.log(err);
        }
        return res.redirect("./sign-in");
    });
}

module.exports.createSession = (req, res) => {
    return res.redirect("/home");
}

module.exports.create = (req, res) => {
    if (req.body.password === req.body.confirm_password) {
        return User.findOne({ email: req.body.email }, (err, doc) => {
            if (err) {
                return res.end(err.toString());
            }
            if (!doc) {
                return User.create(req.body, (err) => {
                    if (err) {
                        return res.end(err.toString());
                    }
                    return res.redirect("./sign-in");
                })
            }
            console.log("User already exists");
            return res.redirect("./sign-in");
        })
    }
    console.log("Error : Password unmatch");
    return res.redirect("back");
}

module.exports.userProfile = (req, res) => {
    res.render("user_profile", {
        title: res.locals.user.name,
        user: res.locals.user
    });
}