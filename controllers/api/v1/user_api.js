const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../../../models/user");
const env = require("../../../config/environment");

exports.login = async (req, res) => {
    try {
        // feild check
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                data: null,
                success: false,
                message: "Email and password required"
            })
        }

        // find and populate the object
        let user = await User.findOne({ email: req.body.email }, "-following -followers -chats")
        // .populate({
        //     path: "following",
        //     select: "to_user",
        //     populate: {
        //         path: "to_user",
        //         select: "name email avatar"
        //     }
        // })
        // .populate({
        //     path: "followers",
        //     select: "by_user",
        //     populate: {
        //         path: "by_user",
        //         select: "name email avatar"
        //     }
        // })
        .lean();

        // password check
        if (user && user.password === req.body.password) {
            delete user.password;

            return res.status(200).json({
                data: {
                    token: jwt.sign(user, env.jwt_secret, { expiresIn: 100000 }),
                    user
                },
                success: true,
                message: "User token generated successfully"
            })
        }

        return res.status(404).json({
            data: null,
            success: false,
            message: "Invalid username or password"
        })

    } catch (err) {
        return res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}

exports.signup = async (req, res) => {
    try {
        let badReqMessage;
        if (!req.body.email || !req.body.password || !req.body.name || !req.body.confirm_password) {
            badReqMessage = "All fields are mandatory";
        }

        // password check
        else if (req.body.password === req.body.confirm_password) {
            // if already exist
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                user = await User.create(req.body);
                user = await User.find(user, "name email");

                return res.status(201).json({
                    data: {
                        user
                    },
                    message: "Sign up successful, user created",
                    success: true
                });
            }
            else {
                return res.status(400).json({
                    data: null,
                    message: "You have already signed up, please login",
                    success: true
                });
            }
        }
        else {
            badReqMessage = "Confirm password does not match password";
        }
        return res.status(400).json({
            data: null,
            message: badReqMessage,
            success: false
        });

    } catch (err) {
        return res.status(500).json({
            data: null,
            message: err.message,
            success: false
        });
    }
}

exports.editUser = async (req, res) => {
    try {        
        let user = req.user;
        
        return User.uploadedAvatar(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    data: null,
                    message: err.message,
                    success: false
                });
            }
            
            if (!req.body.name) {
                return res.status(400).json({
                    data: null,
                    message: "Name is mandatory",
                    success: false
                });
            }

            if (req.file) {
                // For removing old avatar
                if (user.avatar !== "/images/profile.webp" && fs.existsSync(path.join(__dirname, "../../../", user.avatar))) {
                    fs.unlinkSync(path.join(__dirname, "../../../", user.avatar));
                }
                user.avatar = User.AVATAR_PATH + req.file.filename;
            }

            user.name = req.body.name;

            // if password exist 
            if (req.body.password) {
                if (req.body.password === req.body.confirm_password) {
                    user.password = req.body.password;
                }
                else {
                    return res.status(400).json({
                        data: null,
                        message: "Confirm password does not match password",
                        success: false
                    });
                }
            }

            await user.save();
            user = await User.findById(user, "-password -following -followers -chats").lean();

            return res.status(200).json({
                data: {
                    token: jwt.sign(user, env.jwt_secret, { expiresIn: 100000 })
                },
                message: "Profile updated successfully",
                success: true
            })
        });

    } catch (err) {
        return res.status(500).status({
            data: null,
            message: err.message,
            success: false
        });
    }
}

exports.userInfo = (req, res) => {
    User.findById(req.params.id, "name email avatar", (err, user) => {
        if (err) {
            return res.status(500).json({
                data: null,
                success: false,
                message: err.message
            })
        }
        if (user) {
            return res.status(200).json({
                data: {
                    user
                },
                success: true,
                message: "User with id: " + user.id
            })
        }
        return res.status(400).json({
            data: null,
            success: false,
            message: "Invalid user id"
        })
    });
}

exports.searchUsers = (req, res) => {
    if (req.query.text.length < 3) {
        return res.status(400).json({
            data: null,
            success: false,
            message: "Invalid search text"
        })
    }

    User.find({ name: new RegExp(req.query.text, "i") }, "name email avatar", (err, users) => {
        if (err) {
            return res.status(500).json({
                data: null,
                success: false,
                message: err.message
            })
        }
        return res.status(200).json({
            data: {
                users
            },
            success: true,
            message: "All matching users"
        })
    })

}

exports.checkGoogleAuth =  async (req, res) => {
    try {
        console.log(req.user)
        // user check
        if (!req.isAuthenticated() || !req.user) {
            return res.status(200).json({
                data: null,
                success: false,
                message: "Not authenticated by google"
            })
        }

        // filter the object
        let user = await User.findById(req.user._id, "-following -followers -chats -password").lean();

        // logout for google authentication
        req.logout((err)=>{
            console.error(err)
        });

        return res.status(200).json({
            data: {
                token: jwt.sign(user, env.jwt_secret, { expiresIn: 100000 }),
                user
            },
            success: true,
            message: "Google authentication successful"
        })
        

    } catch (err) {
        return res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}