const Post = require("../models/post");
const Comment = require("../models/comment");

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

        if (comment.user.toString() === req.user.id || comment.post.user.toString() === req.user.id){
            Post.findByIdAndUpdate(comment.post, {$pull: {comments: comment._id}}, (err)=>{
                return console.log(err);
            });            
            comment.remove();
        }
        res.redirect("back");
    });
}