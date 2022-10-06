const User = require("../models/user");
const Chat = require("../models/chat");
const jwt = require("jsonwebtoken");
require("../models/message");

exports.openChat = async (req, res) => {
    try {
        const person = await User.findById(req.params.id).populate("chats");
        if (person && req.params.id !== req.user.id) {
            // check whether previous chat store or not
            let chat = person.chats.find(chat => (chat.user1 == req.user.id || chat.user2 == req.user.id));

            if (chat) {
                // hideing chat id from user
                chat = await chat.populate({
                    path: "messages",
                    select: "-onChat",
                    options: {
                        sort: "-createdAt"
                    }
                });
            }
            else {
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

            let authToken = jwt.sign({
                chatId: chat.id,
                person: {
                    _id: person.id,
                    name: person.name,
                },
                _id: req.user.id,
                name: req.user.name
            }, "Secure3D", { expiresIn: "300000" });

            return res.status(200).json({
                data: {
                    authToken: authToken,
                    person: {
                        _id: person.id,
                        name: person.name,
                        avatar: person.avatar
                    },
                    messages: chat.messages
                },
                message: "Token generated successfully"
            })
        }
        return res.status(404).json({
            data: null,
            message: "User not found"
        })
    } catch (err) {
        console.log(err);
    }
}
