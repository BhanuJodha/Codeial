const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("./environment");


const transporter = nodemailer.createTransport(env.smtp);

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