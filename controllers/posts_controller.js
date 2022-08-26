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

module.exports.deleteComment = (req, res) => {
    Comment.findById(req.params.id)
    .populate("post")
    .exec((err, comment) => {
        if (err) {
            console.error(err);
        }

        // Deleting comment id from post
        let index = comment.post.comments.indexOf(comment._id); // indexOf apply toString() by default
        comment.post.comments.splice(index, 1);
        comment.post.save();
        
        comment.remove();
        res.redirect("back");
    });
}