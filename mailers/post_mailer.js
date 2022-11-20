const nodeMailer = require("../config/nodemailer");
const env = require("../config/environment");

exports.newPost = (post) => {
    nodeMailer.transporter.sendMail({
        subject: "New post on codeial",
        from: env.smtp.auth.user,
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
        from: env.smtp.auth.user,
        to: post.user.email,
        html: nodeMailer.renderTemplate({post}, "/posts/delete_post.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    })
}