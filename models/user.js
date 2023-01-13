const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const AVATAR_PATH = "/uploads/users/avatars/";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        // minLength: 8
    },
    avatar: {
        type: String,
        default: "/images/profile.webp"
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Follow"
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Follow"
        }
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        }
    ],
}, {
    timestamps: true
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", AVATAR_PATH));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    }
})

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error('You can upload only image files'), false);
    };
}

// Static methords
userSchema.statics.uploadedAvatar = multer({ storage, fileFilter: imageFileFilter }).single("avatar");
userSchema.statics.AVATAR_PATH = AVATAR_PATH;

const User = mongoose.model("User", userSchema);
module.exports = User;