const nodeMailer = require("../config/nodemailer");
const env = require("../config/environment");

exports.newComment = (comment) => {
    nodeMailer.transporter.sendMail({
        from: env.smtp.auth.user,
        to: comment.user.email,
        subject: "New comment on codeial",
        html: nodeMailer.renderTemplate({comment}, "/comments/new_comment.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    })
}

exports.deleteComment = (comment) => {
    nodeMailer.transporter.sendMail({
        from: env.smtp.auth.user,
        to: comment.user.email,
        subject: "Delete a comment on codeial",
        html: nodeMailer.renderTemplate({comment}, "/comments/delete_comment.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    })
}