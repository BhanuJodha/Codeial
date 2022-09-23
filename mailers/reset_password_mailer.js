const nodeMailer = require("../config/nodemailer");

exports.resetLink = (token) => {
    nodeMailer.transporter.sendMail({
        from: "bhanupratap9828103466@gmail.com",
        to: token.user.email,
        subject: "Password reset link",
        html: nodeMailer.renderTemplate({token}, "/forgot_password/reset_link.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    });
}

exports.passwordChanged = (token) => {
    nodeMailer.transporter.sendMail({
        from: "bhanupratap9828103466@gmail.com",
        to: token.user.email,
        subject: "Password changed successfully",
        html: nodeMailer.renderTemplate({token}, "/forgot_password/password_changed.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    });
}