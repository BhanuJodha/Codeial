const User = require("../../../models/user");
const Chat = require("../../../models/chat");

exports.getChat = async (req, res) => {
    try {
        const person = await User.findById(req.params.id);
        if (person && person.id !== req.user.id) {
            // check whether previous chat store or not
            let chat = await Chat.findOne({
                $or: [
                    {
                        user1: req.user.id,
                        user2: person
                    },
                    {
                        user1: person,
                        user2: req.user.id
                    }
                ]
            }, "messages", {
                populate: [
                    // {
                    //     path: user1,
                    //     select: "name avatar email"
                    // },
                    // {
                    //     path: user2,
                    //     select: "name avatar email"
                    // },
                    {
                        path: "messages",
                        select: "content sender reciver",
                        options: {
                            sort: "-createdAt"
                        }
                    }
                ]
            })

            if (!chat) {
                // create new chat
                chat = await Chat.create({
                    user1: req.user._id,
                    user2: person._id
                });

                person.chats.push(chat._id);
                await person.save();

                req.user.chats.push(chat._id);
                await req.user.save();
            }
            
            return res.status(200).json({
                data: {
                    chat
                },
                success: true,
                message: "Chat of " + person.name
            });
        }

        return res.status(404).json({
            data: null,
            success: false,
            message: "Invalid user id"
        })

    } catch (err) {
        res.status(500).json({
            data: null,
            success: false,
            message: err.message
        })
    }
}