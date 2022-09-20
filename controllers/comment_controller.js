const Post = require("../models/post");
const Comment = require("../models/comment");
const commentMailer = require("../mailers/comment_mailer");

module.exports.createComment = async (req, res) => {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: post._id,
            });
            post.comments.push(comment._id);
            await post.save();

            await comment.populate({
                path: "user", 
                select: "name email avatar -_id"
            })

            // For sending mail to the user
            commentMailer.newComment(comment);

            // For AJAX Requests
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment
                    },
                    message: "Comment added successfully"
                });
            }

            req.flash("success", "Comment added successfully");
        }
        else{
            // For AJAX Requests
            if (req.xhr){
                return res.status(401).send("Don't try to fiddle with system");
            }

            req.flash("warning", "Don't try to fiddle with system");
        }
        return res.redirect("back");

    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}

module.exports.deleteComment = async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id).populate("post");

        if (comment && (comment.user.toString() === req.user.id || comment.post.user.toString() === req.user.id)) {
            await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
            
            await comment.populate({
                path: "user", 
                select: "name email avatar -_id"
            })
            
            // For sending mail to the user
            commentMailer.deleteComment(comment);
            
            comment.remove();
            
            // For AJAX Requests
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: comment.id
                    },
                    message: "Comment deleted successfully"
                });
            }

            req.flash("success", "Comment deleted successfully");
        }
        else{
            // For AJAX Requests
            if (req.xhr){
                return res.status(401).send("Don't try to fiddle with system");
            }
            
            req.flash("warning", "Don't try to fiddle with system");
        }

        res.redirect("back");

    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}