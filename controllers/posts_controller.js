const Post = require("../models/post");
const Comment = require("../models/comment");

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

module.exports.deletePost = (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err);
        }
        if (post.user.toString() === req.user.id) {
            Comment.deleteMany({post: post._id}, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            post.remove();
        }
        return res.redirect("back");
    })
}