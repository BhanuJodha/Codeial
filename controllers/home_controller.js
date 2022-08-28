const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = (req,res)=>{
    Post.find({})
    .populate("user")
    .populate({
        path: "comments",
        populate: {
            path: "user"
        }
    })
    .exec((err, post) => {
        if (err) {
            console.error(err);
        }
        User.find({}, (err, user) => {
            res.render("home",{
                title: "Home Page",
                posts: post,
                profile_user: user
            })
        })
    })
}
