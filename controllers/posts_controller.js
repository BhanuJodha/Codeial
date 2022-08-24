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

module.exports.createComment = (req, res) => {
    Post.findById(req.body.post, (err, post) => {
        if (err) {
            console.error(err);
        }
        if (post) {
            Comment.create({
                content: req.body.content,
                user: req.user,
                post: post._id,
            }, (err, comment) => {
                if (err) {
                    console.error(err);
                }
                post.comments.push(comment._id);
                post.save();
            });
        }
        return res.redirect("back");
    }); 
    
}