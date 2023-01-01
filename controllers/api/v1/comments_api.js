const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
const Like = require("../../../models/like");
const queue = require("../../../workers/comment_email_worker");

exports.createComment = async (req, res) => {
    try {
        let post = await Post.findById(req.body.post_id);
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
                select: "name email avatar"
            })

            // For sending mail to the user
            let job = queue.create("newComment", comment).save((err) => {
                if (err) {
                    return console.log("Error in enqueue :", err);
                }
                console.log("Job enqueued", job.id);
            })

            res.status(200).json({
                data: {
                    comment
                },
                success: true,
                message: "Your comment is published"
            })
        }
        else {
            res.status(400).json({
                data: null,
                success: false,
                message: "Invalid post id: " + req.body.post_id
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}