const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const download = require("download");
const path = require("path");
const env = require("./environment");

passport.use(new GoogleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url
}, async (accessToken, refershToken, profile, done) => {
    try {
        // Find user in DB
        let user = await User.findOne({ email: profile.emails[0].value });

        // If user not available then create a new user
        if (!user) {
            user = await User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                password: crypto.randomBytes(20).toString("hex")
            });
            
            if (profile.photos[0]){
                // Downloading avatar from google if available
                let filename = "avatar-" + Date.now();
                await download(profile.photos[0].value, path.join(__dirname, "..", User.AVATAR_PATH), {filename});
    
                user.avatar = User.AVATAR_PATH + filename;
                await user.save();
            }
        }

        return done(null, user);

    } catch (err) {
        if (err) {
            console.log("Google aouth err : ", err);
            return done(err, false);
        }
    }
}
))