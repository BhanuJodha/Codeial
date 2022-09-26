const Post = require("../models/post");
const Like = require("../models/like");
const Comment = require("../models/comment");

exports.toggleLike = async (req, res) => {
    try {
        let onModel = req.query.onModel;
        let parent;
        if (onModel === "Post") {
            parent = await Post.findById(req.query.id).populate("likes");
        }
        else if (onModel === "Comment") {
            parent = await Comment.findById(req.query.id).populate("likes");
        }
        else {
            return res.status(404).json({
                data: null,
                message: "Invalid onModel reference"
            });
        }

        if (parent) {
            // finding same user like if exists
            let like = parent.likes.find(e => e.user.toString() === req.user.id);

            if (like) {
                // remove like
                parent.likes.pull(like._id);
                await parent.save();
                await Like.findByIdAndRemove(like._id);

                return res.status(200).json({
                    data: {
                        likes: parent.likes.length
                    },
                    message: "Like removed successfully"
                });
            }
            else {
                // add like
                like = await Like.create({
                    user: req.user._id,
                    likeable: parent._id,
                    onModel
                })
                parent.likes.push(like._id);
                await parent.save();

                return res.status(200).json({
                    data: {
                        likes: parent.likes.length
                    },
                    message: "Like added successfully"
                });
            }
        }

        return res.status(404).json({
            data: null,
            message: "Invalid post/comment id"
        });

        // req.flash("warning", "Invalid post/comment id");
        // return res.redirect("back");

    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}