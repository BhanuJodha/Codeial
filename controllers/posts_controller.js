const Post = require("../models/post");
const Comment = require("../models/comment");
const postMailer = require("../mailers/post_mailer");

module.exports.createPost = async (req, res) => {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        })

        await post.populate({
            path: "user",
            select: "name email avatar -_id"
        })

        // For sending mail to the user
        postMailer.newPost(post);

        // For AJAX Requests
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post
                },
                message: "Post created successfully"
            });
        }

        req.flash("success", "Post added successfully");
        return res.redirect("back");

    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (post && post.user.toString() === req.user.id) {
            await Comment.deleteMany({ post: post._id });
            
            await post.populate({
                path: "user", 
                select: "name email avatar -_id"
            });

            postMailer.deletePost(post);

            post.remove();

            // For AJAX Requests
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: post.id
                    },
                    message: "Post and associated comments deleted"
                });
            }

            req.flash("success", "Post and associated comments deleted");
        }
        else {
            // For AJAX Requests
            if (req.xhr) {
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