const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
const queue = require("../../../workers/post_email_worker");

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
        }).populate({
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
            message: "Post created successfully"
        });

    } catch (err) {
        return res.status(500).json({
            data: null,
            message: err.message
        });
    }
}
