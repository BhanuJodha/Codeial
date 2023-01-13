const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
const queue = require("../../../workers/post_email_worker");
const Like = require("../../../models/like");

module.exports.index = async (req, res) => {
    try {
        if (!req.query.page || !req.query.limit) {
            return res.status(400).json({
                data: null,
                success: false,
                message: "Limit and page required"
            })
        }

        return res.status(200).json({
            data: {
                next: {
                    page: parseInt(req.query.page) + 1,
                    limit: parseInt(req.query.limit)
                },
                posts: await Post.find({}, {},
                    {
                        limit: req.query.limit,
                        skip: req.query.limit * (parseInt(req.query.page) - 1),
                        sort: "-createdAt",
                        populate: [
                            {
                                path: "user",
                                select: "name email avatar"
                            },
                            {
                                path: "comments",
                                options: {
                                    sort: "-createdAt"
                                },
                                populate: [
                                    {
                                        path: "user",
                                        select: "email name avatar"
                                    },
                                    {
                                        path: "likes",
                                        select: "user"
                                    }
                                ]
                            },
                            {
                                path: "likes",
                                select: "user"
                            }
                        ]
                    })
            },
            message: "List of posts",
            success: true
        });

    } catch (err) {
        res.status(500).json({
            data: null,
            success: false,
            message: err.message
        });
    }
}

module.exports.createPost = async (req, res) => {
    try {
        if (!req.body.content) {
            return res.status(400).json({
                data: null,
                success: false,
                message: "Content of post required"
            })
        }

        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        })
        await post.populate({
            path: "user",
            select: "name email avatar"
        })

        // For sending mail to the user   
        let job = queue.create("newPost", post).save((err) => {
            if (err) {
                return console.log("Error in enqueue :", err);
            }
            console.log("Job enqueued", job.id);
        })

        return res.status(200).json({
            data: {
                post
            },
            success: true,
            message: "Post created successfully"
        });

    } catch (err) {
        return res.status(500).json({
            data: null,
            success: false,
            message: err.message
        });
    }
}

exports.deletePost = async (req, res) => {
    try {
        let post = await Post.findById(req.query.post_id);
        if (post && post.user.toString() === req.user.id) {
            // deleting associated comments and likes
            await Comment.deleteMany({ _id: { $in: post.comments } });
            await Like.deleteMany({ _id: { $in: post.likes } });
            await Like.deleteMany({ onModel: "Comment", likeable: { $in: post.comments } });

            await post.populate({
                path: "user",
                select: "name email avatar"
            });

            // For sending mail to the user
            let job = queue.create("deletePost", post).save((err) => {
                if (err) {
                    return console.log("Error in enqueue :", err);
                }
                console.log("Job enqueued", job.id);
            })

            await post.delete();

            return res.status(200).json({
                data: {
                    post
                },
                success: true,
                message: "Post and associated comments deleted successfully"
            });
        }
        else {
            res.status(400).json({
                data: null,
                success: false,
                message: "Invalid request"
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