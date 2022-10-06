const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    onChat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        require: true
    }
},{
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;