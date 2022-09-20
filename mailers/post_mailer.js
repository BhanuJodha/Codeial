const nodeMailer = require("../config/nodemailer");

exports.newPost = (post) => {
    nodeMailer.transporter.sendMail({
        subject: "New post on codeial",
        from: "bhanupratap9828103466@gmail.com",
        to: post.user.email,
        html: nodeMailer.renderTemplate({post}, "/posts/new_post.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    })
}

exports.deletePost = (post) => {
    nodeMailer.transporter.sendMail({
        subject: "Delete a post from codeial",
        from: "bhanupratap9828103466@gmail.com",
        to: post.user.email,
        html: nodeMailer.renderTemplate({post}, "/posts/delete_post.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    })
}