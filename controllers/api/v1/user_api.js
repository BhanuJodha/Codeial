const jwt = require("jsonwebtoken");
const User = require("../../../models/user");

module.exports.createSession = async (req, res)=>{
    try {
        let user = await User.findOne({email: req.body.email}).lean();
    
        if (user && user.password === req.body.password){
            return res.status(200).json({
                data: {
                    token: jwt.sign(user, "Secure3D", {expiresIn: "100000"})
                },
                message: "Success on token"
            })
        }
    
        return res.status(404).json({
            data: null,
            message: "User not found"
        })
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            data: null,
            message: "Internal server error"
        })
    }
}