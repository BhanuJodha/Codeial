const mongoose = require("mongoose");

const resetPasswordTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    accessToken: {
        type: String,
        require: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: 180 }
    }
}, {
    timestamps: true
});


const ResetPasswordToken = mongoose.model("Reset_Password_Token", resetPasswordTokenSchema);

module.exports = ResetPasswordToken;