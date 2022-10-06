const chatContainer = $("#chat-boxes");

class ChatEngine {
    constructor(messageBox, authToken) {
        this.messageBox = messageBox;
        this.authToken = authToken;

        this.socket = io.connect("http://localhost:5000", {
            extraHeaders: {
                Authorization: "Bearer " + authToken,
            },
        });
        this.#connectionHandler();
    }

    #connectionHandler() {
        this.socket.on("connect", () => {
            console.log("Connection established using socket");
        })

        // event listening for incomming messages
        this.socket.on("new-message", (message) => {
            // append message
            this.messageBox.append(`<li>${message}</li>`);
        })
    }

    sendMessage(message) {
        this.socket.emit("send-message", message);
    }
}

const toggleChat = (toggler) => {
    if (toggler.text() === "minimize") {
        toggler.text("open_in_full");
        toggler.parent().nextAll().css("display", "none");
    }
    else {
        toggler.text("minimize");
        toggler.parent().next().css("display", "flex").next().css("display", "block");
    }
}

const openChat = (target) => {
    const personId = target.data("person");
    // check if chat box open or not
    if (chatContainer.children(`.chat-container[data-person='${personId}']`).length === 0) {
        $.ajax({
            url: "http://127.0.0.1:8000/chat/" + personId,
            type: "get",
            success: (data) => {
                // Storing messageBox instance
                let messageBox = renderChatBox(data);
                // Connecting to chat server
                let chatEngine = connectChatServer(messageBox, data.data.authToken);

                // adding event listener for close button
                messageBox.prev().children(".close-chat").click((e) => {
                    messageBox.parent().remove();
                    chatEngine.socket.disconnect();
                    console.log("Socket disconnected");
                })
            },
            error: (err) => {
                error(err.responseText);
            }
        })
    }
}

const renderChatBox = (data) => {
    const chatBox = $(`<div class='chat-container' data-person='${data.data.person._id}'></div>`);

    chatBox.html(`
        <div class="chat-header">
            <img src="${data.data.person.avatar}">
            <span class="name">${data.data.person.name.slice(0, 20)}</span>
            <span class="material-symbols-outlined toggle-chat">minimize</span>
            <span class="material-symbols-outlined close-chat">
            close
            </span>
        </div>
        `);

    const messageBox = $(`<div class='message'></div>`);

    for (const i of data.data.messages) {
        if (i.reciver === data.data.person._id) {
            messageBox.append(`
                    <li class="send">${i.content}</li>
            `);
        }
        else {
            messageBox.append(`
                    <li>${i.content}</li>
            `);
        }
    }

    chatBox.append(messageBox);
    chatBox.append(`
        <div class="send-message">
            <form>
                <textarea name="message" rows="1" placeholder="Type your message here" required></textarea>
                <button type="submit">Send</button>
            </form>
        </div>
        `);

    chatContainer.append(chatBox);

    return messageBox;
}

const connectChatServer = (messageBox, authToken) => {
    // attach instance of socket with event listener
    let chatEngine = new ChatEngine(messageBox, authToken);
    messageBox.next().children("form").submit((e) => {
        let target = $(e.target);
        e.preventDefault();
        let message = target.children("textarea").val();
        chatEngine.sendMessage(message);
        chatEngine.messageBox.append(`<li class="send">${message}</li>`)
        target.children("textarea").val("");
    });
    return chatEngine;
}

const clickHandler = (e) => {
    if (e.target.classList[1] === "toggle-chat") {
        toggleChat($(e.target));
    }
    else if (e.target.classList[1] === "open-chat") {
        e.preventDefault();
        openChat($(e.target));
    }
}

// Event handler
$(document).click(clickHandler);