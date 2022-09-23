const User = require("../models/user");
const ResetPasswordToken = require("../models/reset_password");
const crypto = require("crypto");
const nodeMailer = require("../mailers/reset_password_mailer");

exports.resetPage = (req, res) => {
    res.render("reset_password", {
        title: "Forgot Password"
    });
}

exports.generateToken = async (req, res) => {
    try {
        let userMail = req.body.email;

        let user = await User.findOne({ email: userMail });
        if (user) {
            // check if a user already have a token 
            let prevToken = await ResetPasswordToken.findOne({ user: user._id });
            if (prevToken) {
                req.flash("warning", "Token already mailed on registered email");
            }
            else{
                let tokenObject = await ResetPasswordToken.create({
                    user: user._id,
                    accessToken: crypto.randomBytes(20).toString("hex")
                });

                // assign user to token for context of mail
                tokenObject.user = user;
                nodeMailer.resetLink(tokenObject);

                req.flash("success", "Link is sent on registered email");
            }
            return res.redirect("/user/sign-in");
        }

        req.flash("warning", "No user find")
        return res.redirect("back");

    } catch (err) {
        console.log(err);
    }
}

exports.updatePassword = async (req, res)=> {
    let tokenObject = await ResetPasswordToken.findOne({accessToken: req.params.token});
    if (tokenObject){
        res.render("new_password", {title: "New Password", token: tokenObject});
    }
    else {
        req.flash("error", "Token has expire or used");
        res.redirect("/user/forgot-password");
    }
}

exports.changePassword = async (req, res) => {
    let tokenObject = await ResetPasswordToken.findOne({accessToken: req.body.access_token});
    if (tokenObject){
        if (req.body.password === req.body.password_confirm){
            // changing password and populating user
            tokenObject.user = await User.findByIdAndUpdate(tokenObject.user, {password: req.body.password});
            await tokenObject.remove();
    
            nodeMailer.passwordChanged(tokenObject);
    
            req.flash("success", "Password is changed successfully");
            res.redirect("/user/sign-in");
        }
        else {
            req.flash("error", "Password mismatch");
            res.redirect("back");
        }
    }
    else {
        req.flash("warning", "Don't try to fiddle with system");
        res.redirect("/user/forgot-password");
    }
}