module.exports.pro = (req, res)=>{
    res.end(JSON.stringify({
        user: "bhanu",
        password: "noob001",
        secure: true,
        url: req.url
    }))
}

module.exports.user = (req, res) =>{
    res.render("user_profile",{
        title: "Users Page"
    });
}