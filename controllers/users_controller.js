const User = require("../models/user");

module.exports.signIn = (req, res)=>{
    res.render("signIn",{
        title: "Sign In"
    });
}

module.exports.signUp = (req, res)=>{
    res.render("signUp",{
        title: "Sign Up"
    });
}

module.exports.createSession = (req, res) =>{
    // todo something
}

module.exports.create = (req, res) =>{
    if (req.body.password === req.body.confirm_password){
        return User.findOne({email: req.body.email}, (err, doc)=>{
            if (err){
                return res.end(err.toString());
            }
            if(!doc){
                return User.create(req.body, (err)=>{
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