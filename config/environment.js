const rfs = require("rotating-file-stream");
const path = require("path");

// creating rotating file stream
const accessLogStream = rfs.createStream("access.log", {
    interval: "1d",
    path: path.join(__dirname, "../production_logs")
})

const devlopment = {
    name: "Devlopment",
    asset_path: "./assets",
    session_cookie_key: "Secure3D",
    cros_origin: "http://127.0.0.1:8000",
    db: "codial_devlopment",
    smtp: {
        host: "us2.smtp.mailhostbox.com",
        port: 587,
        secure: false,
        auth: {
            user: "codeial@bhanujodha.tech",
            pass: "^RfoEOj9"
        }
    },
    google_client_id: "925898070036-oc8fmd2vvcpu10j2l0nh23n3rue9rsk2.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/user/oauth/google/callback",
    jwt_secret: "Secure3D",
    morgan: {
        mode: "dev",
        options: {stream: accessLogStream}
    }
}

const production = {
    name: "Production",
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    cros_origin: process.env.CODEIAL_CROS_ORIGIN,
    db: process.env.CODEIAL_DB,
    smtp: {
        host: process.env.CODEIAL_SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_SMTP_USERNAME,
            pass: process.env.CODEIAL_SMTP_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALL_BACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: "combined",
        options: {stream: accessLogStream}
    }
}

module.exports = process.env.NODE_ENV === undefined ? devlopment : production;