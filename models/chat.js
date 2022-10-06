const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ],
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }
}, {
    timestamps: true
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;