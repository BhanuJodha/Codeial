const Follow = require("../../../models/follow");
const User = require("../../../models/user");

exports.removeFollow = async (req, res) => {
    try {
        const toUser = await User.findById(req.query.user_id);

        if (toUser && toUser.id !== req.user.id) {
            const follow = await Follow.findOne({ to_user: toUser._id, by_user: req.user._id })

            if (!follow) {
                return res.status(400).json({
                    data: null,
                    success: false,
                    message: "Not following " + toUser.name
                });
            }

            req.user.following.pull(follow._id);
            await req.user.save();

            toUser.followers.pull(follow._id);
            await toUser.save();

            await follow.remove();

            return res.status(200).json({
                data: {
                    follow
                },
                success: true,
                message: "Unfollowed " + toUser.name
            });
        }

        return res.status(400).json({
            data: null,
            success: false,
            message: "Invalid user id"
        });
    } catch (err) {
        res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}

exports.addFollow = async (req, res) => {
    try {
        const toUser = await User.findById(req.query.user_id);

        if (toUser && toUser.id !== req.user.id) {
            let follow = await Follow.findOne({ to_user: toUser._id, by_user: req.user._id })

            if (follow) {
                return res.status(400).json({
                    data: {
                        follow
                    },
                    success: false,
                    message: "Already following " + toUser.name
                });
            }

            follow = await Follow.create({ to_user: toUser._id, by_user: req.user._id });

            req.user.following.push(follow._id);
            await req.user.save();

            toUser.followers.push(follow._id);
            await toUser.save();

            await follow.populate("to_user", "name email avatar");

            return res.status(200).json({
                data: {
                    follow
                },
                success: true,
                message: "Followed " + toUser.name
            });
        }

        return res.status(400).json({
            data: null,
            success: false,
            message: "Invalid user id"
        });
    } catch (err) {
        res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}

exports.following = async (req, res) => {
    try {
        await req.user.populate({
            path: "following",
            select: "to_user",
            populate: {
                path: "to_user",
                select: "name email avatar"
            }
        })

        return res.status(200).json({
            data: {
                following: req.user.following
            },
            success: true,
            message: "All following of " + req.user.name
        });

    } catch (err) {
        res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}


exports.getFriends = async (req, res) => {
    try {
        await req.user.populate([
            {
                path: "following",
                select: "to_user",
                populate: {
                    path: "to_user",
                    select: "name email avatar"
                }
            },
            {
                path: "followers",
                select: "by_user",
                populate: {
                    path: "by_user",
                    select: "name email avatar"
                }
            }
        ])

        let following = req.user.following;
        let followers = req.user.followers;

        // Aggregating followers
        followers = followers.filter(follower => {
            for(let follow of following){
                if (follower.by_user.id === follow.to_user.id){
                    return false;
                }
            }
            return true;
        })

        followers = followers.map(f => f.by_user);
        following = following.map(f => f.to_user);

        return res.status(200).json({
            data: {
                friends: [...following, ...followers]
            },
            success: true,
            message: "All friends of " + req.user.name
        });

    } catch (err) {
        res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}