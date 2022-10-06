const http = require("http");

module.exports = (app) => {
    const chatServer = http.Server(app);
    require("./chat_socket")(chatServer);
    chatServer.listen(5000, () => {
        console.log("Chat server is listening on port", 5000);
    })
}