const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async (req, res) => {
    try {
        // console.log(req.headers)
        res.status(200).json({
            data: {
                post: await Post.find({})
                .sort("-createdAt")
                .populate("user", "-password")
                .populate({
                    path: "comments",
                    options: {
                        sort: "-createdAt"
                    },
                    populate: {
                        path: "user",
                        select: "-password"
                    }
                })
            },
            message: "Success on posts"
        });
    } catch (err) {
        res.status(500).json({
            data: null,
            message: "Error : Internal server error"
        });
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post){
            return res.status(404).json({
                data: null,
                message: "Post not found!"
            });
        }

        if (post.user.toString() === req.user.id){
            await Comment.deleteMany({post: post._id});
            post.remove();
            return res.status(200).json({
                data: {
                    post_id: post.id
                },
                message: "Post and associated comments deleted"
            });
        }

        return res.status(401).json({
            data: null,
            message: "Unauthorized to delete this post"
        });
        
    } catch (err) {
        res.status(500).json({
            data: null,
            message: "Error : Internal server error"
        });
    }
}