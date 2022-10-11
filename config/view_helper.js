const fs = require("fs");
const env = require("./environment");
const path = require("path");

module.exports = (app) => {
    app.locals.assetPath = (filePath) => {
        if (env.name === "Devlopment"){
            return filePath;
        }
        filePath = filePath.slice(1);
        const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "../public/assets/rev-manifest.json")));

        return "/" + manifest[filePath];
    }
}