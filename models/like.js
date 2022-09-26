const mongoose = require("mongoose");

// A polymorphic relationship
const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: "onModel"
    },
    onModel: {
        type: String,
        require: true,
        enum: ["Post", "Comment"]   
    }
}, {
    timestamps: true
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;