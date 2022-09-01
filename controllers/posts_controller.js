const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.createPost = (req, res) => {
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, (err, doc) => {
        if (err) {
            req.flash("error", err);
        }
        req.flash("success", "Post added successfully");
        return res.redirect("back");
    })
}

module.exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (post.user.toString() === req.user.id) {
            await Comment.deleteMany({post: post._id});
            post.remove();
            req.flash("success", "Post and associated comments deleted");
        }
        else{
            req.flash("warning", "Don't try to fiddle with system");
        }
        return res.redirect("back");
        
    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}