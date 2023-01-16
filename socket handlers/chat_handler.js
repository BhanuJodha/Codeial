const passport = require("passport");
const Message = require("../models/message");
const Chat = require("../models/chat");

module.exports = (io) => {
    const userSocketDictionary = {};

    // Authenticating using JWT
    io.use((socket, next) => {
        passport.authenticate("jwt", {session: false, failWithError: new Error("Token Expires")})(socket.request, {}, next);
    })
    
    io.on("connection", (socket) => {
        console.log("New socket", socket.request.user.name);
        // Add user and socket to dictionary
        userSocketDictionary[socket.request.user.id] = socket.id;

        socket.on("disconnect", () => {
            console.log("Socket disconnected :", socket.request.user.name);
            // Remove socket from dictionary
            delete userSocketDictionary[socket.request.user.id];
        })

    
        // user emit a new message
        socket.on("send-message", async (messageObj, cb) => {
            // messageObj look like => {
            //     chat_id: ObjectId,
            //     message: String,
            //     receiver: ObjectId
            // }
            
            // security check
            const chat = await Chat.findById(messageObj.chat_id);
            if (chat && (chat.user1.toString() === socket.request.user.id || chat.user2.toString() === socket.request.user.id)){
                // add new message to database
                const newMessage = await Message.create({
                    content: messageObj.message,
                    sender: socket.request.user._id,
                    reciver: messageObj.receiver,
                    onChat: chat._id
                });

                chat.messages.push(newMessage);
                await chat.save();

                // send message to active user
                io.to(userSocketDictionary[messageObj.receiver]).emit("new-message", newMessage);

                // send acknowelegement
                cb({
                    success: true,
                    messageObj: newMessage
                })
            }

            cb({
                success: false
            })
        })
    })
}