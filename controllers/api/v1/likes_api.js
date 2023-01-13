const Post = require("../../../models/post");
const Like = require("../../../models/like");
const Comment = require("../../../models/comment");

exports.toggleLike = async (req, res) => {
    try {
        let onModel = req.query.onModel;

        let parent;
        if (onModel === "Post") {
            parent = await Post.findById(req.query.likeable_id).populate("likes");
        }
        else if (onModel === "Comment") {
            parent = await Comment.findById(req.query.likeable_id).populate("likes");
        }

        else {
            return res.status(400).json({
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
                        deleted: true,
                        like
                    },
                    success: true,
                    message: "Like removed successfully"
                });
            }
            else {
                // add like
                like = await Like.create({
                    user: req.user._id,
                    likeable: parent._id,
                    onModel
                });
                parent.likes.push(like._id);
                await parent.save();

                return res.status(200).json({
                    data: {
                        deleted: false,
                        like
                    },
                    success: true,
                    message: "Like added successfully"
                });
            }
        }

        return res.status(400).json({
            data: null,
            success: false,
            message: `Invalid ${onModel}_id`
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}