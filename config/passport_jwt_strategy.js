const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

passport.use(new JwtStrategy({
    secretOrKey: "Secure3D",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
    console.log(payload, Date.now())
    User.findById(payload._id, (err, user) => {
        if (err){
            console.log(err);
            return done(err, false);
        }
        if(user){
            return done(null, user);
        }
        return done(null, false);
    })
}));


module.exports = passport;