const http = require("http");
const env = require("./environment");

module.exports = (app) => {
    const chatServer = http.Server(app);
    const io = require("socket.io")(chatServer, {
        cors: {
            origin: env.cros_origin,
            methods: ["GET", "POST"]
        }
    });
    // chat handler
    require("../socket handlers/chat_handler")(io);
    chatServer.listen(5000, () => {
        console.log("Chat server is listening on port", 5000);
    })
}