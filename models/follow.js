const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    by_user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    }
}, {
    timestamps: true
})

const Follow = mongoose.model("Follow",followSchema);

module.exports = Follow;