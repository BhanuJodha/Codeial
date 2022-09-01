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
            req.flash("error", err);
        }
        req.flash("success", "Logged out successfully");
        return res.redirect("./sign-in");
    });
}

module.exports.createSession = (req, res) => {
    req.flash("success", "Sign in successfully");
    return res.redirect("/home");
}

module.exports.create = async (req, res) => {
    try {
        if (req.body.password === req.body.confirm_password) {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                await User.create(req.body);
                req.flash("success", "User successfully created");
            }
            else{
                req.flash("error", "User already exists");
            }
            return res.redirect("./sign-in");
        }
        req.flash("error", "Password unmatch");
        return res.redirect("back");
        
    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}

module.exports.userProfile = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            req.flash("error", err);
        }
        if(user){
            return res.render("user_profile", {
                title: user.name,
                profile_user: user
            });
        }
        req.flash("warning", "Don't try to fiddle with system");
        res.redirect("back");
    })
}

module.exports.updateProfile = (req, res) => {
    if (req.user.id === req.params.id){
        return User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
            if (err) {
                req.flash("error", err);
            }
            req.flash("success", "Profile updated successfully");
            return res.redirect("back");
        })
    }
    req.flash("warning", "Unauthorized");
    return res.status(401).redirect("/home");
}