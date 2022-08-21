const Post = require("../models/post");

module.exports.createPost = (req, res) => {
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, (err, doc) => {
        if (err) {
            console.error(err);
        }
        return res.redirect("back");
    })
}