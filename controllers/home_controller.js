const path = require("path");
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

        let signedUser = await User.findById(req.user)
        .populate({
            path: "following", 
            populate: {
                path: "to_user"
            }
        })
        .populate({
            path: "followers",
            populate:{
                path: "by_user"
            }
        });

        return res.render("home", {
            title: "Home Page",
            posts: post,
            all_users: user,
            signed_user: signedUser
        });

    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}

exports.reactFiles = (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
}
