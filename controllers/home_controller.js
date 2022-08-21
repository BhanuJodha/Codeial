const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = (req,res)=>{
    Post.find({}).populate("user").exec((err, post) => {
        if (err) {
            console.error(err);
        }
        res.render("home",{
            title: "Home Page",
            posts: post
        })
    })
}
