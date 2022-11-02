const passport = require("passport");
const Message = require("../models/message");
const Chat = require("../models/chat");
const env = require("./environment");

module.exports = (chatServer) => {
    const io = require("socket.io")(chatServer, {
        cors: {
            origin: env.cros_origin,
            methods: ["GET", "POST"]
        }
    });

    // Authenticating using JWT
    io.use((socket, next) => {
        passport.authenticate("jwt", {session: false, failWithError: new Error("Token Expires")})(socket.request, {}, next);
    })
    
    io.on("connection", (socket) => {
        console.log("New socket", socket.id);
        console.log("Join room", socket.request.payload.chatId);
        // join the current socket in chat room
        socket.join(socket.request.payload.chatId);

        socket.on("disconnect", () => {
            console.log("Socket disconnected :", socket.request.user.name);
        })

        // user emit a new message
        socket.on("send-message", async (message) => {
            // add new message to database
            const newMessage = await Message.create({
                content: message,
                sender: socket.request.user._id,
                reciver: socket.request.payload.person._id,
                onChat: socket.request.payload.chatId
            });

            await Chat.findByIdAndUpdate(socket.request.payload.chatId, {$push: {messages: newMessage._id}});

            // send message to active user
            socket.broadcast.to(socket.request.payload.chatId).emit("new-message", message);
        })
    })
}