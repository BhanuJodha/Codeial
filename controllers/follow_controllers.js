const Follow = require("../models/follow");
const User = require("../models/user");

exports.toggleFollow = async (req, res) => {
    try {
        const toUser = await User.findById(req.params.id);
        
        if (toUser && toUser.id !== req.user.id){
            // finding same user following if exists
            await req.user.populate("following");
            const isFollowing = req.user.following.find(e => e.to_user.toString() === req.params.id);
            
            if (isFollowing){
                // remove following
                req.user.following.pull(isFollowing._id);
                await req.user.save();
                
                toUser.followers.pull(isFollowing._id);
                await toUser.save();
                
                const oldFollow = await Follow.findByIdAndRemove(isFollowing._id);

                return res.status(200).json({
                    data: {
                        follow: oldFollow
                    },
                    message: "Unfollowed successfully"
                });
            }
            else {
                // add following
                const newFollow = await Follow.create({
                    by_user: req.user._id,
                    to_user: toUser._id
                });
                
                req.user.following.push(newFollow._id);
                await req.user.save();
                
                toUser.followers.push(newFollow._id);
                await toUser.save();

                return res.status(200).json({
                    data: {
                        follow: newFollow
                    },
                    message: "Followed successfully"
                });
            }
        }

        return res.status(404).json({
            data: null,
            message: "Invalid user id"
        });
    } catch (err) {
        console.log("Error : ", err);
        return;
    }
}