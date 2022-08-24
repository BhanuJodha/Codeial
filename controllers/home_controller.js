const Post = require("../models/post");

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
        res.render("home",{
            title: "Home Page",
            posts: post
        })
    })
}
