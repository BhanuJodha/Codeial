const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async (req, res) => {
    try {
        let post = await Post.find({})
            .sort("-createdAt")
            .populate("user")
            .populate({
                path: "comments",
                options: {
                    sort: "-createdAt"
                },
                populate: {
                    path: "user"
                }
            });

        let user = await User.find({});

        return res.render("home", {
            title: "Home Page",
            posts: post,
            profile_user: user
        });

    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}
