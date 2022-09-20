const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");


const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "bhanupratap9828103466",
        pass: "cwhhuyrpgslammqh"
    }
});

const renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, "../views/mailers", relativePath),
        data,
        (err, template) => {
            if (err){
                return console.log("Error in rendering ejs :",err);
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter,
    renderTemplate
}