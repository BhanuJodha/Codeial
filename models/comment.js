const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        require: true
    }
},
{
    timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;