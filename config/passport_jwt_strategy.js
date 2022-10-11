const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const env = require("./environment");

passport.use(new JwtStrategy({
    secretOrKey: env.jwt_secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true
}, (req, payload, done) => {
    console.log("Authenticate",payload.name);
    User.findById(payload._id, (err, user) => {
        if (err){
            console.log(err);
            return done(err, false);
        }
        if(user){
            req.payload = payload;
            return done(null, user);
        }
        return done(new Error("User not found"), false);
    })
}));


module.exports = passport;